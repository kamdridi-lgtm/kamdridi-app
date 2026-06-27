# CODEX / ANTIGRAVITY INSTALL PROMPT — SALIERI’S HANDS MAX PAGE

Install the provided SALIERI’S HANDS page into kamdridi.com without rebuilding it from scratch.

## Source of truth
Use this ZIP as the source of truth. The current files are:
- index.html
- style.css
- script.js
- manifest.webmanifest
- robots.txt
- sitemap.xml
- PRESS_KIT.md
- assets/ original approved images
- assets/optimized/ compressed WebP images
- assets/audio/ preview MP3 files

## Official route
Preferred route:
/release/salieris-hands or /releases/salieris-hands

Do not replace the existing KAMDRIDI home page. Add this as a release page and link to it from Releases / Music / Store as appropriate.

## Visual rules
Do not create a small simple placeholder page. The page must preserve the premium dark baroque album campaign look.

Official approved assets:
- front-cover-approved.png
- back-cover-approved.png
- full-collector-pack.png
- pack-back-front-spine.png
- disc-mockup.png
- booklet-mockup.png
- jewelcase-mockup.png
- mini-card-mockup.png
- vienna-wide.png
- opera-teaser.png
- study-wide.png
- portrait.png

Do not redesign these assets. Do not reinterpret them. Do not replace them with generated boxes or gradients. Crop, resize and compress only when required for web performance.

## Required technical work
1. Integrate the page into the existing site's framework.
2. Preserve Open Graph / Twitter metadata.
3. Keep the YouTube teaser button: https://youtu.be/wDOu7-krT8s
4. If the local YouTube embed fails, keep the direct YouTube button as the fallback.
5. Verify mobile layout.
6. Verify all images load.
7. Verify audio player does not break the page. If audio cannot be hosted, hide the preview deck instead of breaking the layout.
8. Keep Coming Soon states for Spotify / Apple Music / Amazon Music until final links exist.
9. Do not connect real payment or preorder until product availability is confirmed.
10. Do not deploy until visual review passes.

## Acceptance criteria
- The page looks at least as rich as the approved mockups.
- No empty placeholders.
- No broken image boxes.
- Front cover, back cover, collector pack, tracklist, merch, EPK and teaser sections are visible.
- Mobile view is readable and not cut off.
