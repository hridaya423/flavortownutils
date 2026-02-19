

const STATUS_PATTERNS = [
  { status: 'done', patterns: [/\bdone\b/i, /\bcompleted\b/i, /\bcomplete\b/i, /\bfinished\b/i] },
  { status: 'in_progress', patterns: [/\bin progress\b/i, /\bdoing\b/i, /\bwip\b/i] },
  { status: 'todo', patterns: [/\btodo\b/i, /\bto do\b/i] }
];

function parseStatus(text) {
  const lowerText = text.toLowerCase();
  for (const { status, patterns } of STATUS_PATTERNS) {
    if (patterns.some(pattern => pattern.test(lowerText))) {
      return status;
    }
  }
  return 'todo';
}

function parseProjectName(text) {
  const match = text.match(/\b(on|for|in)\s+(?!progress\b)["']?([^"'\n]+?)["']?(?:\s*$|\s+(?:as|to)\s)/i);
  if (match) {
    return match[2].trim().replace(/["']/g, '');
  }
  return null;
}

function parseTaskText(text, context) {
  if (context?.threadRootText) {
    return context.threadRootText.trim() || 'New task';
  }
  
  let taskText = text
    .replace(/<@[A-Z0-9]+>/g, '')
    .replace(/@(ftutils|flavortownutils?)/gi, '')
    .trim();
  
  taskText = taskText.replace(/^add\s+/i, '');
  taskText = taskText.replace(/\s+(?:to|as)\s+(?:todo|in progress|done|doing)\b.*$/i, '');
  taskText = taskText.replace(/\s+doing\b(?=\s+(?:on|for|in)\s)/i, '');
  taskText = taskText.replace(/\s+(?:on|for|in)\s+["']?[^"'\n]+["']?\s*$/i, '');
  
  return taskText.trim() || 'New task';
}

function normalizeKey(name) {
  return (name || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
}

const TASK_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function cleanExpiredTasks(todos) {
  const now = Date.now();
  let modified = false;

  if (!todos.users) return { modified, todos };

  for (const userKey of Object.keys(todos.users)) {
    const user = todos.users[userKey];
    if (!user.projects) continue;

    for (const projectKey of Object.keys(user.projects)) {
      const project = user.projects[projectKey];
      if (!project.tasks) continue;

      const originalLength = project.tasks.length;
      project.tasks = project.tasks.filter(task => {
        const expiresAt = task.expiresAt || (task.createdAt ? new Date(task.createdAt).getTime() + TASK_TTL_MS : 0);
        return now < expiresAt;
      });

      if (project.tasks.length !== originalLength) {
        modified = true;
      }

      if (project.tasks.length === 0) {
        delete user.projects[projectKey];
        modified = true;
      }
    }

    if (Object.keys(user.projects).length === 0) {
      delete todos.users[userKey];
      modified = true;
    }
  }

  return { modified, todos };
}

async function getTodos(env) {
  try {
    const data = await env.TODOS_KV.get('todos');
    if (data) {
      let todos = JSON.parse(data);
      const { modified, todos: cleanedTodos } = cleanExpiredTasks(todos);
      if (modified) {
        await saveTodos(env, cleanedTodos);
      }
      return cleanedTodos;
    }
  } catch (e) {
    console.error('Error loading todos:', e);
  }
  return { lastUpdated: new Date().toISOString(), users: {} };
}

async function saveTodos(env, todos) {
  todos.lastUpdated = new Date().toISOString();
  await env.TODOS_KV.put('todos', JSON.stringify(todos));
}

async function checkRateLimit(env, userId, action = 'task', limit = 5, windowMs = 60000) {
  const key = `ratelimit:${action}:${userId}`;
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;

  let data = await env.TODOS_KV.get(key);
  data = data ? JSON.parse(data) : { count: 0, window: windowStart };

  if (data.window !== windowStart) {
    data = { count: 0, window: windowStart };
  }

  if (data.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((data.window + windowMs - now) / 1000) };
  }

  data.count++;
  await env.TODOS_KV.put(key, JSON.stringify(data), { expirationTtl: 120 });
  return { allowed: true };
}

async function addTask(env, taskText, status, projectName, slackMeta) {
  const todos = await getTodos(env);

  if (!todos.users) {
    todos.users = {};
  }

  const displayName = slackMeta.displayName || slackMeta.username;
  const userKey = normalizeKey(displayName);

  if (!todos.users[userKey]) {
    todos.users[userKey] = {
      projects: {}
    };
  }

  const normalizedProjectName = projectName.toLowerCase().trim();

  if (!todos.users[userKey].projects[normalizedProjectName]) {
    todos.users[userKey].projects[normalizedProjectName] = {
      name: projectName,
      tasks: []
    };
  }

  const project = todos.users[userKey].projects[normalizedProjectName];
  const normalizedTaskText = taskText.toLowerCase().trim();

  const existingTaskIndex = project.tasks.findIndex(
    t => t.title.toLowerCase().trim() === normalizedTaskText
  );

  if (existingTaskIndex !== -1) {
    project.tasks[existingTaskIndex].status = status;
    project.tasks[existingTaskIndex].updatedAt = new Date().toISOString();
    await saveTodos(env, todos);
    return { ...project.tasks[existingTaskIndex], updated: true };
  }

  const task = {
    id: `slack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: taskText,
    status: status,
    slackUserId: slackMeta.userId,
    slackPermalink: slackMeta.permalink,
    createdAt: new Date().toISOString(),
    expiresAt: Date.now() + TASK_TTL_MS
  };

  project.tasks.push(task);
  await saveTodos(env, todos);

  return task;
}

async function handleSlackEvent(event, env, ctx) {
  const { type, event: slackEvent } = event;

  if (type === 'url_verification') {
    return new Response(event.challenge, { status: 200 });
  }

  if (type === 'event_callback' && slackEvent.type === 'app_mention') {
    ctx.waitUntil(processAppMention(slackEvent, env));
    return new Response('OK', { status: 200 });
  }

  return new Response('Event not handled', { status: 200 });
}

async function processAppMention(slackEvent, env) {
  try {
    const rateLimit = await checkRateLimit(env, slackEvent.user, 'task', 5, 60000);
    if (!rateLimit.allowed) {
      await postSlackMessage(
        slackEvent.channel,
        `Whoa there! You're adding tasks too fast. Please wait ${rateLimit.retryAfter} seconds before trying again.`,
        slackEvent.thread_ts || slackEvent.ts,
        env.SLACK_BOT_TOKEN
      );
      return;
    }

    let threadRootText = null;
    if (slackEvent.thread_ts && slackEvent.thread_ts !== slackEvent.ts) {
      try {
        const threadInfo = await slackApiRequest(
          'conversations.replies',
          { channel: slackEvent.channel, ts: slackEvent.thread_ts, limit: 1 },
          env.SLACK_BOT_TOKEN
        );
        if (threadInfo.messages && threadInfo.messages[0]) {
          threadRootText = threadInfo.messages[0].text;
        }
      } catch (e) {
        console.warn('Could not fetch thread root:', e);
      }
    }

    const parseContext = { threadRootText };
    const taskText = parseTaskText(slackEvent.text, parseContext);
    const status = parseStatus(slackEvent.text);
    const projectName = parseProjectName(slackEvent.text);

    if (!projectName) {
      await postSlackMessage(
        slackEvent.channel,
        "I need to know which project! Try: `@ftutils add [task] to TODO on [project name]`",
        slackEvent.thread_ts || slackEvent.ts,
        env.SLACK_BOT_TOKEN
      );
      return;
    }

    let userInfo = { username: slackEvent.user, displayName: slackEvent.user };
    try {
      const userData = await slackApiRequest(
        'users.info',
        { user: slackEvent.user },
        env.SLACK_BOT_TOKEN
      );
      if (userData.ok && userData.user) {
        userInfo = {
          username: userData.user.name,
          displayName: userData.user.profile.display_name || userData.user.profile.real_name || userData.user.name
        };
      }
    } catch (e) {
      console.warn('Could not fetch user info:', e);
    }

    let permalink = null;
    try {
      const permData = await slackApiRequest(
        'chat.getPermalink',
        { channel: slackEvent.channel, message_ts: slackEvent.ts },
        env.SLACK_BOT_TOKEN
      );
      permalink = permData.permalink;
    } catch (e) {
      console.warn('Could not get permalink:', e);
    }

    const slackMeta = {
      userId: slackEvent.user,
      username: userInfo.username,
      displayName: userInfo.displayName,
      permalink: permalink
    };

    const task = await addTask(env, taskText, status, projectName, slackMeta);

    const statusEmoji = {
      todo: '📝',
      in_progress: '🔄',
      done: '✅'
    };

    const actionText = task.updated ? 'Updated' : 'Added';
    await postSlackMessage(
      slackEvent.channel,
      `${actionText} "${task.title}" ${statusEmoji[status]} on ${projectName}`,
      slackEvent.thread_ts || slackEvent.ts,
      env.SLACK_BOT_TOKEN
    );

    console.log(`Task ${task.updated ? 'updated' : 'added'}:`, task.title, 'by:', userInfo.username);

  } catch (error) {
    console.error('Error handling mention:', error);
    await postSlackMessage(
      slackEvent.channel,
      "Oops! Something went wrong. Please try again.",
      slackEvent.thread_ts || slackEvent.ts,
      env.SLACK_BOT_TOKEN
    );
  }
}

async function slackApiRequest(method, params, token) {
  const url = new URL(`https://slack.com/api/${method}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response.json();
}

async function postSlackMessage(channel, text, threadTs, token) {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      channel: channel,
      text: text,
      thread_ts: threadTs
    })
  });

  return response.json();
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/') {
      return new Response('Flavortown Todo Bot is running!', { status: 200 });
    }

    if (url.pathname === '/slack/events' && request.method === 'POST') {
      try {
        const body = await request.json();
        return await handleSlackEvent(body, env, ctx);
      } catch (e) {
        console.error('Error handling request:', e);
        return new Response('Error', { status: 500 });
      }
    }
    if (url.pathname === '/todos.json') {
      try {
        const todos = await getTodos(env);
        return new Response(JSON.stringify(todos, null, 2), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (e) {
        console.error('Error fetching todos:', e);
        return new Response('Error', { status: 500 });
      }
    }

    return new Response('Not found', { status: 404 });
  }
};