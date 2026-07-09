import { useState } from "react";
import { GAMES, steamHeroUrl } from "./posters";

export function Clips() {
  return (
    <section id="clips" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <div className="reveal reveal-left">
          <p className="shelf-label">003 / Clips</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            That moment?
            <br />
            Already recorded.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-text-lo">
            backloggr keeps a rolling buffer while you play, so the clutch moment you
            never saw coming is already recorded. Press your clip hotkey and the last
            30 seconds of gameplay, game audio and mic are saved under the right game.
          </p>
          <p className="mt-4 max-w-md leading-relaxed text-text-lo">
            There's nothing to set up and no virtual audio devices to install. A small
            in-game toast confirms the save without pulling you out of the game.
          </p>
        </div>

        {/* Clip-save visual: viewport + buffer timeline */}
        <div className="reveal reveal-right">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
            {/* gameplay frame — real key art from the CDN, gradient fallback */}
            <GameFrame>
              {/* overlay toast */}
              <div className="absolute right-3 top-3 flex items-center gap-2.5 rounded-lg border border-border-strong bg-bg/90 px-3.5 py-2 backdrop-blur">
                <svg viewBox="0 0 20 20" fill="none" stroke="#6E9987" strokeWidth="2.2" className="h-4 w-4" aria-hidden="true">
                  <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-mono text-xs text-text-hi">Clip saved · 30s</span>
              </div>
            </GameFrame>
            {/* buffer timeline */}
            <div className="border-t border-border p-5">
              <div className="flex items-center justify-between">
                <span className="shelf-label">Rolling buffer</span>
                <span className="font-mono text-[11px] text-text-lo">always on while you play</span>
              </div>
              <div className="mt-3.5 flex h-8 items-stretch gap-1">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className={
                      "flex-1 rounded-sm " +
                      (i >= 12 ? "bg-accent/80" : "bg-border-strong/70")
                    }
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] text-text-lo">
                <span>−3:00</span>
                <span className="text-accent">saved: last 0:30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Real widescreen key art (Elden Ring — the game "playing" everywhere else on
// the page) standing in for gameplay; falls back to a palette gradient with
// abstract peaks if the CDN image can't load.
function GameFrame({ children }: { children: React.ReactNode }) {
  const [failed, setFailed] = useState(false);
  const eldenRing = GAMES[0];
  return (
    <div
      className="relative h-56 md:h-64"
      style={
        failed
          ? { background: "linear-gradient(165deg, #3a2b24 0%, #6b4434 45%, #241a15 100%)" }
          : undefined
      }
    >
      {failed ? (
        <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d="M0 190 L90 120 L150 160 L230 84 L310 150 L400 100 L400 240 L0 240 Z" fill="rgba(21,20,20,0.45)" />
          <circle cx="284" cy="58" r="17" fill="rgba(237,232,224,0.14)" />
        </svg>
      ) : (
        <img
          src={steamHeroUrl(eldenRing.appid!)}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {/* Darken toward the timeline panel so the toast and border read cleanly */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
      {children}
    </div>
  );
}
