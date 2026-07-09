# About

_Last updated: 2026-07-10 (initial creation — repo scaffolded this session)_

## What It Is

The marketing website for **backloggr** (backloggr.com) — the Windows-first desktop app (separate repo: `game-app`) that tracks a personal game library, auto-logs playtime, recommends games via the Shelby AI chatbot, and saves gameplay clips on a hotkey. This site's job: look stunning, explain the product, and get visitors to the Windows download.

## Stack

- **Framework:** React 18 + Vite + TypeScript (static SPA — no SSR needed for a single marketing page)
- **Styling:** Tailwind CSS v3 (PostCSS), same semantic palette names as the app repo
- **Fonts:** Archivo (display + sans) and JetBrains Mono — matching the app
- **Deployment:** static `dist/` output; target is Cloudflare Pages (or any static host) on backloggr.com
- **Data:** latest installer version/URL fetched client-side from the GitHub Releases API (the public `iden0605/Backloggr` app repo, GPL-3.0) with a hardcoded fallback link — per the game-app decision that the site pulls release info from the API rather than sharing code

## Structure

```
src/
  components/     One file per page section (Hero, Features, Clips, Shelby, Download, Footer…)
  lib/            github.ts — latest-release fetch + asset picking (.msi/.exe);
                  useSessionTimer.ts — the shared ticking clock behind the fictional
                  live session (hero chip h:mm:ss + tracking ledger row Xh Ym), counts
                  up from a fixed 1:47:23 base per load, deliberately NOT persisted
  App.tsx         Section composition (single scrolling page)
  index.css       Tailwind layers + base rules (selection color, scrollbar, .page-title-style type)
tailwind.config.js  Iron & Chalk palette as semantic colors (bg/surface/text-hi/text-lo/accent/…)
```

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/github.ts` | Fetches the latest GitHub release, picks the Windows installer asset, exposes version string; falls back to the releases page URL on failure |
| `tailwind.config.js` | Iron & Chalk semantic colors — copied from the app repo so both surfaces stay in sync |
| `src/App.tsx` | Orders the page sections |

## Common Tasks

- **Add a page section:** create `src/components/<Name>.tsx`, add it to `App.tsx` in scroll order.
- **Change download target:** edit `src/lib/github.ts` (repo const + asset-matching rules).
- **Verify:** `npm run build` (tsc + vite) must pass; preview with `npm run dev`.

## Conventions & Gotchas

- **Iron & Chalk palette is locked** (from the app): bg `#151414`, chalk text `#EDE8E0`, rust accent `#B96A55`. Rust is a scarce "live marker" in the app — the website may use it slightly more freely as the brand accent, but keep it low-saturation and let cover-art-style imagery carry color. No high-saturation neon accents ("generic AI-generated" was explicitly rejected in the app's design rounds).
- **No italic display type for headings** — rejected twice in the app repo. Headings are bold Archivo, tight tracking, upright.
- Primary CTA must say **"Download for Windows"** explicitly (user requirement) and live in the hero.
- The app repo is separate — never import code from it; visual consistency is maintained by convention (palette values, fonts), not shared packages.
- The AI chatbot is named **Shelby** in all user-facing copy — never "the AI".
- **Game art is real cover art hotlinked from Steam's public CDN** (`steamCoverUrl` in `posters.tsx`, `library_600x900.jpg` per appid — 2:3 aspect) — user's explicit choice 2026-07-10, accepting the small unlicensed-artwork risk as industry-common promotional use. Every game keeps a palette-toned gradient poster as the automatic `onError` fallback, so a pulled/missing cover never shows a broken tile. Game *names* are fine to use (titles aren't copyrightable).
- **Don't hardcode the clip hotkey in site copy** — the app is making it user-configurable (app repo task 26). Copy says "your clip hotkey" / "one keypress"; Alt+F9 appears nowhere on the site.
- **Copy voice (user feedback 2026-07-10: "very AI like")**: no em dashes in user-visible text (code comments fine; the title separator is `·`), no staccato fragment patterns ("No X. No Y. Just Z."), plain full sentences. Display headlines ("That moment? Already recorded." etc.) are the sanctioned exception. Time-like widgets: running clocks tick (session chip + ledger live row, via the shared timer), durations/aggregates stay static.
- The app itself has NOT shipped a public release yet (release.yml has never run) — until a real release exists, the download button's API fetch will 404 and use the fallback; this is expected.
