// Bug report intake worker for backloggr.com.
//
// POST /report — multipart form from the site's Report a bug section.
//   Attachments are stored in R2 under an unguessable UUID prefix; the report
//   is emailed to the developer with small images attached inline and every
//   file linked back through GET /attachments/*. A per-IP marker object in R2
//   enforces the same 3-minute cooldown the frontend shows.

import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

interface Env {
  REPORTS: R2Bucket;
  // Email Routing send binding — free, restricted to verified destination
  // addresses (this worker only ever sends to the developer).
  EMAIL: { send(message: EmailMessage): Promise<void> };
}

const REPORT_TO = "iden0605@gmail.com";
const REPORT_FROM = { email: "bugs@backloggr.com", name: "backloggr bug reports" };

const COOLDOWN_SECONDS = 180;
const MAX_FILES = 5;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 60 * 1024 * 1024;
const MAX_TOTAL_BYTES = 80 * 1024 * 1024;
const MAX_DESCRIPTION_CHARS = 5000;
// Email budget: routed messages cap out around 25 MiB and base64 inflates by
// ~37%, so images only ride along while they fit comfortably; every file is
// always linked regardless.
const MAX_INLINE_IMAGE_BYTES = 6 * 1024 * 1024;
const MAX_INLINE_TOTAL_BYTES = 12 * 1024 * 1024;

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

const ALLOWED_ORIGINS = new Set([
  "https://backloggr.com",
  "https://www.backloggr.com",
  "https://backloggr-bcq.pages.dev",
]);

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin") ?? "";
  const allowed =
    ALLOWED_ORIGINS.has(origin) || origin.startsWith("http://localhost:") ? origin : "https://backloggr.com";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function json(request: Request, status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(request) },
  });
}

function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
  return (cleaned || "file").slice(-80);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function formatBytes(n: number): string {
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(n / 1024))} KB`;
}

async function cooldownRemaining(env: Env, ip: string): Promise<number> {
  const marker = await env.REPORTS.get(`ratelimit/${ip}`);
  if (!marker) return 0;
  const last = Number(await marker.text());
  if (!Number.isFinite(last)) return 0;
  const elapsed = (Date.now() - last) / 1000;
  return elapsed < COOLDOWN_SECONDS ? Math.ceil(COOLDOWN_SECONDS - elapsed) : 0;
}

interface StoredFile {
  key: string;
  filename: string;
  type: string;
  size: number;
  url: string;
  bytes: ArrayBuffer;
}

async function handleReport(request: Request, env: Env): Promise<Response> {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const remaining = await cooldownRemaining(env, ip);
  if (remaining > 0) {
    return json(request, 429, { error: "cooldown", retryAfter: remaining });
  }

  const contentLength = Number(request.headers.get("Content-Length") ?? 0);
  if (contentLength > MAX_TOTAL_BYTES + 1024 * 1024) {
    return json(request, 413, { error: "Attachments are too large for one report." });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(request, 400, { error: "Could not read the form data." });
  }

  const name = String(form.get("name") ?? "").trim().slice(0, 100);
  const email = String(form.get("email") ?? "").trim().slice(0, 200);
  const description = String(form.get("description") ?? "").trim();

  if (!description) {
    return json(request, 400, { error: "The report text is required." });
  }
  if (description.length > MAX_DESCRIPTION_CHARS) {
    return json(request, 400, { error: "The report text is too long." });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(request, 400, { error: "That email address does not look valid." });
  }

  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES) {
    return json(request, 400, { error: `At most ${MAX_FILES} attachments per report.` });
  }
  let total = 0;
  for (const f of files) {
    const isImage = IMAGE_TYPES.has(f.type);
    const isVideo = VIDEO_TYPES.has(f.type);
    if (!isImage && !isVideo) {
      return json(request, 400, { error: `"${f.name}" is not a supported image or video type.` });
    }
    if (isImage && f.size > MAX_IMAGE_BYTES) {
      return json(request, 400, { error: `"${f.name}" is over the ${formatBytes(MAX_IMAGE_BYTES)} image limit.` });
    }
    if (isVideo && f.size > MAX_VIDEO_BYTES) {
      return json(request, 400, { error: `"${f.name}" is over the ${formatBytes(MAX_VIDEO_BYTES)} video limit.` });
    }
    total += f.size;
  }
  if (total > MAX_TOTAL_BYTES) {
    return json(request, 400, { error: "Attachments are too large for one report." });
  }

  // Store attachments under an unguessable prefix; links only work end-to-end.
  const reportId = crypto.randomUUID();
  const origin = new URL(request.url).origin;
  const stored: StoredFile[] = [];
  for (const [i, f] of files.entries()) {
    const bytes = await f.arrayBuffer();
    const key = `reports/${reportId}/${i + 1}-${sanitizeFilename(f.name)}`;
    await env.REPORTS.put(key, bytes, { httpMetadata: { contentType: f.type } });
    stored.push({
      key,
      filename: f.name,
      type: f.type,
      size: f.size,
      url: `${origin}/attachments/${key.slice("reports/".length)}`,
      bytes,
    });
  }

  // Small images ride along as attachments (Gmail previews them in place);
  // videos and anything over budget are links into R2.
  const attached: StoredFile[] = [];
  let inlineTotal = 0;
  for (const f of stored) {
    if (!IMAGE_TYPES.has(f.type)) continue;
    if (f.size > MAX_INLINE_IMAGE_BYTES || inlineTotal + f.size > MAX_INLINE_TOTAL_BYTES) continue;
    inlineTotal += f.size;
    attached.push(f);
  }

  const reporter = name || "Anonymous";
  const when = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";

  const textLines = [
    `Reporter: ${reporter}`,
    `Email: ${email || "(not provided)"}`,
    `Received: ${when}`,
    `Report ID: ${reportId}`,
    "",
    description,
  ];
  if (stored.length > 0) {
    textLines.push("", "Attachments:");
    for (const f of stored) textLines.push(`- ${f.filename} (${formatBytes(f.size)}): ${f.url}`);
  }

  const attachmentRows = stored
    .map(
      (f) =>
        `<li style="margin:4px 0"><a href="${f.url}" style="color:#B96A55">${escapeHtml(f.filename)}</a>` +
        ` <span style="color:#888">(${f.type.split("/")[0]}, ${formatBytes(f.size)})</span></li>`
    )
    .join("");
  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;color:#222">
    <h2 style="margin:0 0 4px">New bug report</h2>
    <p style="margin:0 0 16px;color:#888;font-size:13px">${escapeHtml(when)} · ${reportId}</p>
    <table style="font-size:14px;border-collapse:collapse">
      <tr><td style="padding:2px 16px 2px 0;color:#888">From</td><td>${escapeHtml(reporter)}</td></tr>
      <tr><td style="padding:2px 16px 2px 0;color:#888">Email</td><td>${
        email ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : "(not provided)"
      }</td></tr>
    </table>
    <p style="white-space:pre-wrap;font-size:15px;line-height:1.55;margin:16px 0;padding:14px 16px;background:#f6f4f2;border-radius:10px">${escapeHtml(
      description
    )}</p>
    ${stored.length > 0 ? `<p style="margin:16px 0 4px;font-weight:600;font-size:14px">Attachments</p><ul style="margin:0;padding-left:18px;font-size:14px">${attachmentRows}</ul>` : ""}
  </div>`;

  try {
    const msg = createMimeMessage();
    msg.setSender({ name: REPORT_FROM.name, addr: REPORT_FROM.email });
    msg.setRecipient(REPORT_TO);
    msg.setSubject(`backloggr bug report from ${reporter}`);
    if (email) msg.setHeader("Reply-To", email);
    msg.addMessage({ contentType: "text/plain", data: textLines.join("\n") });
    msg.addMessage({ contentType: "text/html", data: html });
    for (const f of attached) {
      msg.addAttachment({
        filename: sanitizeFilename(f.filename),
        contentType: f.type,
        data: toBase64(f.bytes),
      });
    }
    await env.EMAIL.send(new EmailMessage(REPORT_FROM.email, REPORT_TO, msg.asRaw()));
  } catch (err) {
    console.error("email send failed", err);
    return json(request, 502, { error: "The report could not be delivered. Please try again later." });
  }

  await env.REPORTS.put(`ratelimit/${ip}`, String(Date.now()));
  return json(request, 200, { ok: true, cooldown: COOLDOWN_SECONDS });
}

async function handleAttachment(request: Request, env: Env, path: string): Promise<Response> {
  const key = `reports/${path}`;
  if (path.includes("..") || !path) return new Response("Not found", { status: 404 });
  const obj = await env.REPORTS.get(key);
  if (!obj) return new Response("Not found", { status: 404 });
  return new Response(obj.body, {
    headers: {
      "Content-Type": obj.httpMetadata?.contentType ?? "application/octet-stream",
      "Content-Length": String(obj.size),
      "Cache-Control": "private, max-age=3600",
      "Content-Disposition": "inline",
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }
    if (request.method === "POST" && url.pathname === "/report") {
      return handleReport(request, env);
    }
    if (request.method === "GET" && url.pathname.startsWith("/attachments/")) {
      return handleAttachment(request, env, decodeURIComponent(url.pathname.slice("/attachments/".length)));
    }
    return new Response("Not found", { status: 404, headers: corsHeaders(request) });
  },
} satisfies ExportedHandler<Env>;
