import { useEffect } from "react";

// Registers the service worker in production only, and never inside an embedded preview frame,
// so the Lovable editor preview always shows the latest build.
export function ServiceWorker() {
  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
    let embedded = true;
    try { embedded = window.self !== window.top; } catch { embedded = true; }
    if (embedded) return;
    const register = () => { navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined); };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);
  return null;
}
