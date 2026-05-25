const fs = require('fs/promises');
const path = require('path');
const { execFile } = require('child_process');
const util = require('util');

const execFileAsync = util.promisify(execFile);
const maxFileSizeBytes = 1024 * 1024 * 1024;

const probe = async (filePath) => {
  const { stdout } = await execFileAsync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height:format=duration,size', '-of', 'json', filePath]);
  return JSON.parse(stdout);
};

const expectedRatio = {
  asset_9x16: '9:16',
  asset_16x9: '16:9'
};

const isExpectedRatio = (label, width, height) => {
  if (!width || !height) return false;
  const ratio = width / height;
  if (label === 'asset_9x16') return Math.abs(ratio - (9 / 16)) < 0.03;
  if (label === 'asset_16x9') return Math.abs(ratio - (16 / 9)) < 0.03;
  return false;
};

const validateAsset = async (label, relativePath) => {
  const filePath = path.join(process.cwd(), relativePath);
  try {
    await fs.access(filePath);
    const stats = await fs.stat(filePath);
    const meta = await probe(filePath);
    const stream = meta?.streams?.[0] || {};
    const durationSeconds = Number(meta?.format?.duration || 0);
    const ratioOk = isExpectedRatio(label, stream.width, stream.height);
    const sizeOk = stats.size <= maxFileSizeBytes;

    return {
      label,
      path: relativePath,
      exists: true,
      size_bytes: stats.size,
      size_ok: sizeOk,
      duration_seconds: durationSeconds || null,
      duration_ok: Boolean(durationSeconds > 0),
      resolution: stream.width && stream.height ? `${stream.width}x${stream.height}` : null,
      ratio_expected: expectedRatio[label],
      ratio_ok: ratioOk,
      truth_label: sizeOk && ratioOk && durationSeconds > 0 ? 'REAL' : 'PRESENT_UNTESTED'
    };
  } catch (error) {
    return {
      label,
      path: relativePath,
      exists: false,
      truth_label: 'MANUAL_REQUIRED',
      error_message: error.message
    };
  }
};

const validateCampaign = async (campaign) => {
  const checks = await Promise.all([
    validateAsset('asset_9x16', campaign.asset_9x16_path),
    validateAsset('asset_16x9', campaign.asset_16x9_path)
  ]);

  checks.push({ label: 'caption', exists: Boolean(campaign.caption), truth_label: campaign.caption ? 'REAL' : 'FAILED' });
  checks.push({ label: 'hyperfollow_link', exists: Boolean(campaign.hyperfollow_link), truth_label: campaign.hyperfollow_link ? 'REAL' : 'NEEDS_TOKEN' });

  return checks;
};

module.exports = { validateCampaign };
