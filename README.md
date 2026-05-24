# KAMDRIDI — Echoes Unearthed Creative Ecosystem

A cinematic, label-style web platform for the Echoes Unearthed universe, ready for Vercel deployment with Stripe checkout.

## Homepage experience
- Full-screen cinematic hero with background loop video, particle atmosphere, and fade-in motion.
- Immersive smooth scrolling and reveal transitions across sections.
- Album experience with artwork, lore panel, track list, and playable audio excerpts.
- Visual gallery and expanded video portfolio.
- New **Kamdridi Studio** section with service offers:
  - AI Music Videos
  - Cinematic Visualizers
  - Visual Albums
- Upgraded store with responsive merch/product card grid and hover interactions.

## Services + checkout
Pricing packages remain:
- Starter — `$300`
- Growth — `$1500`
- Elite — `$5000`

Checkout flow:
1. User clicks package/studio CTA button.
2. Frontend sends `POST /api/create-checkout-session` with selected plan.
3. Vercel API route creates Stripe Checkout session.
4. User is redirected to Stripe-hosted checkout.
5. Stripe redirects to:
   - `/success.html` on success
   - `/cancel.html` on cancel

## Required environment variables
Set in Vercel Project Settings → Environment Variables:
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_GROWTH`
- `STRIPE_PRICE_ELITE`
- `SITE_URL` (recommended, e.g. `https://your-domain.com`)

Use `.env.example` as template.

## Local validation
```bash
npm run check
npm run build
```

## Deploy to Vercel
1. Import the repository into Vercel.
2. Add env vars listed above.
3. Deploy.
4. Confirm all checkout buttons launch Stripe and success/cancel redirects work.

## Performance notes
- Responsive layout and fluid grid behavior across mobile/tablet/desktop.
- Lazy loading used on media where possible.
- Lightweight CSS + IntersectionObserver for smooth section reveal effects.

## Echoes Engine Social Publisher

A real-state social publishing control plane is included with **no fake posting**. Dashboard: `/social-dashboard.html`.

### What works now (REAL)
- Campaign + platform state persisted in:
  - `state/social_campaigns.json`
  - `state/social_platforms.json`
  - `state/social_posts.json`
  - `state/social_errors.json`
- Manual mode workflow per platform:
  - Copy caption / hashtags
  - Open official upload URLs
  - Mark post as posted and save final URL
- File and metadata validation checks for campaign assets and content.

### Needs OAuth / tokens (NEEDS_TOKEN or NEEDS_AUTH)
- YouTube auto upload requires:
  - `YOUTUBE_CLIENT_ID`
  - `YOUTUBE_CLIENT_SECRET`
  - `YOUTUBE_REFRESH_TOKEN`
- Meta publishing requires:
  - `META_ACCESS_TOKEN`
  - Connected IG Business/Creator + Facebook Page + required scopes
- TikTok posting requires:
  - `TIKTOK_ACCESS_TOKEN`
  - App eligibility/audit depending on posting target

### Needs app review or audit (NEEDS_REVIEW / MANUAL_REQUIRED)
- YouTube projects not verified for public upload should remain manual/review-gated.
- TikTok Content Posting API may be limited to draft/manual in unaudited apps.
- Meta permissions may require App Review before publish actions are allowed.

### Security
- Credentials are read only from environment variables.
- Tokens are never exposed in frontend payloads.
- Do not commit secrets in repo state files.
