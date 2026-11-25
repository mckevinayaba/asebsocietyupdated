// One navigation model for every surface: desktop menus, the mobile application bar, the
// persistent bottom navigation, contextual tabs and site search. Browser safe, no React.

export type NavLinkItem = { label: string; to: string; note?: string };
export type NavGroup = { label: string; to: string; items: NavLinkItem[] };

export const investPath = "/invest";

export const desktopNav: NavGroup[] = [
  { label: "About", to: "/why-aseb", items: [
    { label: "Why We Exist", to: "/why-aseb", note: "The economic case for ecosystem builders" },
    { label: "Our Story", to: "/about/story", note: "Five Summit editions, one institution" },
    { label: "Leadership", to: "/people", note: "Founder, executive team and Board" },
    { label: "Governance", to: "/governance", note: "Oversight, integrity and stewardship" },
    { label: "Progress", to: "/progress", note: "What is operational and what is in development" },
  ] },
  { label: "Our Work", to: "/what-we-build", items: [
    { label: "ASEB Summit & Awards", to: "/summit", note: "The continental convening" },
    { label: "ASEB Circles", to: "/communities", note: "Peer communities and working groups" },
    { label: "ASEB Academy", to: "/learning", note: "Professional learning and practice standards" },
    { label: "ASEB Field Lab", to: "/field-lab", note: "Applied research and policy intelligence" },
    { label: "How the mandates connect", to: "/what-we-build", note: "Four mandates, one practice" },
    { label: "The Framework", to: "/framework", note: "Seven conditions entrepreneurs need" },
  ] },
  { label: "Explore", to: "/registry", items: [
    { label: "Practitioners", to: "/registry?type=individual", note: "People recognised in the Field Registry" },
    { label: "Institutions", to: "/registry?type=organisation", note: "Support organisations in the archive" },
    { label: "Countries", to: "/countries", note: "All 54 African states and representation" },
    { label: "Country Partners", to: "/country-partners", note: "Locally rooted institutional representation" },
    { label: "Ambassadors", to: "/ambassadors", note: "Individual advocacy mandates" },
    { label: "Roles in the field", to: "/field", note: "Find the work you do" },
  ] },
  { label: "The Village", to: "/the-field", items: [
    { label: "The Field", to: "/the-field", note: "Africa's ecosystem building community" },
    { label: "ASEB Voices", to: "/voices", note: "Every ecosystem has a story" },
    { label: "Ask the Village", to: "/ask", note: "No one has all the answers" },
    { label: "The Playbook", to: "/playbook", note: "A book Africa writes together" },
    { label: "State of the Field", to: "/state-of-the-field", note: "Evidence and ecosystem intelligence" },
    { label: "Discover", to: "/discover", note: "Learning, opportunities and events" },
    { label: "Evidence Library", to: "/evidence", note: "Research summarised for practice" },
  ] },
  { label: "Get Involved", to: "/get-involved", items: [
    { label: "Become a member", to: "/join", note: "Apply as a practitioner or organisation" },
    { label: "Institutional partnerships", to: "/partners", note: "Strategic and knowledge partnership" },
    { label: "Programme collaboration", to: "/collaborate", note: "Propose work with agreed outcomes" },
    { label: "Commission work", to: "/work-with-us", note: "Research, convening and delivery" },
    { label: "Every way to take part", to: "/get-involved", note: "Contribute where you are" },
  ] },
];

export type TabKey = "home" | "explore" | "circles" | "discover" | "you";
export type PrimaryTab = { key: TabKey; label: string; to: string; memberTo?: string; prefixes: string[] };

// Bottom navigation. Prefix order matters: the first tab whose prefix matches wins.
export const primaryTabs: PrimaryTab[] = [
  { key: "home", label: "Home", to: "/", memberTo: "/the-field", prefixes: ["/the-field", "/contribute", "/members", "/onboarding", "/community-guidelines", "/why-aseb", "/about", "/people", "/governance", "/progress", "/invest", "/funders", "/what-we-build", "/summit", "/learning", "/field-lab", "/partners", "/collaborate", "/work-with-us", "/get-involved", "/join", "/sdgs"] },
  { key: "explore", label: "Explore", to: "/registry", prefixes: ["/registry", "/countries", "/country-partners", "/ambassadors", "/field"] },
  { key: "circles", label: "Circles", to: "/communities", prefixes: ["/communities"] },
  { key: "discover", label: "Discover", to: "/discover", prefixes: ["/discover", "/playbook", "/voices", "/ask", "/state-of-the-field", "/stories", "/evidence", "/insights", "/framework", "/climate"] },
  { key: "you", label: "You", to: "/you", prefixes: ["/you", "/app", "/auth", "/secretariat", "/reset-password"] },
];

export function activeTab(pathname: string): TabKey {
  if (pathname === "/") return "home";
  const match = primaryTabs.find((tab) => tab.prefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/")));
  return match?.key ?? "home";
}

export type ContextTabSet = { id: string; label: string; prefixes: string[]; tabs: NavLinkItem[] };

// Contextual tabs only point at implemented destinations.
export const contextTabSets: ContextTabSet[] = [
  { id: "about", label: "About", prefixes: ["/why-aseb", "/about", "/people", "/governance", "/progress"], tabs: desktopNav[0]!.items },
  { id: "work", label: "Our Work", prefixes: ["/summit", "/communities", "/learning", "/field-lab", "/what-we-build"], tabs: [
    { label: "Summit & Awards", to: "/summit" }, { label: "Circles", to: "/communities" }, { label: "Academy", to: "/learning" }, { label: "Field Lab", to: "/field-lab" }, { label: "How they connect", to: "/what-we-build" },
  ] },
  { id: "explore", label: "Explore", prefixes: ["/registry", "/countries", "/country-partners", "/ambassadors", "/field"], tabs: [
    { label: "Field Registry", to: "/registry" }, { label: "People", to: "/registry?type=individual" }, { label: "Institutions", to: "/registry?type=organisation" }, { label: "Countries", to: "/countries" }, { label: "Country Partners", to: "/country-partners" }, { label: "Ambassadors", to: "/ambassadors" }, { label: "Roles", to: "/field" },
  ] },
  { id: "discover", label: "Discover", prefixes: ["/discover", "/playbook", "/voices", "/ask", "/state-of-the-field", "/evidence", "/insights", "/framework", "/climate"], tabs: [
    { label: "Discover", to: "/discover" }, { label: "The Playbook", to: "/playbook" }, { label: "ASEB Voices", to: "/voices" }, { label: "Ask the Village", to: "/ask" }, { label: "State of the Field", to: "/state-of-the-field" }, { label: "Academy", to: "/learning" }, { label: "Opportunities", to: "/the-field?tab=opportunities" }, { label: "Events", to: "/discover?type=event" },
  ] },
  { id: "you", label: "You", prefixes: ["/you"], tabs: [
    { label: "Overview", to: "/you" }, { label: "Profile", to: "/you?tab=profile" }, { label: "My contributions", to: "/you?tab=contributions" }, { label: "Saved", to: "/you?tab=saved" }, { label: "Following", to: "/you?tab=following" }, { label: "Membership", to: "/you?tab=membership" }, { label: "Settings", to: "/you?tab=settings" },
  ] },
  { id: "involved", label: "Get Involved", prefixes: ["/join", "/get-involved", "/partners", "/collaborate", "/work-with-us", "/invest", "/funders"], tabs: [
    { label: "Invest", to: investPath }, { label: "Membership", to: "/join" }, { label: "Partnerships", to: "/partners" }, { label: "Collaborate", to: "/collaborate" }, { label: "Commission", to: "/work-with-us" }, { label: "All routes", to: "/get-involved" },
  ] },
];

export function contextTabsFor(pathname: string): ContextTabSet | undefined {
  return contextTabSets.find((set) => set.prefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/")));
}

// A tab is current when its path matches and every query value it names matches too.
export function isTabCurrent(tab: NavLinkItem, pathname: string, search: string, siblings: NavLinkItem[]): boolean {
  const [path, query] = tab.to.split("?");
  if (path !== pathname && !(path !== "/" && pathname.startsWith(path + "/"))) return false;
  const want = new URLSearchParams(query ?? "");
  const have = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  if ([...want.keys()].length) return [...want.entries()].every(([key, value]) => have.get(key) === value);
  // A bare path is current only when no sibling with the same path and a matching query is current.
  return !siblings.some((other) => other !== tab && other.to.startsWith(path + "?") && isTabCurrent(other, pathname, search, []));
}

// Safe post-sign-in destinations: same-origin paths only.
export function safeRedirect(value: unknown, fallback = "/app"): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\") || /[\r\n]/.test(value)) return fallback;
  if (value.startsWith("/auth")) return fallback;
  return value.slice(0, 500);
}
