# Plan

_Last updated: 2026-07-10 (bug report feature session)_

## Current Phase

Site live at backloggr.com (apex + www) with the bug report pipeline deployed.

## Goals

- A fancy, eye-catching single-page site that matches the app's Iron & Chalk / Backdrop aesthetic
- Prominent hero CTA: "Download for Windows" (GitHub Releases API + fallback)
- Communicate the four pillars: library tracking, auto playtime logging, Shelby AI recommendations, hotkey clips
- Clean static build ready for Cloudflare Pages on backloggr.com

## Steps

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Attach backloggr.com custom domain | Done | 2026-07-10: www live day one; the apex record was the missing piece ("works on my browser only" report) — apex registered on the Pages project via API, user added the proxied CNAME `@ → backloggr-bcq.pages.dev`, apex verified 200. Leftover Namecheap eforward MX/SPF records deleted (they blocked Email Routing onboarding). |
| 2 | Update footer/OG URLs once backloggr.com is live | Todo | e.g. add canonical URL + og:url meta |
| 3 | Bug report section + pipeline | Done | 2026-07-10 — see Completed. |

## Completed

- **Mobile nav rework + GitHub button** (2026-07-10, deployed): header download button removed on mobile in favor of an animated hamburger (chalk/rust lines → X) opening a full-screen "shelf index" menu — numbered Archivo rows for all sections incl. Report a bug, staggered entrances, rust wash + grain, bottom dock (Download for Windows, GitHub, "Free and open source under GPL-3.0"), scroll lock, Escape/tap-to-close. New ghost `GitHubButton` (hairline border, muted, warms on hover — deliberately quieter than the download CTA) in the desktop header and menu dock; footer GitHub link retargeted from the profile to `iden0605/Backloggr`. Bug found live: the menu overlay rendered invisible because the header's `backdrop-blur` containing-block trapped it — blur moved to an inner bar (gotcha recorded in ABOUT.md). Verified via Playwright at 1440/390 (menu open/close/navigate).

- **Bug report feature** (2026-07-10, deployed + tested end-to-end): `BugReport.tsx` section ("005 / Bug reports", footer link) + `report-worker/` (worker `backloggr-report` at backloggr-report.backloggr.workers.dev). Form: optional name/email, required description, drag-drop images/videos with previews (5 files, 10/60/80MB caps mirrored server-side), send/sending/sent states, 3-min cooldown ticking in the button and persisted via localStorage AND enforced per-IP in the worker (R2 marker objects; failed sends don't burn it; 429 carries retryAfter which the frontend adopts). Delivery: email to iden0605@gmail.com via the FREE Email Routing send_email binding (EmailMessage + mimetext; the new Email Sending product is Workers-Paid-gated on this account — do NOT purchase it for this) with reply-to set to the reporter, small images attached, all files linked through GET /attachments/* (unguessable UUID prefix) from the `backloggr-reports` R2 bucket. Account setup that session: Email Routing onboarded for backloggr.com + iden0605@gmail.com verified destination, R2 enabled. Verified live: 200 send → email received by user, image attachment previewed, immediate resend 429, cooldown survives reload (Playwright), section screenshots at 1440/390px, live www check. One transient 500 (Cloudflare error 1104) on the very first send minutes after Email Routing onboarding — propagation, not code: the video-attachment retest succeeded (image+video stored, both /attachments/* links served 200 with correct content types, traversal to ratelimit markers 404s). Test objects deleted from the bucket after verification. Post-review polish (user feedback): form labels bumped from 11px/text-lo to 12px medium text-hi/70 for legibility, explicit "Attachments · optional" label (files were never required — description is the only required field), textarea resize capped at `min-h-[8rem] max-h-72`. Committed `0b85e5f` and pushed to main; live site redeployed (reminder: pushing does NOT deploy — `npm run deploy` is the only deploy path).

- Live-ticking session timer (2026-07-10): new `src/lib/useSessionTimer.ts` — hero fan chip counts up in h:mm:ss and the Tracking ledger's live row rolls its minutes off the same shared clock; fixed 1:47:23 base per page load, not persisted (a stored ever-growing timer would read as broken); `tabular-nums` prevents digit jitter. Tick verified in a real browser before deploy.
- Natural-copy pass (2026-07-10, user: text read "very AI like"): every visible sentence rewritten — zero em dashes in copy, staccato fragments replaced with plain sentences, Shelby's mock reply humanized, OG description de-Alt+F9'd, title separator → `·`. Display headlines kept. Voice rule recorded in ABOUT.md Conventions.
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

- RESOLVED 2026-07-10 (superseding the earlier releases-only-repo plan): the app repo `iden0605/Backloggr` went PUBLIC under GPL-3.0 and releases publish directly there with the default GITHUB_TOKEN. The intermediate `backloggr-releases` repo + RELEASES_TOKEN PAT approach was abandoned after persistent "Resource not accessible by personal access token" failures (PAT grants sever when a fine-grained token's target repo is deleted/recreated); the user then chose full open source. `src/lib/github.ts` reads `iden0605/Backloggr`; the user is deleting `backloggr-releases`.
- backloggr.com DNS: zone active on Cloudflare, `www.backloggr.com` custom domain LIVE (200); the APEX record was missing as of last check — user needs to finish `backloggr.com` in the Pages Custom domains tab (or add the proxied CNAME `@ → backloggr-bcq.pages.dev` manually), then verify.
- Real product screenshots vs. stylized CSS mockups for the visuals — starting with stylized in-page mockups since no marketing screenshots exist yet.
