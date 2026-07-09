import { DownloadButton } from "./DownloadButton";
import { GAMES, Poster } from "./posters";
import { formatClock, useSessionSeconds } from "../lib/useSessionTimer";

// The app's "Backdrop" idea at marketing scale: a blurred wash of cover-art
// color melting into near-black, a poster-sized headline, and a drifting fan of
// covers where the color lives — no fake app window, no white slabs.
export function Hero() {
  return (
    <section className="grain relative overflow-hidden pb-28 pt-36 md:pt-44">
      {/* Backdrop glow — muted cover-art color, never neon */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 left-1/2 h-[42rem] w-[72rem] -translate-x-1/2 opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(185,106,85,0.32), transparent 70%), radial-gradient(closest-side at 30% 60%, rgba(110,153,135,0.18), transparent 70%), radial-gradient(closest-side at 72% 40%, rgba(194,161,90,0.14), transparent 70%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-[1fr_auto]">
        <div className="max-w-3xl">
          <p className="shelf-label animate-fade-up" style={{ animationDelay: "0.05s" }}>
            Free · Windows 10/11 · Local-first
          </p>
          <h1
            className="mt-5 animate-fade-up font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-8xl"
            style={{ animationDelay: "0.15s" }}
          >
            Your games,
            <br />
            on the record.
          </h1>
          <p
            className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-text-lo"
            style={{ animationDelay: "0.28s" }}
          >
            backloggr keeps your whole library on one shelf. It logs your playtime on
            its own, clips your best moments with a single key, and Shelby is there
            for when you can't decide what to play next.
          </p>
          <div
            className="mt-9 flex animate-fade-up flex-wrap items-center gap-x-5 gap-y-3"
            style={{ animationDelay: "0.4s" }}
          >
            <DownloadButton large />
            <span className="font-mono text-xs text-text-lo">
              No account needed. Everything stays on your PC.
            </span>
          </div>
        </div>

        <PosterFan />
        <MobilePosterRow />
      </div>
    </section>
  );
}

// Compact fan for small screens — same covers, tucked under the CTA.
function MobilePosterRow() {
  const row = [
    { game: GAMES[1], rotate: "-6deg", y: "0.75rem" },
    { game: GAMES[0], rotate: "0deg", y: "0rem" },
    { game: GAMES[3], rotate: "6deg", y: "0.75rem" },
  ];
  return (
    <div aria-hidden="true" className="relative mt-4 flex justify-center gap-0 lg:hidden">
      <div
        className="absolute left-1/2 top-1/2 h-40 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(185,106,85,0.26), transparent)" }}
      />
      {row.map((f, i) => (
        <div
          key={f.game.title}
          className="w-28 first:-mr-4 last:-ml-4"
          style={{
            transform: `rotate(${f.rotate}) translateY(${f.y})`,
            zIndex: i === 1 ? 2 : 1,
          }}
        >
          <Poster game={f.game} className="shadow-[0_18px_44px_-10px_rgba(0,0,0,0.85)]" />
        </div>
      ))}
    </div>
  );
}

// A loose fan of covers, each drifting on its own slow float — the cover art is
// the loudest thing on screen, exactly like the app itself.
function PosterFan() {
  const seconds = useSessionSeconds();
  const fan = [
    { game: GAMES[1], rotate: "-10deg", x: "0rem", y: "3.5rem", delay: "0s", z: 1 },
    { game: GAMES[0], rotate: "-2deg", x: "5.5rem", y: "0rem", delay: "0.9s", z: 3 },
    { game: GAMES[3], rotate: "9deg", x: "11.5rem", y: "4rem", delay: "1.7s", z: 2 },
  ];
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto hidden h-[26rem] w-[22rem] animate-fade-in lg:block"
      style={{ animationDelay: "0.5s" }}
    >
      {/* Glow pooled behind the stack */}
      <div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(185,106,85,0.28), transparent)" }}
      />
      {fan.map((f) => (
        <div
          key={f.game.title}
          className="animate-float absolute w-40"
          style={{
            left: f.x,
            top: f.y,
            zIndex: f.z,
            animationDelay: f.delay,
          }}
        >
          <div style={{ transform: `rotate(${f.rotate})` }}>
            <Poster
              game={f.game}
              className="shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85)]"
            />
          </div>
        </div>
      ))}
      {/* Session chip pinned to the front poster */}
      <div className="absolute left-24 top-[19.5rem] z-10 flex items-center gap-2 rounded-lg border border-border-strong bg-bg/90 px-3.5 py-2 backdrop-blur">
        <span className="h-2 w-2 animate-pulse-soft rounded-full bg-accent" />
        <span className="font-mono text-xs tabular-nums text-text-hi">
          {formatClock(seconds)} this session
        </span>
      </div>
    </div>
  );
}
