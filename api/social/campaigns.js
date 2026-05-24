const { readJson } = require('./state');
const { validateCampaign } = require('./validation');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const campaigns = await readJson('campaigns');
  const platforms = await readJson('platforms');
  const enriched = await Promise.all(campaigns.map(async (campaign) => ({
    ...campaign,
    validations: await validateCampaign(campaign),
    platforms: platforms.filter((p) => p.campaign_id === campaign.id)
  })));

  return res.status(200).json({ campaigns: enriched });
};
