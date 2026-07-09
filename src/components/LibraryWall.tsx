import { GAMES, Poster } from "./posters";

export function LibraryWall() {
  return (
    <section id="library" className="relative scroll-mt-24 overflow-hidden py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="shelf-label">004 / Library</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            A shelf, not a to-do list.
          </h2>
          <p className="mx-auto mt-5 max-w-lg leading-relaxed text-text-lo">
            Your whole collection as a wall of cover art. Import it from Steam in one
            step, then search and sort it with your real hours on every game. There's
            no completion percentage nagging at you, just what you own and how you've
            played it.
          </p>
        </div>

        {/* Poster wall — offset columns for shelf rhythm */}
        <div className="reveal reveal-scale mt-14" style={{ animationDelay: "0.1s" }}>
          <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
            {GAMES.map((g, i) => (
              <div key={g.title} className={i % 2 === 1 ? "translate-y-5" : ""}>
                <div className="group relative">
                  <Poster
                    game={g}
                    className="transition-transform duration-200 group-hover:-translate-y-1"
                  />
                  <div className="pointer-events-none absolute inset-x-0 -bottom-6 text-center font-mono text-[10px] text-text-lo opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {g.hours} played
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
