import { useEffect, useState } from "react";

// The fictional live session shown across the page (hero chip + tracking
// ledger) ticks up from this base on every load. Deliberately NOT persisted:
// a stored timer grows unboundedly and "412:09:33 this session" reads as
// broken rather than alive.
const BASE_SECONDS = 1 * 3600 + 47 * 60 + 23; // 1:47:23

export function useSessionSeconds(): number {
  const [seconds, setSeconds] = useState(BASE_SECONDS);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return seconds;
}

// 1:47:23
export function formatClock(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// 1h 47m
export function formatHm(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
}
