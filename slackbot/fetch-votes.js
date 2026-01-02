
const fs = require('fs');
const path = require('path');

const SLACK_TOKEN = process.env.SLACK_TOKEN;
const CHANNEL_ID = 'C0A2DTFSYSD';

if (!SLACK_TOKEN) {
  console.error('Error: slack token isnt there.');
  process.exit(1);
}

async function fetchSlackMessages() {
  const messages = [];
  let cursor = null;

  do {
    const params = new URLSearchParams({
      channel: CHANNEL_ID,
      limit: '200',
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

    messages.push(...data.messages);
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

  const timestamp = message.ts ? new Date(parseFloat(message.ts) * 1000).toISOString() : null;

  return {
    project,
    feedback,
    votedBy,
    timestamp,
    slackTs: message.ts,
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
      avatar: data.user.profile.image_72 || data.user.profile.image_48,
    };
  } catch (e) {
    console.warn(`Error fetching user ${userId}:`, e.message);
    return null;
  }
}

function loadCachedUsers() {
  const outputPath = path.join(__dirname, '..', 'data', 'votes.json');
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
  const uniqueUserIds = [...new Set(votes.map(v => v.votedBy).filter(id => id && id !== 'Anonymous'))];

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

async function main() {
  const messages = await fetchSlackMessages();

  const votes = messages
    .map(parseVoteMessage)
    .filter(Boolean)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const outputPath = path.join(__dirname, '..', 'data', 'votes.json');
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let existingData = null;
  try {
    if (fs.existsSync(outputPath)) {
      existingData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    }
  } catch (e) {
    console.warn('Could not read existing data:', e.message);
  }

  const existingVoteCount = existingData?.totalVotes || 0;
  const existingLatestTs = existingData?.votes?.[0]?.slackTs || null;
  const newLatestTs = votes[0]?.slackTs || null;

  if (existingVoteCount === votes.length && existingLatestTs === newLatestTs) {
    console.log('No new votes detected, skipping write.');
    return;
  }

  const users = await fetchAllUsers(votes);

  const output = {
    lastUpdated: new Date().toISOString(),
    totalVotes: votes.length,
    votes: votes,
    users: users,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
