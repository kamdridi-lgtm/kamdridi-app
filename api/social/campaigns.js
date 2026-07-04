const { readJson } = require('./state');
const { validateCampaign } = require('./validation');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const campaigns = await readJson('campaigns');
    const platforms = await readJson('platforms');
    const campaignId = req.query?.campaign_id;

    const filtered = campaignId
      ? campaigns.filter((campaign) => campaign.id === campaignId)
      : campaigns;

    const enriched = await Promise.all(filtered.map(async (campaign) => ({
      ...campaign,
      validations: await validateCampaign(campaign),
      platforms: platforms.filter((platform) => platform.campaign_id === campaign.id)
    })));

    return res.status(200).json({ campaigns: enriched });
  } catch (error) {
    console.error('Failed to load campaigns:', error);
    return res.status(500).json({ error: 'Failed to load campaigns' });
  }
};
