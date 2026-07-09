import { useState } from "react";

// Real cover art, hotlinked from Steam's public CDN (library_600x900 poster
// per appid). Each game keeps a palette-toned gradient as the fallback if the
// CDN image fails to load — so the shelf never shows a broken tile.

export interface FakeGame {
  title: string;
  hours: string;
  appid?: number; // Steam appid → real cover from the CDN
  art: string; // CSS background fallback
  pattern?: "rings" | "peaks" | "grid" | "orb" | "bands";
}

export function steamCoverUrl(appid: number): string {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`;
}

// Widescreen key art (~3840x1240), used as the Clips section's "gameplay" frame.
export function steamHeroUrl(appid: number): string {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_hero.jpg`;
}

export const GAMES: FakeGame[] = [
  { title: "Elden Ring", hours: "112h", appid: 1245620, art: "linear-gradient(150deg,#4d3a22 0%,#8a6a3a 60%,#241b10 100%)", pattern: "orb" },
  { title: "Hollow Knight", hours: "41h", appid: 367520, art: "linear-gradient(200deg,#233633 0%,#3e5a52 60%,#16201e 100%)", pattern: "rings" },
  { title: "Stardew Valley", hours: "86h", appid: 413150, art: "linear-gradient(160deg,#2e332b 0%,#4c5a44 60%,#191d16 100%)", pattern: "grid" },
  { title: "Hades", hours: "64h", appid: 1145360, art: "linear-gradient(160deg,#4a2d26 0%,#7a4636 55%,#2a1a16 100%)", pattern: "peaks" },
  { title: "Celeste", hours: "9h", appid: 504230, art: "linear-gradient(210deg,#2a2333 0%,#4a3d55 55%,#171320 100%)", pattern: "bands" },
  { title: "The Witcher 3", hours: "57h", appid: 292030, art: "linear-gradient(170deg,#31404a 0%,#4e6a7a 62%,#1a2226 100%)", pattern: "peaks" },
  { title: "Cyberpunk 2077", hours: "35h", appid: 1091500, art: "linear-gradient(190deg,#44262b 0%,#6e3d42 58%,#221316 100%)", pattern: "rings" },
  { title: "Terraria", hours: "48h", appid: 105600, art: "linear-gradient(180deg,#3b3a33 0%,#5d5847 65%,#211f1a 100%)", pattern: "grid" },
];

// What Shelby recommends in the mock chat — cozy picks that are NOT in the
// library above (the app never recommends games you already own).
export const RECS: FakeGame[] = [
  { title: "Spiritfarer", hours: "", appid: 972660, art: "linear-gradient(195deg,#2b3a3e 0%,#47616a 58%,#182124 100%)", pattern: "bands" },
  { title: "A Short Hike", hours: "", appid: 1055540, art: "linear-gradient(165deg,#33402a 0%,#5a6e42 60%,#1b2116 100%)", pattern: "peaks" },
  { title: "Unpacking", hours: "", appid: 1135690, art: "linear-gradient(185deg,#463227 0%,#6e523c 58%,#231a13 100%)", pattern: "grid" },
];

function Pattern({ kind }: { kind: FakeGame["pattern"] }) {
  const stroke = "rgba(237,232,224,0.16)";
  switch (kind) {
    case "rings":
      return (
        <svg viewBox="0 0 100 140" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="50" cy="58" r="30" fill="none" stroke={stroke} strokeWidth="1.5" />
          <circle cx="50" cy="58" r="19" fill="none" stroke={stroke} strokeWidth="1" />
          <circle cx="50" cy="58" r="8" fill="rgba(237,232,224,0.12)" />
        </svg>
      );
    case "peaks":
      return (
        <svg viewBox="0 0 100 140" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d="M0 96 L32 52 L50 74 L68 40 L100 96" fill="none" stroke={stroke} strokeWidth="1.5" />
          <circle cx="72" cy="26" r="6" fill="rgba(237,232,224,0.14)" />
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 100 140" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {[28, 46, 64, 82].map((y) => (
            <line key={y} x1="18" y1={y} x2="82" y2={y} stroke={stroke} strokeWidth="1" />
          ))}
          {[26, 44, 62, 80].map((x) => (
            <line key={x} x1={x} y1="20" x2={x} y2="90" stroke={stroke} strokeWidth="1" />
          ))}
        </svg>
      );
    case "orb":
      return (
        <svg viewBox="0 0 100 140" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="50" cy="52" r="24" fill="rgba(237,232,224,0.1)" />
          <path d="M10 100 Q50 76 90 100" fill="none" stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case "bands":
      return (
        <svg viewBox="0 0 100 140" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M-10 ${44 + i * 18} Q 50 ${28 + i * 18} 110 ${44 + i * 18}`}
              fill="none"
              stroke={stroke}
              strokeWidth="1.5"
            />
          ))}
        </svg>
      );
    default:
      return null;
  }
}

export function Poster({ game, className = "" }: { game: FakeGame; className?: string }) {
  const [failed, setFailed] = useState(false);
  const useCover = game.appid !== undefined && !failed;
  return (
    <div
      className={"relative overflow-hidden rounded-lg border border-border-strong/60 bg-surface " + className}
      style={{ aspectRatio: "2 / 3", background: useCover ? undefined : game.art }}
    >
      {useCover ? (
        <img
          src={steamCoverUrl(game.appid!)}
          alt={game.title}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          {/* Fallback: stylized poster with the title, since there's no art to carry it */}
          <Pattern kind={game.pattern} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6">
            <div className="font-display text-[9px] font-bold uppercase leading-tight tracking-wide text-text-hi/90 md:text-[11px]">
              {game.title}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
