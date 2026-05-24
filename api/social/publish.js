const { readJson, writeJson } = require('./state');

const detectAuth = (platform) => {
  if (platform === 'youtube') {
    return process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_CLIENT_SECRET && process.env.YOUTUBE_REFRESH_TOKEN
      ? { auth_status: 'CONNECTED', publish_status: 'READY' }
      : { auth_status: 'MISSING_TOKEN', publish_status: 'NEEDS_AUTH' };
  }
  if (platform === 'instagram' || platform === 'facebook') {
    return process.env.META_ACCESS_TOKEN
      ? { auth_status: 'CONNECTED', publish_status: 'READY' }
      : { auth_status: 'MISSING_TOKEN', publish_status: 'NEEDS_AUTH' };
  }
  if (platform === 'tiktok') {
    return process.env.TIKTOK_ACCESS_TOKEN
      ? { auth_status: 'NEEDS_REVIEW', publish_status: 'MANUAL_REQUIRED' }
      : { auth_status: 'API_LIMITED', publish_status: 'MANUAL_REQUIRED' };
  }
  return { auth_status: 'MISSING_TOKEN', publish_status: 'NEEDS_AUTH' };
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { campaign_id, platform, action, post_url } = req.body || {};
  const platforms = await readJson('platforms');
  const posts = await readJson('posts');
  const errors = await readJson('errors');
  const idx = platforms.findIndex((p) => p.campaign_id === campaign_id && p.platform === platform);
  if (idx < 0) return res.status(404).json({ error: 'Platform state not found' });

  if (action === 'probe_auth') {
    const auth = detectAuth(platform);
    platforms[idx] = { ...platforms[idx], ...auth, error_message: auth.publish_status === 'READY' ? '' : 'Credentials or review status missing', publish_mode: platform === 'tiktok' ? 'DRAFT_ONLY' : (auth.publish_status === 'READY' ? 'AUTO' : 'MANUAL') };
  } else if (action === 'mark_posted') {
    if (!post_url) return res.status(400).json({ error: 'post_url required' });
    platforms[idx] = { ...platforms[idx], publish_status: 'POSTED', post_url, posted_at: new Date().toISOString(), error_message: '' };
    posts.push({ campaign_id, platform, post_url, posted_at: platforms[idx].posted_at, truth_label: 'POSTED' });
  } else {
    errors.push({ campaign_id, platform, error: 'Unsupported action', at: new Date().toISOString() });
    await writeJson('errors', errors);
    return res.status(400).json({ error: 'Unsupported action' });
  }

  await writeJson('platforms', platforms);
  await writeJson('posts', posts);
  return res.status(200).json({ platform: platforms[idx] });
};
