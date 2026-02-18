require('dotenv').config();
const { App } = require('@slack/bolt');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const TODOS_PATH = path.join(DATA_DIR, 'todos.json');

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;

if (!SLACK_BOT_TOKEN || !SLACK_APP_TOKEN) {
  console.error('Error: SLACK_BOT_TOKEN and SLACK_APP_TOKEN required');
  process.exit(1);
}

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

function loadTodos() {
  try {
    if (fs.existsSync(TODOS_PATH)) {
      return JSON.parse(fs.readFileSync(TODOS_PATH, 'utf8'));
    }
  } catch (e) {
    console.warn('Could not load todos:', e.message);
  }
  return { lastUpdated: new Date().toISOString(), users: {} };
}

function saveTodos(todos) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  todos.lastUpdated = new Date().toISOString();
  fs.writeFileSync(TODOS_PATH, JSON.stringify(todos, null, 2));
}

async function getUserInfo(client, userId) {
  try {
    const result = await client.users.info({ user: userId });
    if (result.ok && result.user) {
      return {
        id: userId,
        username: result.user.name,
        displayName: result.user.profile.display_name
      };
    }
  } catch (e) {
    console.warn('Could not fetch user info:', e.message);
  }
  return { id: userId, username: userId, displayName: userId };
}

function normalizeKey(name) {
  return (name || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
}

function addTask(taskText, status, projectName, slackMeta) {
  const todos = loadTodos();

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
    saveTodos(todos);
    return { ...project.tasks[existingTaskIndex], updated: true };
  }

  const task = {
    id: `slack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: taskText,
    status: status,
    slackUserId: slackMeta.userId,
    slackPermalink: slackMeta.permalink,
    createdAt: new Date().toISOString()
  };

  project.tasks.push(task);
  saveTodos(todos);

  return task;
}

const app = new App({
  token: SLACK_BOT_TOKEN,
  appToken: SLACK_APP_TOKEN,
  socketMode: true,
  port: process.env.PORT || 3000
});

app.event('app_mention', async ({ event, client }) => {
  try {
    
    let threadRootText = null;
    if (event.thread_ts && event.thread_ts !== event.ts) {
      try {
        const threadInfo = await client.conversations.replies({
          channel: event.channel,
          ts: event.thread_ts,
          limit: 1
        });
        
        if (threadInfo.messages && threadInfo.messages[0]) {
          threadRootText = threadInfo.messages[0].text;
        }
      } catch (e) {
        console.warn('Could not fetch thread root:', e.message);
      }
    }
    
    const parseContext = { threadRootText };
    const taskText = parseTaskText(event.text, parseContext);
    const status = parseStatus(event.text);
    const projectName = parseProjectName(event.text);
    
    if (!projectName) {
      await client.chat.postMessage({
        channel: event.channel,
        thread_ts: event.thread_ts || event.ts,
        text: "I need to know which project! Try: `@ftutils add [task] to TODO on [project name]`"
      });
      return;
    }
    
    let permalink = null;
    try {
      const permResponse = await client.chat.getPermalink({
        channel: event.channel,
        message_ts: event.ts
      });
      permalink = permResponse.permalink;
    } catch (e) {
      console.warn('Could not get permalink:', e.message);
    }
    
    const userInfo = await getUserInfo(client, event.user);
    
    const slackMeta = {
      userId: event.user,
      username: userInfo.username,
      displayName: userInfo.displayName,
      permalink: permalink
    };
    
    const task = addTask(taskText, status, projectName, slackMeta);

    const statusEmoji = {
      todo: '📝',
      in_progress: '🔄',
      done: '✅'
    };

    const actionText = task.updated ? 'Updated' : 'Added';
    await client.chat.postMessage({
      channel: event.channel,
      thread_ts: event.thread_ts || event.ts,
      text: `${actionText} "${task.title}" ${statusEmoji[status]} on ${projectName}`
    });

    console.log(`Task ${task.updated ? 'updated' : 'added'}:`, task.id || task.title, 'by:', userInfo.username, 'project:', projectName);
    
  } catch (error) {
    console.error('Error handling mention:', error);
    
    try {
      await client.chat.postMessage({
        channel: event.channel,
        thread_ts: event.thread_ts || event.ts,
        text: "Oops! Something went wrong. Please try again."
      });
    } catch (replyError) {
      console.error('Failed to send error message:', replyError);
    }
  }
});

app.error((error) => {
  console.error('Slack app error:', error);
});

(async () => {
  await app.start();
})();
