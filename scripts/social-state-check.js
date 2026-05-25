const fs = require('fs');

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

const campaigns = read('state/social_campaigns.json');
const platforms = read('state/social_platforms.json');
const posts = read('state/social_posts.json');
const errors = read('state/social_errors.json');

if (!Array.isArray(campaigns) || !Array.isArray(platforms) || !Array.isArray(posts) || !Array.isArray(errors)) {
  throw new Error('All social state files must contain JSON arrays.');
}

for (const campaign of campaigns) {
  for (const key of ['id', 'title', 'artist', 'release_name', 'album_name', 'asset_9x16_path', 'asset_16x9_path', 'caption', 'hashtags', 'created_at', 'status']) {
    if (!(key in campaign)) throw new Error(`Campaign missing required key: ${key}`);
  }
  if (!Array.isArray(campaign.hashtags)) throw new Error(`Campaign ${campaign.id} hashtags must be an array`);
}

const campaignIds = new Set(campaigns.map((c) => c.id));
for (const platform of platforms) {
  for (const key of ['campaign_id', 'platform', 'auth_status', 'publish_mode', 'publish_status']) {
    if (!(key in platform)) throw new Error(`Platform entry missing required key: ${key}`);
  }
  if (!campaignIds.has(platform.campaign_id)) throw new Error(`Platform references unknown campaign: ${platform.campaign_id}`);
}

console.log('Social state check passed');
