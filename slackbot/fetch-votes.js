
const fs = require('fs');
const path = require('path');

const SLACK_TOKEN = process.env.SLACK_TOKEN;
const LBFEED_CHANNEL_ID = 'C0A3JN1CMNE';
const CUTOFF_ISO = '2026-01-14T00:00:00.000Z';
const CUTOFF_TS = Math.floor(new Date(CUTOFF_ISO).getTime() / 1000);

if (!SLACK_TOKEN) {
  console.error('Error: slack token isnt there.');
  process.exit(1);
}

const ALLOWED_BOT_NAMES = ['flavorpheus'];
const BLOCKED_BOT_NAMES = ['the journey'];

function getBotName(message) {
    return (
    message?.bot_profile?.name ||
    message?.username ||
    message?.user_profile?.display_name ||
    message?.user_profile?.real_name ||
    ''
    );
}

function normalizeUserKey(name) {
  return (name || '')
    .replace(/^@/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function isAllowedBot(message, { requireAllowed } = {}) {
  const botName = getBotName(message);
  const botLower = (botName || '').toLowerCase();

  if (BLOCKED_BOT_NAMES.some(blocked => botLower.includes(blocked))) return false;

  if (ALLOWED_BOT_NAMES.length) {
    const allowed = ALLOWED_BOT_NAMES.some(allowedName => botLower.includes(allowedName));
    if (requireAllowed) return allowed;
    if (botLower) return allowed;
  }

  return true;
}


async function fetchSlackMessages(channelId, { requireAllowed } = {}) {
    const messages = [];
    let cursor = null;

  do {
        const params = new URLSearchParams({
          channel: channelId,
          limit: '200',
          include_all_metadata: 'true',
        });

    if (cursor) {
      params.append('cursor', cursor);
    }

    const response = await fetch(`https://slack.com/api/conversations.history?${params}`, {
      headers: {
        'Authorization': `Bearer ${SLACK_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Slack API error:', data.error);
      process.exit(1);
    }

    const filtered = (data.messages || []).filter(msg => isAllowedBot(msg, { requireAllowed }));

    messages.push(...filtered);
    cursor = data.response_metadata?.next_cursor || null;


  } while (cursor);

  return messages;
}

function parseVoteMessage(message) {
  const text = message.text || '';

  if (!text.includes('New Vote Submitted') && !text.includes('vote was submitted for')) {
    return null;
  }

  const projectMatch = text.match(/vote was submitted for \*([^*]+)\*/i);
  if (!projectMatch) {
    return null;
  }
  const project = projectMatch[1].trim();

  const voterMatch = text.match(/Voted by: <@([^>]+)>/);
  const votedBy = voterMatch ? voterMatch[1] : 'Unknown';
  const projectEndIndex = text.indexOf('*', text.indexOf('*' + project) + project.length + 1) + 1;
  const votedByIndex = text.indexOf('Voted by:');

  let feedback = '';
  if (projectEndIndex > 0 && votedByIndex > projectEndIndex) {
    feedback = text.substring(projectEndIndex, votedByIndex).trim();
  } else if (votedByIndex === -1) {
    feedback = text.substring(projectEndIndex).trim();
  }

  const tsFloat = message.ts ? parseFloat(message.ts) : null;
  const timestamp = tsFloat ? new Date(tsFloat * 1000).toISOString() : null;

  if (tsFloat && tsFloat < CUTOFF_TS) return null;

  return {
    project,
    feedback,
    votedBy,
    timestamp,
    slackTs: message.ts,
  };
}

function getLeaderboardText(message) {
  if (message?.text && message.text.trim()) return message.text;

  const attachmentText = message?.attachments
    ?.map(att => att?.text || att?.fallback || att?.pretext)
    .filter(Boolean)
    .join(' ');
  if (attachmentText && attachmentText.trim()) return attachmentText;

  const blockText = message?.blocks
    ?.map(block => {
      if (block?.text?.text) return block.text.text;
      if (Array.isArray(block?.elements)) {
        return block.elements.map(el => el?.text || el?.value).filter(Boolean).join(' ');
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
  if (blockText && blockText.trim()) return blockText;

  return '';
}

function parseLeaderboardMessage(message) {
  const rawText = getLeaderboardText(message);
  const text = rawText
    .replace(/\*/g, '')
    .replace(/:[a-z0-9_+-]+:/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return null;

  const match = text.match(/^@?([^\s:]+|<@[^>]+>)\s*:\s*Balance\s*([+-]?\d+)\s*(?:\(([^\)]+)\))?\s*(?:\u2192|->)\s*(\d+)\b/i);
  if (!match) return null;

  let userRaw = match[1];
  let userId = '';
  const mentionMatch = userRaw.match(/^<@([^>|]+)(?:\|([^>]+))?>$/);
  if (mentionMatch) {
    userRaw = mentionMatch[2] || mentionMatch[1];
    userId = mentionMatch[1];
  }
  userRaw = userRaw.replace(/:$/, '').trim();

  if (!userId && /^[UW][A-Z0-9]+$/i.test(userRaw)) {
    userId = userRaw;
  }

  const delta = parseInt(match[2], 10);
  let reason = match[3] ? match[3].trim() : '';
  let reasonType = '';
  if (reason) {
    const reasonLower = reason.toLowerCase();
    if (reasonLower.startsWith('achievement:')) {
      reasonType = 'achievement';
      reason = reason.replace(/^achievement:\s*/i, '').trim();
    }
    if (reasonLower.startsWith('tutorial') && delta > 10) {
      reasonType = 'payout';
      reason = 'payout';
    }
  }
  const balance = parseInt(match[4], 10);

  if (!Number.isFinite(delta) || !Number.isFinite(balance)) return null;

  const tsFloat = message.ts ? parseFloat(message.ts) : null;
  const timestamp = tsFloat ? new Date(tsFloat * 1000).toISOString() : null;

  const userKey = normalizeUserKey(userId || userRaw);

  return {
    userKey,
    userId,
    delta,
    balance,
    reason,
    reasonType,
    timestamp,
  };
}

function buildLeaderboardFeed(entries, usersMap) {
  const feedByUser = {};

  (entries || []).forEach(entry => {
      if (!entry.userKey) return;
      if (!feedByUser[entry.userKey]) feedByUser[entry.userKey] = [];

      feedByUser[entry.userKey].push({
        ts: entry.timestamp,
        delta: entry.delta,
        balance: entry.balance,
        reason: entry.reason || '',
        reasonType: entry.reasonType || '',
        userId: entry.userId || '',
      });
  });

  Object.keys(feedByUser).forEach(userKey => {
    const sorted = (feedByUser[userKey] || [])
      .filter(item => item.ts && Number.isFinite(item.delta) && Number.isFinite(item.balance))
      .sort((a, b) => new Date(a.ts) - new Date(b.ts));

    const unique = [];
    const seen = new Set();
    for (const item of sorted) {
      const dedupeKey = `${item.ts}|${item.balance}|${item.delta}|${item.reason || ''}|${item.reasonType || ''}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      unique.push(item);
    }
    feedByUser[userKey] = unique;
  });

  const orderedOutput = {};
  Object.keys(feedByUser)
    .sort()
    .forEach(userKey => {
      orderedOutput[userKey] = feedByUser[userKey];
    });

  const outputUsers = {};
  if (usersMap) {
    Object.values(entries || [])
      .map(entry => entry.userId)
      .filter(Boolean)
      .forEach(userId => {
        if (usersMap[userId]) outputUsers[userId] = usersMap[userId];
      });
  }

  return {
    lastUpdated: new Date().toISOString(),
    entries: orderedOutput,
    users: outputUsers,
  };
}

async function fetchUserInfo(userId) {
  if (!userId || userId === 'Anonymous') return null;

  try {
    const response = await fetch(`https://slack.com/api/users.info?user=${userId}`, {
      headers: {
        'Authorization': `Bearer ${SLACK_TOKEN}`,
      },
    });

    const data = await response.json();
    if (!data.ok) {
      console.warn(`Failed to fetch user ${userId}:`, data.error);
      return null;
    }

    return {
      id: userId,
      username: data.user.name,
      displayName: data.user.profile.display_name || data.user.profile.real_name || data.user.name,
      avatar: data.user.profile.image_72 || data.user.profile.image_48,
    };
  } catch (e) {
    console.warn(`Error fetching user ${userId}:`, e.message);
    return null;
  }
}

function loadCachedUsers() {
  const outputPath = path.join(__dirname, '..', 'data', 'lbfeed.json');
  try {
    if (fs.existsSync(outputPath)) {
      const data = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      return data.users || {};
    }
  } catch (e) {
    console.warn('Could not load cached users:', e.message);
  }
  return {};
}

async function fetchAllUsers(votes) {
  const uniqueUserIds = [...new Set(
    votes
      .map(v => v.votedBy)
      .filter(id => id && id !== 'Anonymous' && /^[UW][A-Z0-9]+$/.test(id))
  )];

  const cachedUsers = loadCachedUsers();
  const newUserIds = uniqueUserIds.filter(id => !cachedUsers[id]);

  const newUsers = {};
  for (const userId of newUserIds) {
    const userInfo = await fetchUserInfo(userId);
    if (userInfo) {
      newUsers[userId] = userInfo;
    }
    await new Promise(r => setTimeout(r, 100));
  }

  return { ...cachedUsers, ...newUsers };
}

async function fetchLeaderboardUsers(entries) {
  const cachedUsers = loadCachedUsers();
  const userIds = [...new Set(
    (entries || [])
      .map(entry => entry.userId)
      .filter(id => id && /^[UW][A-Z0-9]+$/.test(id))
  )];

  const missingUserIds = userIds.filter(id => !cachedUsers[id]);
  const newUsers = {};

  for (const userId of missingUserIds) {
    const userInfo = await fetchUserInfo(userId);
    if (userInfo) {
      newUsers[userId] = userInfo;
    }
    await new Promise(r => setTimeout(r, 100));
  }

  const mergedUsers = { ...cachedUsers, ...newUsers };
  const scopedUsers = {};
  userIds.forEach(userId => {
    if (mergedUsers[userId]) scopedUsers[userId] = mergedUsers[userId];
  });

  return scopedUsers;
}

async function main() {
  const leaderboardMessages = await fetchSlackMessages(LBFEED_CHANNEL_ID);
  if (process.env.DEBUG_LBFEED === '1') {
    const sampleTexts = leaderboardMessages
      .slice(0, 5)
      .map(msg => getLeaderboardText(msg).replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    console.log(`LB feed messages: ${leaderboardMessages.length}`);
    if (sampleTexts.length) {
      console.log('LB feed sample:', sampleTexts);
    }
  }

  const leaderboardEntries = leaderboardMessages
    .map(parseLeaderboardMessage)
    .filter(Boolean);
  const leaderboardUsers = await fetchLeaderboardUsers(leaderboardEntries);
  const leaderboardFeed = buildLeaderboardFeed(leaderboardEntries, leaderboardUsers);

  const leaderboardPath = path.join(__dirname, '..', 'data', 'lbfeed.json');
  let existingFeed = null;
  try {
    if (fs.existsSync(leaderboardPath)) {
      existingFeed = JSON.parse(fs.readFileSync(leaderboardPath, 'utf8'));
    }
  } catch (e) {
    console.warn('Could not read existing leaderboard feed:', e.message);
  }

  const existingSerialized = existingFeed ? JSON.stringify(existingFeed) : null;
  const nextSerialized = JSON.stringify(leaderboardFeed);

  if (existingSerialized === nextSerialized) {
    console.log('No new leaderboard feed detected, skipping write.');
  } else {
    fs.writeFileSync(leaderboardPath, JSON.stringify(leaderboardFeed, null, 2));
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
