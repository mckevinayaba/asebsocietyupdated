// Original ASEB line icons, drawn on a 24px grid with a single 1.6 stroke.
// Used only for application navigation and contextual actions, always beside a text label
// or an accessible name. No third-party icon set is used.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { filled?: boolean };

function Frame({ children, ...props }: IconProps) {
  const { filled: _filled, ...rest } = props;
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>
      {children}
    </svg>
  );
}

// Home: a threshold, the room the field gathers in.
export const HomeIcon = (p: IconProps) => <Frame {...p}><path d="M4 20V10.5L12 4l8 6.5V20" /><path d="M9.5 20v-5.5a2.5 2.5 0 0 1 5 0V20" fill={p.filled ? "currentColor" : "none"} /></Frame>;
// Explore: a meridian across the continent.
export const ExploreIcon = (p: IconProps) => <Frame {...p}><circle cx="12" cy="12" r="8" /><path d="M12 4c2.4 2.3 3.6 5 3.6 8s-1.2 5.7-3.6 8c-2.4-2.3-3.6-5-3.6-8s1.2-5.7 3.6-8Z" fill={p.filled ? "currentColor" : "none"} fillOpacity={0.18} /><path d="M4.5 12h15" /></Frame>;
// Circles: peers overlapping.
export const CirclesIcon = (p: IconProps) => <Frame {...p}><circle cx="9" cy="12" r="5.5" /><circle cx="15" cy="12" r="5.5" fill={p.filled ? "currentColor" : "none"} fillOpacity={0.18} /></Frame>;
// Discover: an open folio.
export const DiscoverIcon = (p: IconProps) => <Frame {...p}><path d="M12 6.5C10 5 7 4.6 4 5v13c3-.4 6 0 8 1.5 2-1.5 5-1.9 8-1.5V5c-3-.4-6 0-8 1.5Z" fill={p.filled ? "currentColor" : "none"} fillOpacity={0.18} /><path d="M12 6.5v13" /></Frame>;
// You: a person within the field.
export const YouIcon = (p: IconProps) => <Frame {...p}><circle cx="12" cy="8.5" r="3.5" fill={p.filled ? "currentColor" : "none"} fillOpacity={0.18} /><path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" /></Frame>;

export const SearchIcon = (p: IconProps) => <Frame {...p}><circle cx="11" cy="11" r="6" /><path d="m20 20-4.6-4.6" /></Frame>;
export const MenuIcon = (p: IconProps) => <Frame {...p}><path d="M4 8h16M4 16h10" /></Frame>;
export const CloseIcon = (p: IconProps) => <Frame {...p}><path d="M6 6l12 12M18 6 6 18" /></Frame>;
export const SaveIcon = (p: IconProps) => <Frame {...p}><path d="M7 4h10v16l-5-3.6L7 20V4Z" fill={p.filled ? "currentColor" : "none"} /></Frame>;
export const ShareIcon = (p: IconProps) => <Frame {...p}><path d="M12 4v11" /><path d="m7.5 8.5 4.5-4.5 4.5 4.5" /><path d="M5 13v6h14v-6" /></Frame>;
export const InfoIcon = (p: IconProps) => <Frame {...p}><circle cx="12" cy="12" r="8" /><path d="M12 11v5" /><path d="M12 8h.01" /></Frame>;
export const RelatedIcon = (p: IconProps) => <Frame {...p}><path d="M9 6H5v13h13v-4" /><path d="M13 5h6v6" /><path d="M19 5l-8 8" /></Frame>;
