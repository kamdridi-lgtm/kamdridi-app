const fs = require('fs/promises');
const { execFile } = require('child_process');
const util = require('util');
const execFileAsync = util.promisify(execFile);

const probe = async (filePath) => {
  try {
    const { stdout } = await execFileAsync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height:format=duration,size', '-of', 'json', filePath]);
    return JSON.parse(stdout);
  } catch {
    return null;
  }
};

const validateCampaign = async (campaign) => {
  const checks = [];
  for (const [label, p] of [["asset_9x16", campaign.asset_9x16_path], ["asset_16x9", campaign.asset_16x9_path]]) {
    try {
      await fs.access(p);
      const stats = await fs.stat(p);
      const meta = await probe(p);
      const stream = meta?.streams?.[0] || {};
      checks.push({ label, exists: true, size_bytes: stats.size, duration_seconds: meta?.format?.duration ? Number(meta.format.duration) : null, resolution: stream.width && stream.height ? `${stream.width}x${stream.height}` : null, truth_label: meta ? 'PRESENT_UNTESTED' : 'MANUAL_REQUIRED' });
    } catch {
      checks.push({ label, exists: false, truth_label: 'MANUAL_REQUIRED' });
    }
  }

  checks.push({ label: 'caption', exists: Boolean(campaign.caption), truth_label: campaign.caption ? 'REAL' : 'FAILED' });
  checks.push({ label: 'hyperfollow_link', exists: Boolean(campaign.hyperfollow_link), truth_label: campaign.hyperfollow_link ? 'REAL' : 'NEEDS_TOKEN' });
  return checks;
};

module.exports = { validateCampaign };
