const PLAN_TO_PRICE_ID = {
  starter: process.env.STRIPE_PRICE_STARTER,
  growth: process.env.STRIPE_PRICE_GROWTH,
  elite: process.env.STRIPE_PRICE_ELITE
};

const getBaseUrl = (req) => {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return host ? `${proto}://${host}` : null;
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY environment variable.' });

  try {
    const { plan } = req.body || {};
    const priceId = PLAN_TO_PRICE_ID[plan];

    if (!priceId) return res.status(400).json({ error: 'Invalid plan selected.' });

    const baseUrl = getBaseUrl(req);
    if (!baseUrl) return res.status(500).json({ error: 'Unable to determine base URL for redirect.' });

    const body = new URLSearchParams({
      mode: 'payment',
      success_url: `${baseUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel.html`,
      billing_address_collection: 'auto',
      allow_promotion_codes: 'true'
    });

    body.append('line_items[0][price]', priceId);
    body.append('line_items[0][quantity]', '1');

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });

    const stripePayload = await stripeResponse.json();

    if (!stripeResponse.ok) {
      console.error('Stripe API error:', stripePayload);
      return res.status(500).json({ error: stripePayload?.error?.message || 'Unable to start checkout session.' });
    }

    return res.status(200).json({ url: stripePayload.url });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return res.status(500).json({ error: 'Unable to start checkout session.' });
  }
};
