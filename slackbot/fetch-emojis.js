const fs = require('fs');
const path = require('path');

const SLACK_TOKEN = process.env.SLACK_TOKEN;

if (!SLACK_TOKEN) {
  console.error('Error: slack token isnt there.');
  process.exit(1);
}

function resolveEmojiUrl(name, map, visited = new Set()) {
  if (!name || visited.has(name)) return '';
  visited.add(name);

  const value = map[name];
  if (!value) return '';

  if (value.startsWith('alias:')) {
    const aliasName = value.replace(/^alias:/, '').trim();
    return resolveEmojiUrl(aliasName, map, visited);
  }

  if (value.startsWith('http')) return value;
  return '';
}

async function main() {
  const response = await fetch('https://slack.com/api/emoji.list', {
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

  const emojiMap = data.emoji || {};
  const outputEmoji = {};

  Object.keys(emojiMap)
    .sort()
    .forEach((name) => {
      const url = resolveEmojiUrl(name, emojiMap);
      if (!url) return;
      outputEmoji[name] = {
        url,
        animated: url.toLowerCase().endsWith('.gif'),
      };
    });

  const output = {
    lastUpdated: new Date().toISOString(),
    emoji: outputEmoji,
  };

  const outputPath = path.join(__dirname, '..', 'data', 'emojis.json');
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
