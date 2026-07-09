import { Poster, RECS } from "./posters";

export function Shelby() {
  return (
    <section id="shelby" className="relative scroll-mt-24 overflow-hidden py-28">
      {/* Quiet rust wash — Shelby's page is the app's sanctioned rust-forward surface */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60rem 30rem at 70% 20%, rgba(185,106,85,0.09), transparent 65%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2">
        {/* Chat mockup — left on desktop so the section alternates against Tracking */}
        <div className="reveal reveal-left order-2 md:order-1">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                  <rect x="2" y="8" width="20" height="10" rx="5" />
                  <circle cx="8" cy="13" r="1" fill="currentColor" stroke="none" />
                  <circle cx="16" cy="13" r="1" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <div>
                <div className="font-display text-sm font-bold">Shelby</div>
                <div className="font-mono text-[11px] text-text-lo">knows your shelf</div>
              </div>
            </div>
            <div className="space-y-4 pt-5">
              <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md border border-border-strong bg-surface-alt px-4 py-2.5 text-sm">
                Something cozy but with real progression — 20 hours max?
              </div>
              <div className="max-w-[92%] text-sm leading-relaxed text-text-hi/90">
                You put 86 hours into Stardew Valley, so gentle-loop games clearly
                stick. Three that fit the window:
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {RECS.map((g) => (
                  <Poster key={g.title} game={g} />
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-text-lo">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Picked from your playtime, not a top-10 list
              </div>
            </div>
          </div>
        </div>

        <div className="reveal reveal-right order-1 md:order-2">
          <p className="shelf-label">002 / Shelby</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            "What should
            <br />I play next?"
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-text-lo">
            Shelby reads your actual playtime — not a wishlist you wrote two years ago —
            and recommends games that fit how you really play. Ask in plain words, answer
            a sharp follow-up or two, and get a shortlist of real, verified titles with a
            reason for every pick.
          </p>
          <p className="mt-4 max-w-md leading-relaxed text-text-lo">
            Nothing you already own gets recommended back to you. New releases make the
            cut too, not just the classics everyone lists.
          </p>
        </div>
      </div>
    </section>
  );
}
