import { RELEASES_URL } from "../lib/github";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-2.5 select-none">
          <img src="/favicon.svg" alt="" className="h-6 w-6" />
          <span className="font-display font-bold tracking-tight">backloggr</span>
        </div>
        <div className="flex items-center gap-6 font-mono text-xs text-text-lo">
          <a href="#report" className="transition-colors hover:text-text-hi">
            Report a bug
          </a>
          <a href={RELEASES_URL} className="transition-colors hover:text-text-hi">
            Releases
          </a>
          <a href="https://github.com/iden0605" className="transition-colors hover:text-text-hi">
            GitHub
          </a>
          <span>© {new Date().getFullYear()} backloggr</span>
        </div>
      </div>
    </footer>
  );
}
