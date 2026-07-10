import { useEffect, useState } from "react";
import { DownloadButton } from "./DownloadButton";

export const APP_REPO_URL = "https://github.com/iden0605/Backloggr";

const links = [
  { href: "#tracking", label: "Tracking" },
  { href: "#shelby", label: "Shelby" },
  { href: "#clips", label: "Clips" },
  { href: "#library", label: "Library" },
  { href: "#report", label: "Report a bug" },
];

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

// Quiet ghost sibling of the download CTA: hairline border, muted text that
// warms on hover — present, never competing with "Download for Windows".
export function GitHubButton({ large = false }: { large?: boolean }) {
  return (
    <a
      href={APP_REPO_URL}
      target="_blank"
      rel="noreferrer"
      className={
        "group inline-flex items-center justify-center gap-2.5 rounded-xl border border-border font-medium " +
        "text-text-lo transition-all duration-200 hover:border-border-strong hover:text-text-hi " +
        "active:scale-[0.98] select-none " +
        (large ? "px-6 py-4 text-base" : "px-4 py-2.5 text-sm")
      }
    >
      <GitHubMark className={large ? "h-5 w-5" : "h-4 w-4"} />
      GitHub
    </a>
  );
}

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll lock + Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* The blur lives on this inner bar, NOT the header: backdrop-filter
          creates a containing block, which would trap the fixed menu overlay
          below inside the 65px bar. */}
      <div
        className={
          "transition-colors duration-300 " +
          (solid || open
            ? "bg-bg/80 backdrop-blur-md border-b border-border"
            : "border-b border-transparent")
        }
      >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 select-none transition-opacity hover:opacity-80"
        >
          <img src="/favicon.svg" alt="" className="h-7 w-7" />
          <span className="font-display text-lg font-bold tracking-tight">backloggr</span>
        </a>

        {/* Desktop: section links + GitHub ghost + download CTA */}
        <div className="hidden items-center gap-8 md:flex">
          {links.slice(0, 4).map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-text-lo transition-colors hover:text-text-hi select-none"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <GitHubButton />
          <DownloadButton />
        </div>

        {/* Mobile: hamburger that morphs into an X */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-alt/60 transition-all duration-150 active:scale-[0.96] md:hidden"
        >
          <span
            aria-hidden="true"
            className={
              "absolute h-0.5 rounded-full bg-text-hi transition-all duration-300 " +
              (open ? "w-5 rotate-45" : "w-5 -translate-y-[5px]")
            }
          />
          <span
            aria-hidden="true"
            className={
              "absolute h-0.5 rounded-full bg-accent transition-all duration-300 " +
              (open ? "w-5 -rotate-45" : "w-3.5 translate-x-[3px] translate-y-[5px]")
            }
          />
        </button>
      </nav>
      </div>

      {/* Mobile menu — full-screen "shelf index": numbered rows in display type,
          staggered entrance, download + GitHub docked at the bottom. */}
      <div
        className={
          "grain fixed inset-x-0 bottom-0 top-[65px] z-40 overflow-y-auto bg-bg transition-opacity duration-300 md:hidden " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
        aria-hidden={!open}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(36rem 20rem at 85% 0%, rgba(185,106,85,0.10), transparent 65%)",
          }}
        />
        <div className="relative flex min-h-full flex-col px-6 pb-8 pt-6">
          <p
            className="shelf-label transition-all duration-300"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "none" : "translateY(10px)",
              transitionDelay: open ? "40ms" : "0ms",
            }}
          >
            Index
          </p>
          <nav className="mt-2">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 border-b border-border py-4 transition-all duration-500 active:bg-surface-alt/40 select-none"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "none" : "translateY(18px)",
                  transitionDelay: open ? `${80 + i * 55}ms` : "0ms",
                }}
              >
                <span className="font-mono text-xs text-text-lo">00{i + 1}</span>
                <span className="font-display text-3xl font-bold tracking-tight text-text-hi transition-colors group-active:text-accent">
                  {l.label}
                </span>
                <span className="ml-auto self-center font-mono text-text-lo transition-transform duration-300 group-active:translate-x-1">
                  →
                </span>
              </a>
            ))}
          </nav>

          <div
            className="mt-auto flex flex-col gap-3 pt-10 transition-all duration-500"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "none" : "translateY(18px)",
              transitionDelay: open ? `${80 + links.length * 55}ms` : "0ms",
            }}
          >
            <DownloadButton large />
            <GitHubButton large />
            <p className="pt-1 text-center font-mono text-xs text-text-lo">
              Free and open source under GPL-3.0
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
