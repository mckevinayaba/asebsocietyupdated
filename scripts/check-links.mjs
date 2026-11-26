// Crawls a deployed ASEB site and reports broken internal links, broken images and failing external links.
// Usage: BASE=https://www.asebsociety.org node scripts/check-links.mjs
// Optional: EXTERNAL=0 to skip external links, MAX=400 to cap the number of pages.
// It only sends GET and HEAD requests, so it is safe to run against production.
const BASE = (process.env.BASE || "http://127.0.0.1:5173").replace(/\/$/, "");
const MAX = Number(process.env.MAX || 400);
const CHECK_EXTERNAL = process.env.EXTERNAL !== "0";
const origin = new URL(BASE).origin;

const seen = new Set();
const queue = ["/"];
const broken = [];
const external = new Map();
const images = new Map();

const attr = (html, tag, name) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*\\s${name}="([^"]*)"`, "gi"))].map((m) => m[1].replace(/&amp;/g, "&"));

async function status(url, method = "HEAD") {
  try {
    const res = await fetch(url, { method, redirect: "follow", headers: { "user-agent": "ASEB link check" }, signal: AbortSignal.timeout(15000) });
    if ((res.status === 405 || res.status === 403) && method === "HEAD") return status(url, "GET");
    return res.status;
  } catch (error) {
    return `error: ${error.cause?.code || error.name}`;
  }
}

while (queue.length && seen.size < MAX) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  const res = await fetch(BASE + path, { redirect: "follow" }).catch(() => null);
  if (!res || res.status >= 400) { broken.push({ from: "(crawl)", to: path, status: res?.status ?? "unreachable" }); continue; }
  if (!(res.headers.get("content-type") || "").includes("text/html")) continue;
  const html = await res.text();
  for (const href of attr(html, "a", "href")) {
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href === "#") { broken.push({ from: path, to: "#", status: "empty link" }); continue; }
    if (href.startsWith("#")) continue;
    const url = new URL(href, BASE + path);
    if (url.origin === origin) {
      const next = url.pathname + url.search;
      if (!seen.has(next) && !queue.includes(next)) queue.push(next);
    } else if (/^https?:$/.test(url.protocol)) {
      if (!external.has(url.href)) external.set(url.href, path);
    }
  }
  for (const src of attr(html, "img", "src")) if (!src.startsWith("data:")) { const u = new URL(src, BASE + path).href; if (!images.has(u)) images.set(u, path); }
}

for (const [url, from] of images) { const s = await status(url); if (s !== 200) broken.push({ from, to: url, status: `image ${s}` }); }
const externalFailures = [];
if (CHECK_EXTERNAL) for (const [url, from] of external) { const s = await status(url); if (typeof s !== "number" || s >= 400) externalFailures.push({ from, to: url, status: s }); }

console.log(`Crawled ${seen.size} pages on ${BASE}. ${images.size} images, ${external.size} external links.`);
for (const b of broken) console.log(`BROKEN  ${b.status}  ${b.from} -> ${b.to}`);
for (const e of externalFailures) console.log(`EXTERNAL ${e.status}  ${e.from} -> ${e.to}`);
console.log(broken.length || externalFailures.length ? `${broken.length} broken, ${externalFailures.length} external to review.` : "No broken links found.");
process.exit(broken.length ? 1 : 0);
