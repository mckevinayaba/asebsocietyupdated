import { useEffect, useState } from "react";

// Direction changes need a deliberate scroll, rather than responding to every pixel.
export function useMobileChrome(pathname: string) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    setHidden(false);
    let anchor = window.scrollY;
    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      if (y < 120) { setHidden(false); anchor = y; return; }
      if (Math.abs(y - anchor) < 16) return;
      setHidden(y > anchor);
      anchor = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);
  return hidden;
}