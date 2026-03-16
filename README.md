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
