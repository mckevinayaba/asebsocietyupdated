// Saved items, kept on this device only. Honest by design: the interface says "saved on this
// device" until member bookmarks have a database table. Storage can be unavailable (private
// windows, blocked site data), so every access is guarded.
import { useCallback, useEffect, useState } from "react";

export type SavedItem = { key: string; title: string; to: string; kind: string; savedAt: string };
const STORAGE_KEY = "aseb-saved-v1";
const EVENT = "aseb-saved-change";

function read(): SavedItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is SavedItem => !!item && typeof item === "object" && typeof (item as SavedItem).key === "string" && typeof (item as SavedItem).to === "string" && (item as SavedItem).to.startsWith("/")).slice(0, 200) : [];
  } catch {
    return [];
  }
}

function write(items: SavedItem[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 200)));
    window.dispatchEvent(new Event(EVENT));
    return true;
  } catch {
    return false;
  }
}

export function useSaved() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [available, setAvailable] = useState(true);
  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    try { window.localStorage.getItem(STORAGE_KEY); } catch { setAvailable(false); }
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  const isSaved = useCallback((key: string) => items.some((item) => item.key === key), [items]);
  const toggle = useCallback((item: Omit<SavedItem, "savedAt">) => {
    const current = read();
    const next = current.some((saved) => saved.key === item.key) ? current.filter((saved) => saved.key !== item.key) : [{ ...item, savedAt: new Date().toISOString() }, ...current];
    if (!write(next)) setAvailable(false);
  }, []);
  return { items, isSaved, toggle, available };
}
