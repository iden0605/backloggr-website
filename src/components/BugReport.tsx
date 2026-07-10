import { useEffect, useRef, useState } from "react";

// Bug report section — posts to the report worker, which stores attachments
// in R2 and emails the report to the developer. A 3-minute cooldown after a
// successful send persists across reloads via localStorage (the worker
// enforces the same window per IP, so clearing storage doesn't bypass it).

const REPORT_URL = "https://backloggr-report.backloggr.workers.dev/report";
const COOLDOWN_KEY = "backloggr:reportCooldownUntil";
const COOLDOWN_SECONDS = 180;

const MAX_FILES = 5;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 60 * 1024 * 1024;
const MAX_TOTAL_BYTES = 80 * 1024 * 1024;
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

interface Attachment {
  id: string;
  file: File;
  previewUrl: string | null; // object URL for images, null for videos
}

function readCooldownUntil(): number {
  const raw = localStorage.getItem(COOLDOWN_KEY);
  const until = raw ? Number(raw) : 0;
  return Number.isFinite(until) ? until : 0;
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatBytes(n: number): string {
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(n / 1024))} KB`;
}

const inputClass =
  "w-full rounded-lg border border-border bg-surface-alt px-3.5 py-2.5 text-sm text-text-hi " +
  "placeholder:text-text-lo/70 transition-colors focus:border-accent/60 focus:outline-none";

const labelClass =
  "mb-1.5 block font-mono text-xs font-medium uppercase tracking-[0.14em] text-text-hi/70";
const labelOptional = <span className="normal-case tracking-normal text-text-lo">optional</span>;

export function BugReport() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cooldown countdown, restored from localStorage on mount and ticked while active.
  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, Math.ceil((readCooldownUntil() - Date.now()) / 1000));
      setCooldownLeft(left);
      return left;
    };
    if (tick() === 0) return;
    const timer = window.setInterval(() => {
      if (tick() === 0) window.clearInterval(timer);
    }, 500);
    return () => window.clearInterval(timer);
  }, [sent]);

  // Object URLs live as long as the tile; revoke on removal and unmount.
  useEffect(() => {
    return () => {
      attachments.forEach((a) => a.previewUrl && URL.revokeObjectURL(a.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCooldown = (seconds: number) => {
    localStorage.setItem(COOLDOWN_KEY, String(Date.now() + seconds * 1000));
    setCooldownLeft(seconds);
    const timer = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((readCooldownUntil() - Date.now()) / 1000));
      setCooldownLeft(left);
      if (left === 0) window.clearInterval(timer);
    }, 500);
  };

  const addFiles = (incoming: FileList | File[]) => {
    const next = [...attachments];
    let total = next.reduce((sum, a) => sum + a.file.size, 0);
    let problem: string | null = null;
    for (const file of Array.from(incoming)) {
      if (next.length >= MAX_FILES) {
        problem = `Up to ${MAX_FILES} files per report.`;
        break;
      }
      const isImage = IMAGE_TYPES.includes(file.type);
      const isVideo = VIDEO_TYPES.includes(file.type);
      if (!isImage && !isVideo) {
        problem = `"${file.name}" is not a supported image or video.`;
        continue;
      }
      if (isImage && file.size > MAX_IMAGE_BYTES) {
        problem = `Images need to stay under ${formatBytes(MAX_IMAGE_BYTES)}.`;
        continue;
      }
      if (isVideo && file.size > MAX_VIDEO_BYTES) {
        problem = `Videos need to stay under ${formatBytes(MAX_VIDEO_BYTES)}.`;
        continue;
      }
      if (total + file.size > MAX_TOTAL_BYTES) {
        problem = `All attachments together need to stay under ${formatBytes(MAX_TOTAL_BYTES)}.`;
        continue;
      }
      total += file.size;
      next.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: isImage ? URL.createObjectURL(file) : null,
      });
    }
    setAttachments(next);
    setError(problem);
  };

  const removeAttachment = (id: string) => {
    setAttachments((current) => {
      const target = current.find((a) => a.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return current.filter((a) => a.id !== id);
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending || cooldownLeft > 0 || !description.trim()) return;
    setSending(true);
    setError(null);
    setSent(false);
    try {
      const form = new FormData();
      form.set("name", name.trim());
      form.set("email", email.trim());
      form.set("description", description.trim());
      attachments.forEach((a) => form.append("files", a.file, a.file.name));
      const res = await fetch(REPORT_URL, { method: "POST", body: form });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        retryAfter?: number;
        cooldown?: number;
      };
      if (res.status === 429) {
        startCooldown(body.retryAfter ?? COOLDOWN_SECONDS);
        setError("A report was sent from here recently. The timer below shows when you can send another.");
        return;
      }
      if (!res.ok) {
        setError(body.error ?? "Something went wrong while sending. Please try again.");
        return;
      }
      attachments.forEach((a) => a.previewUrl && URL.revokeObjectURL(a.previewUrl));
      setAttachments([]);
      setName("");
      setEmail("");
      setDescription("");
      setSent(true);
      startCooldown(body.cooldown ?? COOLDOWN_SECONDS);
    } catch {
      setError("The report could not be sent. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const disabled = sending || cooldownLeft > 0 || !description.trim();

  return (
    <section id="report" className="relative scroll-mt-24 overflow-hidden py-28">
      <div className="relative mx-auto grid max-w-6xl items-start gap-14 px-6 md:grid-cols-2">
        <div className="reveal reveal-left">
          <p className="shelf-label">005 / Bug reports</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Spotted
            <br />a bug?
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-text-lo">
            backloggr is built by one person, and clear reports are the fastest way
            problems get fixed. Describe what went wrong and what you expected to
            happen, and attach a screenshot or a short clip if you have one.
          </p>
          <p className="mt-4 max-w-md leading-relaxed text-text-lo">
            Leaving an email is optional. It just makes it possible to let you know
            when the fix ships.
          </p>
          <div className="mt-6 flex items-center gap-2 font-mono text-[11px] text-text-lo">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Goes straight to the developer's inbox
          </div>
        </div>

        <form onSubmit={onSubmit} className="reveal reveal-right rounded-2xl border border-border bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Name {labelOptional}</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                placeholder="How should the fix credit you?"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Email {labelOptional}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={200}
                placeholder="For a reply when it's fixed"
                className={inputClass}
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className={labelClass}>What happened?</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength={5000}
              rows={5}
              placeholder="What went wrong, and what did you expect instead?"
              className={inputClass + " min-h-[8rem] max-h-72 resize-y"}
            />
          </label>

          {/* Attachment dropzone */}
          <span className={labelClass + " mt-4"}>Attachments {labelOptional}</span>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
            className={
              "cursor-pointer rounded-lg border border-dashed px-4 py-5 text-center transition-all duration-200 " +
              (dragOver
                ? "border-accent/70 bg-accent/5"
                : "border-border-strong hover:border-accent/40 hover:bg-surface-alt/50")
            }
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={[...IMAGE_TYPES, ...VIDEO_TYPES].join(",")}
              className="hidden"
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className={
                "mx-auto h-5 w-5 transition-colors " + (dragOver ? "text-accent" : "text-text-lo")
              }
              aria-hidden="true"
            >
              <path d="M12 16V4m0 0 4 4m-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
            </svg>
            <p className="mt-2 text-sm text-text-hi/80">
              Drop screenshots or clips here, or click to browse
            </p>
            <p className="mt-1 font-mono text-xs text-text-lo">
              PNG · JPG · WEBP · GIF · MP4 · WEBM · up to {MAX_FILES} files
            </p>
          </div>

          {/* Attachment previews */}
          {attachments.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {attachments.map((a) => (
                <div key={a.id} className="group relative w-20 animate-fade-up">
                  {a.previewUrl ? (
                    <img
                      src={a.previewUrl}
                      alt={a.file.name}
                      className="h-20 w-20 rounded-lg border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-border bg-surface-alt">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-6 w-6 text-text-lo"
                        aria-hidden="true"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m10 9 5 3-5 3V9z" fill="currentColor" stroke="none" />
                      </svg>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAttachment(a.id)}
                    aria-label={`Remove ${a.file.name}`}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-border-strong bg-surface text-text-lo transition-all hover:border-danger/60 hover:text-danger active:scale-95"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-3 w-3" aria-hidden="true">
                      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                    </svg>
                  </button>
                  <p className="mt-1 truncate font-mono text-[10px] text-text-lo" title={a.file.name}>
                    {a.file.name}
                  </p>
                  <p className="font-mono text-[10px] text-text-lo/60">{formatBytes(a.file.size)}</p>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="mt-3 animate-fade-up text-sm text-danger" role="alert">
              {error}
            </p>
          )}
          {sent && !error && (
            <p className="mt-3 animate-fade-up text-sm text-success" role="status">
              Thanks for the report. It just landed in the developer's inbox.
            </p>
          )}

          <button
            type="submit"
            disabled={disabled}
            className={
              "mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-xl border px-5 py-3 text-sm font-semibold " +
              "transition-all duration-200 select-none " +
              (disabled
                ? "cursor-not-allowed border-border bg-surface-alt/50 text-text-lo"
                : "border-border-strong bg-surface-alt/90 text-text-hi hover:border-accent/60 hover:shadow-[0_0_36px_-8px_rgba(185,106,85,0.5)] active:scale-[0.98]")
            }
          >
            {cooldownLeft > 0 ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" strokeLinecap="round" />
                </svg>
                <span className="font-mono tabular-nums">
                  Next report in {formatCountdown(cooldownLeft)}
                </span>
              </>
            ) : sending ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-text-lo border-t-accent"
                  aria-hidden="true"
                />
                Sending report
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4 text-accent"
                  aria-hidden="true"
                >
                  <path d="m9 9-1.5-3M15 9l1.5-3M9 15H5m14 0h-4m-6-3H5.5M18.5 12H15" strokeLinecap="round" />
                  <rect x="9" y="7" width="6" height="10" rx="3" />
                </svg>
                Send report
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
