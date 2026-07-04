const { readJson, writeJson } = require('./state');
const { probePlatform } = require('./adapters');

const allowedActions = new Set(['probe_auth', 'mark_posted']);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { campaign_id, platform, action, post_url } = req.body || {};
  if (!campaign_id || !platform || !action) return res.status(400).json({ error: 'campaign_id, platform, and action are required' });
  if (!allowedActions.has(action)) return res.status(400).json({ error: 'Unsupported action' });

  const [campaigns, platforms, posts, errors] = await Promise.all([
    readJson('campaigns'),
    readJson('platforms'),
    readJson('posts'),
    readJson('errors')
  ]);

  const campaignExists = campaigns.some((campaign) => campaign.id === campaign_id);
  if (!campaignExists) return res.status(404).json({ error: 'Campaign not found' });

  const idx = platforms.findIndex((entry) => entry.campaign_id === campaign_id && entry.platform === platform);
  if (idx < 0) return res.status(404).json({ error: 'Platform state not found' });

  if (action === 'probe_auth') {
    const probe = probePlatform(platform);
    platforms[idx] = {
      ...platforms[idx],
      ...probe,
      checked_at: new Date().toISOString()
    };
  }

  if (action === 'mark_posted') {
    if (!post_url || !/^https?:\/\//.test(post_url)) {
      return res.status(400).json({ error: 'Valid post_url required' });
    }

    platforms[idx] = {
      ...platforms[idx],
      publish_status: 'POSTED',
      truth_label: 'POSTED',
      post_url,
      posted_at: new Date().toISOString(),
      error_message: ''
    };

    posts.push({
      campaign_id,
      platform,
      post_url,
      posted_at: platforms[idx].posted_at,
      truth_label: 'POSTED',
      source: 'manual_confirmation'
    });
  }

  await Promise.all([
    writeJson('platforms', platforms),
    writeJson('posts', posts),
    writeJson('errors', errors)
  ]);

  return res.status(200).json({ platform: platforms[idx] });
};
