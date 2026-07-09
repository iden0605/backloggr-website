# backloggr website

Marketing website for [backloggr](https://github.com/iden0605) — the Windows desktop app that tracks your game library, auto-logs playtime, recommends what to play next via Shelby, and saves gameplay clips with a hotkey.

Single-page static site: React 18 + Vite + TypeScript + Tailwind CSS v3, styled in the app's own Iron & Chalk palette.

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build locally
```

## Deploy

Static output in `dist/` — deployable to Cloudflare Pages (target host for backloggr.com) or any static host.

The hero's **Download for Windows** button asks the GitHub Releases API for the latest installer and falls back to the releases page if the API is unavailable (see `src/lib/github.ts`).
