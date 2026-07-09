// Honest product facts in mono type — no invented user counts or star ratings.
const SPECS = [
  { value: "1", label: "keypress to save a clip" },
  { value: "0", label: "accounts required" },
  { value: "5s", label: "to detect a launch" },
  { value: "100%", label: "of your data stays local" },
];

export function Specs() {
  return (
    <section className="border-y border-border bg-surface/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-border md:grid-cols-4 md:divide-x">
        {SPECS.map((s, i) => (
          <div
            key={s.label}
            className="reveal px-6 py-10 text-center"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="font-mono text-3xl font-semibold tracking-tight text-text-hi md:text-4xl">
              {s.value}
            </div>
            <div className="shelf-label mt-2.5">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
