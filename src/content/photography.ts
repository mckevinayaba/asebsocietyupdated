// The ASEB photographic collection and where each photograph is used. One source of truth so
// photographs are chosen deliberately, not reused by accident. Read docs/reports/ASEB_VISUAL_ASSET_AUDIT.md
// before adding or reassigning a photograph. All photographs are authentic ASEB documentary
// photography, credited "Photo: ASEB Society". None is generated.
import audience2022 from "@/assets/aseb-2022-audience.jpg.asset.json";
import discussion2024 from "@/assets/aseb-2024-discussion.jpg.asset.json";
import delegates2025 from "@/assets/aseb-2025-delegates.jpg.asset.json";

export type PhotoKey =
  | "gathering" | "networking" | "summitPanel" | "addisPanel" | "recognised" | "delegates2026"
  | "nairobi2023" | "accraGroup2024" | "stage1" | "stage2" | "stage3" | "audience2022" | "discussion2024" | "delegates2025";

export type PhotoRecord = { src: string; alt: string; subject: string; year: string | null; city: string | null; width: number | null; note: string };

export const photos: Record<PhotoKey, PhotoRecord> = {
  gathering: { src: "images/events/aseb-community-gathering.jpg", alt: "Practitioners listening intently at an ASEB gathering", subject: "Audience of practitioners in an atrium session", year: null, city: null, width: 1248, note: "Home page opening. Strong depth, crops well to portrait." },
  networking: { src: "images/events/aseb-networking.jpg", alt: "Ecosystem builders in conversation between ASEB sessions", subject: "Four practitioners in conversation", year: null, city: null, width: 1248, note: "Peer conversation. The ASEB Circles photograph." },
  summitPanel: { src: "images/events/aseb-summit-panel.jpg", alt: "A practitioner panel on inclusive entrepreneurship on the ASEB Summit stage", subject: "Panel on stage, Summit banner visible", year: null, city: null, width: 1600, note: "Policy and research dialogue. The ASEB Field Lab photograph." },
  addisPanel: { src: "images/events/aseb-2025-addis-panel.jpg", alt: "Speakers sharing knowledge on a panel at ASEB 2025 in Addis Ababa", subject: "Panel discussion", year: "2025", city: "Addis Ababa", width: 1344, note: "Knowledge exchange. The ASEB Academy photograph." },
  recognised: { src: "images/events/aseb-2026-recognised-builders.jpg", alt: "Recognised practitioners and institutions holding their awards at ASEB 2026 in Johannesburg", subject: "Awards recipients group", year: "2026", city: "Johannesburg", width: 1600, note: "Recognition. The ASEB Summit & Awards photograph." },
  delegates2026: { src: "images/events/aseb-2026-summit-delegates.jpg", alt: "ASEB Summit delegates gathered in Johannesburg in October 2026", subject: "Delegates group photograph", year: "2026", city: "Johannesburg", width: 1536, note: "Our Story opening." },
  nairobi2023: { src: "images/events/aseb-2023-nairobi.jpg", alt: "Ecosystem builders celebrating together at ASEB 2023 in Nairobi", subject: "Celebration", year: "2023", city: "Nairobi", width: 1344, note: "Human purpose. Invest opening and the 2023 edition." },
  accraGroup2024: { src: "images/events/aseb-2024-accra-group.jpg", alt: "Recognised ecosystem builders together at the ASEB Summit 2024 in Accra", subject: "Builders group", year: "2024", city: "Accra", width: 1344, note: "The people behind entrepreneurship. Home page question section." },
  stage1: { src: "images/events/aseb-awards-stage-1.jpg", alt: "A recognised builder addressing the room at the ASEB Awards", subject: "Awards stage", year: null, city: null, width: 518, note: "Low resolution. Small placements only." },
  stage2: { src: "images/events/aseb-awards-stage-2.jpg", alt: "Two builders embrace on the ASEB Awards stage", subject: "Awards stage", year: null, city: null, width: 465, note: "Low resolution. Small placements only." },
  stage3: { src: "images/events/aseb-awards-stage-3.jpg", alt: "A recognition plaque presented at the ASEB Awards", subject: "Awards stage", year: null, city: null, width: 378, note: "Low resolution. Small placements only." },
  audience2022: { src: audience2022.url, alt: "Participants listening at the first ASEB Summit and Awards in Johannesburg, 2022", subject: "Audience", year: "2022", city: "Johannesburg", width: null, note: "Stored in Lovable's asset store. The 2022 edition." },
  discussion2024: { src: discussion2024.url, alt: "Speakers in discussion at the ASEB Summit 2024 in Accra", subject: "Discussion", year: "2024", city: "Accra", width: null, note: "Stored in Lovable's asset store. The 2024 edition." },
  delegates2025: { src: delegates2025.url, alt: "Delegates gathered on stage at ASEB 2025 in Addis Ababa", subject: "Delegates on stage", year: "2025", city: "Addis Ababa", width: null, note: "Stored in Lovable's asset store. The 2025 edition." },
};

// Page and section assignments. Rules, enforced by src/test/photography.test.ts:
// a photograph never repeats within a page, and no two pages share an opening photograph.
export const assignments = {
  home: { hero: "gathering", question: "accraGroup2024" },
  pillars: { summit: "recognised", circles: "networking", academy: "addisPanel", "field-lab": "summitPanel" },
  story: { hero: "delegates2026", transition: "stage1", editions: { "2022": "audience2022", "2023": "nairobi2023", "2024": "discussion2024", "2025": "delegates2025", "2026": "recognised" } },
  invest: { hero: "nairobi2023" },
  summit: { hero: "recognised", gallery: ["delegates2026", "stage1", "stage2", "summitPanel", "stage3"] },
  whyAseb: { informal: "delegates2025" },
  getInvolved: { closing: "discussion2024" },
} as const satisfies Record<string, unknown>;

export const pillarPhoto = (key: keyof typeof assignments.pillars) => photos[assignments.pillars[key]];
export const photo = (key: PhotoKey) => photos[key];
