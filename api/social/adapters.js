const hasAll = (...values) => values.every(Boolean);

const youtubeAdapter = () => {
  const connected = hasAll(process.env.YOUTUBE_CLIENT_ID, process.env.YOUTUBE_CLIENT_SECRET, process.env.YOUTUBE_REFRESH_TOKEN);
  const appVerified = process.env.YOUTUBE_APP_VERIFIED === 'true';
  if (!connected) {
    return {
      auth_status: 'MISSING_TOKEN',
      publish_mode: 'MANUAL',
      publish_status: 'NEEDS_AUTH',
      truth_label: 'NEEDS_TOKEN',
      error_message: 'YouTube OAuth credentials missing.'
    };
  }
  if (!appVerified) {
    return {
      auth_status: 'NEEDS_REVIEW',
      publish_mode: 'MANUAL',
      publish_status: 'MANUAL_REQUIRED',
      truth_label: 'NEEDS_REVIEW',
      error_message: 'OAuth app not verified for public publishing.'
    };
  }
  return {
    auth_status: 'CONNECTED',
    publish_mode: 'AUTO',
    publish_status: 'READY',
    truth_label: 'PRESENT_UNTESTED',
    error_message: ''
  };
};

const metaAdapter = () => {
  const connected = hasAll(process.env.META_ACCESS_TOKEN, process.env.META_IG_ACCOUNT_ID, process.env.META_PAGE_ID);
  if (!connected) {
    return {
      auth_status: 'MISSING_TOKEN',
      publish_mode: 'MANUAL',
      publish_status: 'NEEDS_AUTH',
      truth_label: 'NEEDS_TOKEN',
      error_message: 'Meta token + IG account + Facebook Page are required.'
    };
  }

  const reviewed = process.env.META_APP_REVIEW_APPROVED === 'true';
  if (!reviewed) {
    return {
      auth_status: 'NEEDS_REVIEW',
      publish_mode: 'MANUAL',
      publish_status: 'MANUAL_REQUIRED',
      truth_label: 'NEEDS_REVIEW',
      error_message: 'Meta app review approval not confirmed for publishing scopes.'
    };
  }

  return {
    auth_status: 'CONNECTED',
    publish_mode: 'AUTO',
    publish_status: 'READY',
    truth_label: 'PRESENT_UNTESTED',
    error_message: ''
  };
};

const tiktokAdapter = () => {
  if (!process.env.TIKTOK_ACCESS_TOKEN) {
    return {
      auth_status: 'API_LIMITED',
      publish_mode: 'DRAFT_ONLY',
      publish_status: 'NEEDS_AUTH',
      truth_label: 'NEEDS_TOKEN',
      error_message: 'TikTok access token missing.'
    };
  }

  const audited = process.env.TIKTOK_AUDIT_APPROVED === 'true';
  if (!audited) {
    return {
      auth_status: 'NEEDS_REVIEW',
      publish_mode: 'DRAFT_ONLY',
      publish_status: 'MANUAL_REQUIRED',
      truth_label: 'NEEDS_REVIEW',
      error_message: 'TikTok app audit/review not approved for direct public posting.'
    };
  }

  return {
    auth_status: 'CONNECTED',
    publish_mode: 'AUTO',
    publish_status: 'READY',
    truth_label: 'PRESENT_UNTESTED',
    error_message: ''
  };
};

const probePlatform = (platform) => {
  if (platform === 'youtube') return youtubeAdapter();
  if (platform === 'instagram' || platform === 'facebook') return metaAdapter();
  if (platform === 'tiktok') return tiktokAdapter();
  return {
    auth_status: 'MISSING_TOKEN',
    publish_mode: 'MANUAL',
    publish_status: 'FAILED',
    truth_label: 'FAILED',
    error_message: 'Unsupported platform.'
  };
};

module.exports = { probePlatform };
