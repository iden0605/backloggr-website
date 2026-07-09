import { formatHm, useSessionSeconds } from "../lib/useSessionTimer";

export function Tracking() {
  const seconds = useSessionSeconds();
  return (
    <section id="tracking" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <div className="reveal reveal-left">
          <p className="shelf-label">001 / Auto tracking</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Launch a game.
            <br />
            That's the whole job.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-text-lo">
            backloggr watches for your games and logs every session on its own — start
            time, duration, what you actually played. Games you launch from Steam, Epic,
            GOG, Battle.net, or Riot add themselves to your library the first time you
            run them. No timers to start. No spreadsheets to keep honest.
          </p>
          <p className="mt-4 max-w-md leading-relaxed text-text-lo">
            Crashed mid-session? Forced a restart? Your hours survive — sessions
            reconcile themselves on the next launch.
          </p>
        </div>

        {/* Session ledger visual */}
        <div className="reveal reveal-right rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <span className="shelf-label">Sessions · this week</span>
            <span className="font-mono text-sm text-text-hi">14h 32m</span>
          </div>
          <ul className="mt-5 space-y-3">
            {[
              { name: "Elden Ring", when: "Now", time: formatHm(seconds), live: true },
              { name: "Hollow Knight", when: "Yesterday", time: "2h 05m" },
              { name: "Hades", when: "Tuesday", time: "3h 40m" },
              { name: "The Witcher 3", when: "Monday", time: "58m" },
            ].map((s) => (
              <li
                key={s.name}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-surface-alt/60 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {s.live ? (
                    <span className="h-2 w-2 animate-pulse-soft rounded-full bg-accent" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-border-strong" />
                  )}
                  <div>
                    <div className="text-sm font-semibold">{s.name}</div>
                    <div className="font-mono text-[11px] text-text-lo">{s.when}</div>
                  </div>
                </div>
                <span
                  className={
                    "font-mono text-sm tabular-nums " + (s.live ? "text-accent" : "text-text-lo")
                  }
                >
                  {s.time}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-border pt-4 font-mono text-[11px] text-text-lo">
            Logged automatically — nothing to press
          </div>
        </div>
      </div>
    </section>
  );
}
