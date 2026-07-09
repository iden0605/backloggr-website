import { DownloadButton } from "./DownloadButton";

export function FinalCta() {
  return (
    <section className="grain relative overflow-hidden py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(48rem 24rem at 50% 110%, rgba(185,106,85,0.16), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="reveal font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
          Put your library
          <br />
          on the record.
        </h2>
        <p className="reveal mx-auto mt-6 max-w-md leading-relaxed text-text-lo" style={{ animationDelay: "0.12s" }}>
          Free, private, and quietly running in your tray the next time you press play.
        </p>
        <div className="reveal mt-10 flex justify-center" style={{ animationDelay: "0.24s" }}>
          <DownloadButton large />
        </div>
      </div>
    </section>
  );
}
