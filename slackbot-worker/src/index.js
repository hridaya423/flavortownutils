

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

const FLAVORTOWN_API_BASE = 'https://flavortown.hackclub.com/api/v1';
const FLAVORTOWN_WEB_BASE = 'https://flavortown.hackclub.com';
const PROFILE_CACHE_TTL_MS = 10 * 60 * 1000;
const PROJECT_CACHE_TTL_MS = 20 * 60 * 1000;

const profileCache = new Map();
const projectCache = new Map();

function getFromCache(cache, key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setInCache(cache, key, value, ttlMs) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });
}

function parseMentionedUserIds(text) {
  const ids = [];
  const source = text || '';
  const matches = source.matchAll(/<@([A-Z0-9]+)(?:\|[^>]+)?>/g);
  for (const match of matches) {
    if (match?.[1]) ids.push(match[1]);
  }
  return ids;
}

function parseMentionIntent(slackEvent) {
  const text = slackEvent?.text || '';
  const mentionedUserIds = parseMentionedUserIds(text);
  const botMentionId = mentionedUserIds[0] || null;
  const targetMentionIds = mentionedUserIds.filter(id => id && id !== botMentionId);

  let cleaned = text;
  if (botMentionId) {
    const escapedBotId = botMentionId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    cleaned = cleaned.replace(new RegExp(`<@${escapedBotId}(?:\\|[^>]+)?>`, 'g'), ' ');
  }

  const cleanedWithoutMentions = cleaned
    .replace(/<@[A-Z0-9]+(?:\|[^>]+)?>/g, ' ')
    .replace(/[,:-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const askedForProfileKeyword = /^(profile|user|stats|whois|who\s+is)\b/i.test(cleanedWithoutMentions);

  const isBareMention = cleanedWithoutMentions.length === 0;
  const hasTargetMention = targetMentionIds.length > 0;
  const isTargetOnlyMention = hasTargetMention && cleanedWithoutMentions.length === 0;
  const isProfileRequest = isBareMention || isTargetOnlyMention || askedForProfileKeyword;
  const targetSlackId = hasTargetMention ? targetMentionIds[0] : slackEvent?.user;

  return {
    isProfileRequest,
    targetSlackId,
    cleanedWithoutMentions
  };
}

function formatDurationFromSeconds(value) {
  const seconds = Math.max(0, Math.floor(Number(value) || 0));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
}

function formatNumberOrDash(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return Number(value).toLocaleString();
}

function truncateText(value, maxLength = 120) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

function formatProjectDescriptionForMrkdwn(value, maxLength = 180) {
  let text = String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\u00a0/g, ' ')
    .trim();

  if (!text) return '';
  if (text.length > maxLength) {
    text = `${text.slice(0, maxLength - 1)}…`;
  }

  return text.replace(/\n{3,}/g, '\n\n');
}

function formatUpdatedAt(value) {
  if (!value) return 'unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'unknown';
  try {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return date.toISOString().slice(0, 10);
  }
}

async function flavortownApiRequest(path, env, query = null) {
  if (!env.FLAVORTOWN_API_KEY) {
    return { ok: false, status: 500, data: { error: 'Missing FLAVORTOWN_API_KEY secret' } };
  }

  const url = new URL(`${FLAVORTOWN_API_BASE}${path}`);
  if (query && typeof query === 'object') {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${env.FLAVORTOWN_API_KEY}`,
      'Accept': 'application/json'
    }
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  return {
    ok: response.ok,
    status: response.status,
    data
  };
}

async function fetchFlavortownUserBySlackId(slackId, env) {
  const normalizedSlackId = String(slackId || '').trim();
  if (!normalizedSlackId) return { user: null, error: 'missing_slack_id' };

  const cached = getFromCache(profileCache, normalizedSlackId);
  if (cached) return { user: cached, error: null, fromCache: true };

  const listResult = await flavortownApiRequest('/users', env, { query: normalizedSlackId, page: 1 });
  if (!listResult.ok) {
    return { user: null, error: `users_list_${listResult.status}`, status: listResult.status };
  }

  const users = Array.isArray(listResult.data?.users) ? listResult.data.users : [];
  const listUser = users.find(user => user?.slack_id === normalizedSlackId) || users[0] || null;
  if (!listUser?.id) {
    return { user: null, error: 'user_not_found', status: 404 };
  }

  const detailResult = await flavortownApiRequest(`/users/${encodeURIComponent(String(listUser.id))}`, env);
  if (!detailResult.ok) {
    if (detailResult.status === 404) {
      return { user: null, error: 'user_not_found', status: 404 };
    }
    return { user: null, error: `user_detail_${detailResult.status}`, status: detailResult.status };
  }

  const user = detailResult.data;
  if (!user?.id) {
    return { user: null, error: 'user_detail_invalid' };
  }

  setInCache(profileCache, normalizedSlackId, user, PROFILE_CACHE_TTL_MS);
  return { user, error: null, fromCache: false };
}

async function fetchFlavortownProjectById(projectId, env) {
  const id = Number(projectId);
  if (!Number.isFinite(id) || id <= 0) {
    return { project: null, error: 'invalid_project_id' };
  }

  const cacheKey = String(id);
  const cached = getFromCache(projectCache, cacheKey);
  if (cached) return { project: cached, error: null, fromCache: true };

  const result = await flavortownApiRequest(`/projects/${id}`, env);
  if (!result.ok) {
    return { project: null, error: `project_${result.status}`, status: result.status };
  }

  const project = result.data;
  if (!project?.id) {
    return { project: null, error: 'project_invalid' };
  }

  setInCache(projectCache, cacheKey, project, PROJECT_CACHE_TTL_MS);
  return { project, error: null, fromCache: false };
}

async function fetchProjectsForUser(user, env) {
  const ids = Array.isArray(user?.project_ids) ? user.project_ids : [];
  if (!ids.length) {
    return {
      projects: [],
      partial: false,
      failedCount: 0,
      unavailableCount: 0,
      totalRequested: 0
    };
  }

  const projects = [];
  let failedCount = 0;
  let unavailableCount = 0;
  let rateLimited = false;

  for (const projectId of ids) {
    if (rateLimited) {
      failedCount += 1;
      unavailableCount += 1;
      projects.push({ id: projectId, unavailable: true });
      continue;
    }

    const result = await fetchFlavortownProjectById(projectId, env);
    if (result.project) {
      projects.push(result.project);
      continue;
    }

    failedCount += 1;
    unavailableCount += 1;
    if (result.status === 429) {
      rateLimited = true;
    }

    projects.push({ id: projectId, unavailable: true });
  }

  return {
    projects,
    partial: failedCount > 0,
    failedCount,
    unavailableCount,
    totalRequested: ids.length
  };
}

function getSortedProjects(projectsData) {
  const projects = Array.isArray(projectsData?.projects) ? projectsData.projects : [];
  return projects
    .filter(project => project && !project.unavailable)
    .sort((a, b) => {
      const aTs = a?.updated_at ? new Date(a.updated_at).getTime() : 0;
      const bTs = b?.updated_at ? new Date(b.updated_at).getTime() : 0;
      const aDay = aTs > 0 ? new Date(aTs).toISOString().slice(0, 10) : '';
      const bDay = bTs > 0 ? new Date(bTs).toISOString().slice(0, 10) : '';
      if (aDay !== bDay) return bDay.localeCompare(aDay);

      const aDevlogCount = Array.isArray(a?.devlog_ids) ? a.devlog_ids.length : 0;
      const bDevlogCount = Array.isArray(b?.devlog_ids) ? b.devlog_ids.length : 0;
      if (aDevlogCount !== bDevlogCount) return bDevlogCount - aDevlogCount;

      return bTs - aTs;
    });
}

function buildUserProfileMessage(user, projectsData, targetSlackId) {
  const projects = projectsData?.projects || [];
  const sortedProjects = getSortedProjects(projectsData);
  const topProjects = sortedProjects.slice(0, 3);
  const profileUrl = `${FLAVORTOWN_WEB_BASE}/users/${user.id}`;
  const displayName = user.display_name || `User #${user.id}`;
  const totalProjectCount = Number(projectsData?.totalRequested) || projects.length || sortedProjects.length;

  const lines = [
    `*Flavortown profile:* <${profileUrl}|${displayName}>`,
    `• Slack: <@${targetSlackId}> (\`${user.slack_id || targetSlackId}\`)`,
    `• Cookies: ${formatNumberOrDash(user.cookies)} · Votes: ${formatNumberOrDash(user.vote_count)} · Likes: ${formatNumberOrDash(user.like_count)}`,
    `• Devlog time: ${formatDurationFromSeconds(user.devlog_seconds_total)} total · ${formatDurationFromSeconds(user.devlog_seconds_today)} today`,
    `• Projects: ${totalProjectCount.toLocaleString()}`
  ];

  if (!projects.length) {
    lines.push('');
    lines.push('_No projects found for this user yet._');
    return lines.join('\n');
  }

  if (!sortedProjects.length) {
    lines.push('');
    lines.push('_Projects exist, but details are temporarily unavailable. Try again in a minute._');
    return lines.join('\n');
  }

  lines.push('');
  lines.push(`*Most recent projects (${topProjects.length}):*`);
  lines.push('_Sorted by most recently updated (same-day ties use higher devlog count)_');

  const projectLines = [];
  for (const project of topProjects) {
    const id = project?.id;
    if (!id) continue;

    if (project.unavailable) {
      projectLines.push(`• <${FLAVORTOWN_WEB_BASE}/projects/${id}|Project #${id}> — stats unavailable right now`);
      continue;
    }

    const title = project.title || `Project #${id}`;
    const devlogCount = Array.isArray(project.devlog_ids) ? project.devlog_ids.length : 0;
    const shipStatus = project.ship_status || 'unknown';
    const links = [];
    if (project.repo_url) links.push('repo');
    if (project.demo_url) links.push('demo');
    const linksText = links.length ? ` · ${links.join('/')}` : '';

    const updatedAtText = formatUpdatedAt(project.updated_at);
    projectLines.push(`• <${FLAVORTOWN_WEB_BASE}/projects/${id}|${title}> — ${shipStatus} · ${devlogCount} devlogs · updated ${updatedAtText}${linksText}`);
  }

  lines.push(...projectLines);

  if (sortedProjects.length > topProjects.length) {
    lines.push(`_+${sortedProjects.length - topProjects.length} more projects not shown._`);
  }

  if (projectsData?.partial) {
    lines.push('');
    lines.push(`_Some project stats could not be loaded right now (${projectsData.failedCount}). Try again in a minute._`);
  }

  return lines.join('\n');
}

function buildUserProfileBlocks(user, projectsData, targetSlackId) {
  const profileUrl = `${FLAVORTOWN_WEB_BASE}/users/${user.id}`;
  const sortedProjects = getSortedProjects(projectsData);
  const topProjects = sortedProjects.slice(0, 3);
  const displayName = truncateText(user.display_name || `User #${user.id}`, 120);
  const totalProjectCount = Number(projectsData?.totalRequested)
    || (Array.isArray(projectsData?.projects) ? projectsData.projects.length : 0)
    || sortedProjects.length;

  const blocks = [];

  blocks.push({
    type: 'header',
    text: {
      type: 'plain_text',
      text: displayName,
      emoji: true
    }
  });

  blocks.push({
    type: 'context',
    elements: [
      { type: 'mrkdwn', text: `Slack: <@${targetSlackId}> (\`${user.slack_id || targetSlackId}\`)` }
    ]
  });

  blocks.push({
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: { type: 'plain_text', text: 'Open Profile', emoji: true },
        url: profileUrl
      }
    ]
  });

  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: [
        `*🍪 ${formatNumberOrDash(user.cookies)}* · *🗳 ${formatNumberOrDash(user.vote_count)}* · *❤️ ${formatNumberOrDash(user.like_count)}*`,
        `⏱ ${formatDurationFromSeconds(user.devlog_seconds_total)} total · ${formatDurationFromSeconds(user.devlog_seconds_today)} today · 📦 ${totalProjectCount.toLocaleString()} projects`
      ].join('\n')
    }
  });

  if (!topProjects.length) {
    blocks.push({ type: 'divider' });
    blocks.push({
      type: 'context',
      elements: [{
        type: 'mrkdwn',
        text: totalProjectCount > 0
          ? '_Projects exist, but details are temporarily unavailable. Try again in a minute._'
          : '_No projects found for this user yet._'
      }]
    });
    return blocks;
  }

  blocks.push({ type: 'divider' });
  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Most recent projects (${topProjects.length})*\n_Sorted by most recently updated (same-day ties use higher devlog count)_`
    }
  });

  for (let i = 0; i < topProjects.length; i++) {
    const project = topProjects[i];
    const id = project.id;
    const title = truncateText(project.title || `Project #${id}`, 80);
    const devlogCount = Array.isArray(project.devlog_ids) ? project.devlog_ids.length : 0;
    const shipStatus = project.ship_status || 'unknown';
    const updatedAtText = formatUpdatedAt(project.updated_at);
    const description = formatProjectDescriptionForMrkdwn(project.description || '', 180);

    const line = `*<${FLAVORTOWN_WEB_BASE}/projects/${id}|${title}>*\n\`${shipStatus}\` · ${devlogCount} devlogs · updated ${updatedAtText}${description ? `\n${description}` : ''}`;

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: line
      }
    });

    const actionElements = [
      {
        type: 'button',
        text: { type: 'plain_text', text: 'Open Project', emoji: true },
        url: `${FLAVORTOWN_WEB_BASE}/projects/${id}`
      }
    ];

    if (project.repo_url) {
      actionElements.push({
        type: 'button',
        text: { type: 'plain_text', text: 'Repo', emoji: true },
        url: project.repo_url
      });
    }

    if (project.demo_url) {
      actionElements.push({
        type: 'button',
        text: { type: 'plain_text', text: 'Demo', emoji: true },
        url: project.demo_url
      });
    }

    blocks.push({
      type: 'actions',
      elements: actionElements
    });

    if (i < topProjects.length - 1) {
      blocks.push({ type: 'divider' });
    }
  }

  const contextParts = [];
  if (sortedProjects.length > topProjects.length) {
    contextParts.push(`+${sortedProjects.length - topProjects.length} more projects not shown`);
  }
  if (projectsData?.partial) {
    contextParts.push(`some project stats unavailable (${projectsData.failedCount})`);
  }

  if (contextParts.length) {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: contextParts.join(' · ') }]
    });
  }

  return blocks;
}

async function processUserProfileMention(slackEvent, env) {
  const mentionIntent = parseMentionIntent(slackEvent);
  const targetSlackId = mentionIntent.targetSlackId || slackEvent.user;

  const rateLimit = await checkRateLimit(env, slackEvent.user, 'profile', 3, 60000);
  if (!rateLimit.allowed) {
    await postSlackMessage(
      slackEvent.channel,
      `You're querying profiles too fast. Please wait ${rateLimit.retryAfter}s and try again.`,
      slackEvent.thread_ts || slackEvent.ts,
      env.SLACK_BOT_TOKEN
    );
    return;
  }

  if (!env.FLAVORTOWN_API_KEY) {
    await postSlackMessage(
      slackEvent.channel,
      'I am missing the Flavortown API key (`FLAVORTOWN_API_KEY`) in worker secrets.',
      slackEvent.thread_ts || slackEvent.ts,
      env.SLACK_BOT_TOKEN
    );
    return;
  }

  const userResult = await fetchFlavortownUserBySlackId(targetSlackId, env);
  if (!userResult.user) {
    const notFound = userResult.status === 404 || userResult.error === 'user_not_found';
    const message = notFound
      ? `I couldn't find a Flavortown user for <@${targetSlackId}>.`
      : `I couldn't load that user's Flavortown profile right now (status: ${userResult.status || 'unknown'}).`;

    await postSlackMessage(
      slackEvent.channel,
      message,
      slackEvent.thread_ts || slackEvent.ts,
      env.SLACK_BOT_TOKEN
    );
    return;
  }

  const projectsData = await fetchProjectsForUser(userResult.user, env);
  const text = buildUserProfileMessage(userResult.user, projectsData, targetSlackId);
  const blocks = buildUserProfileBlocks(userResult.user, projectsData, targetSlackId);

  await postSlackMessage(
    slackEvent.channel,
    text,
    slackEvent.thread_ts || slackEvent.ts,
    env.SLACK_BOT_TOKEN,
    {
      blocks,
      unfurlLinks: false,
      unfurlMedia: false
    }
  );
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
    const mentionIntent = parseMentionIntent(slackEvent);
    if (mentionIntent.isProfileRequest) {
      await processUserProfileMention(slackEvent, env);
      return;
    }

    await processTodoMention(slackEvent, env);

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

async function processTodoMention(slackEvent, env) {
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

async function postSlackMessage(channel, text, threadTs, token, options = {}) {
  const payload = {
    channel: channel,
    text: text,
    thread_ts: threadTs
  };

  if (Array.isArray(options.blocks) && options.blocks.length) {
    payload.blocks = options.blocks;
  }

  if (typeof options.unfurlLinks === 'boolean') {
    payload.unfurl_links = options.unfurlLinks;
  }

  if (typeof options.unfurlMedia === 'boolean') {
    payload.unfurl_media = options.unfurlMedia;
  }

  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
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
