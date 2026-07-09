import { useEffect, useState } from "react";
import { DownloadButton } from "./DownloadButton";

const links = [
  { href: "#tracking", label: "Tracking" },
  { href: "#shelby", label: "Shelby" },
  { href: "#clips", label: "Clips" },
  { href: "#library", label: "Library" },
];

export function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 " +
        (solid ? "bg-bg/80 backdrop-blur-md border-b border-border" : "border-b border-transparent")
      }
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2.5 select-none transition-opacity hover:opacity-80">
          <img src="/favicon.svg" alt="" className="h-7 w-7" />
          <span className="font-display text-lg font-bold tracking-tight">backloggr</span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-text-lo transition-colors hover:text-text-hi select-none"
            >
              {l.label}
            </a>
          ))}
        </div>
        <DownloadButton />
      </nav>
    </header>
  );
}
