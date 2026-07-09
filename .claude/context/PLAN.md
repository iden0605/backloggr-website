# Plan

_Last updated: 2026-07-10 (initial creation)_

## Current Phase

Initial buildout — empty repo to a polished, deployable single-page marketing site.

## Goals

- A fancy, eye-catching single-page site that matches the app's Iron & Chalk / Backdrop aesthetic
- Prominent hero CTA: "Download for Windows" (GitHub Releases API + fallback)
- Communicate the four pillars: library tracking, auto playtime logging, Shelby AI recommendations, hotkey clips
- Clean static build ready for Cloudflare Pages on backloggr.com

## Steps

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | User visual review of the implemented site (`npm run dev`) | Todo | Built 2026-07-10, self-reviewed via Playwright screenshots only |
| 2 | Initial commit + push to origin main | Todo | User's repo: iden0605/backloggr-website — awaiting user go-ahead |
| 3 | Deploy to Cloudflare Pages + point backloggr.com | Todo | Later — domain not yet registered as of 2026-07-07 |

## Completed

- Repo hygiene (.gitignore, README) — 2026-07-10
- Vite + React 18 + TS + Tailwind v3 scaffold with Iron & Chalk palette + Archivo/JetBrains Mono — 2026-07-10
- Full single-page implementation: Nav (solid-on-scroll), Hero (Backdrop glow + app-window mockup + "Download for Windows" CTA), marquee strip, four alternating feature sections (Tracking ledger / Shelby chat mock / Clips buffer visual / Library poster wall), mono spec strip, closing CTA, footer — 2026-07-10
- GitHub Releases download wiring (`src/lib/github.ts`, repo iden0605/Backloggr, .msi→.exe asset pick, releases-page fallback; module-level cache so both buttons share one fetch) — 2026-07-10
- Responsive + reduced-motion support; verified via `npm run build` (tsc clean) and Playwright screenshots at 1440px and 390px — 2026-07-10
- Feedback round 2 (2026-07-10): stylized posters replaced with REAL Steam CDN cover art (user picked "Steam CDN covers" from options; appids in `posters.tsx`, gradient art demoted to onError fallback, poster aspect fixed to Steam's 2:3); hotkey de-hardcoded from copy (Specs tile "Alt+F9" → "1 keypress to save a clip", Clips prose says "your clip hotkey") since the app's task 26 makes it configurable. Build clean, covers verified loading via screenshots (library wall, hero fan, Shelby recs).
- Feedback round 3 (2026-07-10): Clips section's abstract "gameplay frame" replaced with Elden Ring's real widescreen key art via `steamHeroUrl` (`library_hero.jpg` — second predictable CDN asset type alongside `library_600x900.jpg`), old gradient+peaks SVG kept as onError fallback inside the new `GameFrame` component. Last placeholder art on the page.
- Feedback round 1 (2026-07-10, user review): download buttons restyled from white/chalk slabs to dark surface + hairline border + rust Windows mark with rust glow on hover (user: chalk primaries read wrong at marketing scale — a deliberate divergence from the app's chalk-primary rule); hero app-window mockup REMOVED (user: out of place) and the marquee word-conveyor REMOVED (user: ugly) — both replaced by a floating fanned poster stack in the hero (drifting float animation, live-session chip; compact static fan under the CTA on mobile); fake game names replaced with real titles (Elden Ring, Hollow Knight, Stardew Valley, Hades, Celeste, The Witcher 3, Cyberpunk 2077, Terraria + Shelby recs Spiritfarer/A Short Hike/Unpacking — names aren't copyrightable, actual cover ART is, so artwork stays stylized gradients); mobile pass: zero horizontal overflow verified at 1440/768/390/360px, poster labels 9px on mobile so long titles don't clip

## Blockers

_(none)_

## Open Questions

- Which GitHub repo will host the app's public releases (game-app repo name/visibility)? Fallback link needs confirming before launch.
- backloggr.com registration still pending (per app repo's open questions).
- Real product screenshots vs. stylized CSS mockups for the visuals — starting with stylized in-page mockups since no marketing screenshots exist yet.
