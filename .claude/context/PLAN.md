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
| 1 | Attach backloggr.com custom domain | Todo | User buying it on Namecheap; needs dashboard steps (add zone to CF, swap NS at Namecheap, add custom domain to the Pages project) — see Open Questions |
| 2 | Update footer/OG URLs once backloggr.com is live | Todo | e.g. add canonical URL + og:url meta |

## Completed

- Initial commit pushed to iden0605/backloggr-website (private) main — 2026-07-10, `32b5c6e`
- **Deployed to Cloudflare Pages** — 2026-07-10: project `backloggr` (created via `wrangler pages project create`, production branch main), live at https://backloggr-bcq.pages.dev. Deploys are direct-upload (`npm run deploy` → build + `wrangler pages deploy dist --project-name backloggr`), NO GitHub integration — repo stays private, Cloudflare never touches it. wrangler is a devDependency; auth is the user's existing OAuth login (same account as the proxy worker)
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

- RESOLVED 2026-07-10: releases live in the PUBLIC `iden0605/backloggr-releases` repo (app source repo is private, so its releases were invisible to visitors; user chose the releases-only-repo option to keep monetization optionality). The app repo's release.yml publishes there cross-repo via tauri-action `owner`/`repo` + a `RELEASES_TOKEN` fine-grained PAT (Contents read/write on backloggr-releases) — **the user still needs to create that PAT and `gh secret set RELEASES_TOKEN` in the private Backloggr repo before the first tag push.**
- backloggr.com bought on Namecheap 2026-07-10; Cloudflare zone added (nameservers adaline/milan.ns.cloudflare.com set at Namecheap), awaiting activation → then attach custom domain to the Pages project.
- Real product screenshots vs. stylized CSS mockups for the visuals — starting with stylized in-page mockups since no marketing screenshots exist yet.
