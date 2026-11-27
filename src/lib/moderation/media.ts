// Attachment checks for automated publishing. Photographs must be files this author uploaded to
// their own private folder, of a real JPEG, PNG or WebP type (checked from the bytes, not the name),
// and within the size limit. Video links must come from an allowed provider and are reduced to a
// canonical address. The server never fetches a contributor's links, so it cannot be steered into
// requests on someone else's behalf. A valid video link is not a moderated video: the video itself
// is not inspected.
import type { RuleHit } from "./rules";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function sniffImageType(bytes: Uint8Array): "image/jpeg" | "image/png" | "image/webp" | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((b, i) => bytes[i] === b)) return "image/png";
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "image/webp";
  return null;
}

export function ownsPath(path: string, userId: string): boolean {
  return /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(path) && path.startsWith(`${userId}/`);
}

export function canonicalVideo(raw: string): { provider: "youtube" | "vimeo"; url: string } | null {
  let url: URL;
  try { url = new URL(raw.trim()); } catch { return null; }
  if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
  const host = url.hostname.replace(/^(www\.|m\.)/, "");
  let id: string | null = null;
  if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0] ?? null;
  else if (host === "youtube.com") id = url.searchParams.get("v") ?? (url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1] ?? null);
  if (id) return /^[A-Za-z0-9_-]{11}$/.test(id) ? { provider: "youtube", url: `https://www.youtube.com/watch?v=${id}` } : null;
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const vid = url.pathname.match(/(?:^\/|\/video\/)(\d{6,12})(?:$|\/)/)?.[1];
    return vid ? { provider: "vimeo", url: `https://vimeo.com/${vid}` } : null;
  }
  return null;
}

export type StoredImage = { size: number; head: Uint8Array } | null;

// Checks every attachment and returns rule hits for anything that cannot be accepted.
export async function checkMedia(media: { kind: string; path?: string; url?: string }[], authorId: string, readImage: (path: string) => Promise<StoredImage>): Promise<{ hits: RuleHit[]; imagePaths: string[] }> {
  const hits: RuleHit[] = [];
  const imagePaths: string[] = [];
  for (const item of media) {
    if (item.kind === "image") {
      if (!item.path || !ownsPath(item.path, authorId)) { hits.push({ rule: "invalid_media", outcome: "restrict", detail: "Photograph is not in the author's own folder" }); continue; }
      const stored = await readImage(item.path);
      if (!stored) { hits.push({ rule: "invalid_media", outcome: "restrict", detail: "Photograph could not be found" }); continue; }
      if (stored.size > MAX_IMAGE_BYTES) { hits.push({ rule: "invalid_media", outcome: "restrict", detail: "Photograph is larger than 5 MB" }); continue; }
      if (!sniffImageType(stored.head)) { hits.push({ rule: "invalid_media", outcome: "restrict", detail: "File is not a JPEG, PNG or WebP image" }); continue; }
      imagePaths.push(item.path);
    } else if (item.kind === "video_link") {
      if (!item.url || !canonicalVideo(item.url)) hits.push({ rule: "invalid_media", outcome: "restrict", detail: "Video link is not a YouTube or Vimeo address" });
    } else {
      hits.push({ rule: "invalid_media", outcome: "restrict", detail: "Unsupported attachment" });
    }
  }
  return { hits, imagePaths };
}
