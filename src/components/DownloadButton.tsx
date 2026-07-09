import { useEffect, useState } from "react";
import { fetchLatestWindowsRelease, RELEASES_URL, WindowsRelease } from "../lib/github";

function WindowsMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M0 2.1 6.5 1.2v6.3H0V2.1zm7.3-1L16 0v7.5H7.3V1.1zM0 8.5h6.5v6.3L0 13.9V8.5zm7.3 0H16V16l-8.7-1.2V8.5z" />
    </svg>
  );
}

let cached: WindowsRelease | null | undefined;

export function useLatestRelease() {
  const [release, setRelease] = useState<WindowsRelease | null>(cached ?? null);
  useEffect(() => {
    if (cached !== undefined) return;
    let alive = true;
    fetchLatestWindowsRelease().then((r) => {
      cached = r;
      if (alive) setRelease(r);
    });
    return () => {
      alive = false;
    };
  }, []);
  return release;
}

// Dark-surface button in the app's own register: iron surface, hairline border,
// rust warming on hover — chalk stays for text, never a white slab.
export function DownloadButton({ large = false }: { large?: boolean }) {
  const release = useLatestRelease();
  return (
    <a
      href={release?.url ?? RELEASES_URL}
      className={
        "group inline-flex items-center gap-3 rounded-xl border font-semibold text-text-hi " +
        "border-border-strong bg-surface-alt/90 backdrop-blur transition-all duration-200 " +
        "hover:border-accent/60 hover:bg-surface-alt hover:shadow-[0_0_36px_-8px_rgba(185,106,85,0.5)] " +
        "active:scale-[0.98] select-none " +
        (large ? "px-8 py-4 text-lg" : "px-5 py-2.5 text-sm")
      }
    >
      <WindowsMark
        className={
          "text-accent transition-colors group-hover:text-accent-hover " +
          (large ? "h-5 w-5" : "h-4 w-4")
        }
      />
      Download for Windows
      {release && (
        <span className="font-mono text-xs font-medium text-text-lo">v{release.version}</span>
      )}
    </a>
  );
}
