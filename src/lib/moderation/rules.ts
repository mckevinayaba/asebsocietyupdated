// ASEB Society community rules and the moderation decision engine. Pure functions, no network,
// fully unit tested. The OpenAI Moderation API supplies safety classifications. These rules add
// what a general model cannot know: unsafe links, fee-for-funding patterns, impersonation of the
// Society, sensitive numbers and spam. Read docs/reports/ASEB_INTELLIGENT_COMMUNITY_MODERATION.md
// before changing a rule.
//
// Principles:
// - Criticism of institutions, policies, programmes, funders or ASEB Society is legitimate. No
//   rule looks at sentiment, and the model's general "harassment" signal only ever escalates to a
//   person, never restricts on its own.
// - RESTRICT only for clear, documented violations. ESCALATE whenever context matters.
// - Every outcome carries a reason written for the contributor, without accusation.

export type Decision = "publish" | "restrict" | "escalate";

export type ProviderResult = {
  provider: string;
  model: string;
  flagged: boolean;
  categories: Record<string, boolean>;
  scores: Record<string, number>;
};

export type RuleHit = { rule: string; outcome: Decision; detail: string };

export type Assessment = {
  decision: Decision;
  categories: string[];
  hits: RuleHit[];
  publicReason: string;
};

// Category-specific responses to the provider's own flags. The provider's flag thresholds are its
// calibrated defaults. The review bands below are initial values and MUST be calibrated against
// reviewed ASEB Society cases before they are tightened or relaxed. They only ever escalate.
export const categoryRules: Record<string, { onFlag: Decision; reviewBand?: number; reason: string }> = {
  "sexual/minors": { onFlag: "restrict", reviewBand: 0.05, reason: "It appears to contain content that is never allowed on the platform." },
  "hate/threatening": { onFlag: "restrict", reviewBand: 0.3, reason: "It appears to contain threatening or hateful language aimed at a group of people." },
  "harassment/threatening": { onFlag: "restrict", reviewBand: 0.3, reason: "It appears to contain a threat against a person." },
  "illicit/violent": { onFlag: "restrict", reason: "It appears to encourage violence." },
  sexual: { onFlag: "restrict", reviewBand: 0.4, reason: "It appears to contain explicit sexual content." },
  hate: { onFlag: "escalate", reviewBand: 0.4, reason: "A moderator is checking the language used about a group of people." },
  harassment: { onFlag: "escalate", reason: "A moderator is checking how a person is addressed. Criticism of work, institutions and policies is welcome." },
  violence: { onFlag: "escalate", reason: "A moderator is checking references to violence." },
  "violence/graphic": { onFlag: "escalate", reason: "A moderator is checking a graphic description or image." },
  illicit: { onFlag: "escalate", reason: "A moderator is checking a possible reference to illegal activity." },
  "self-harm": { onFlag: "escalate", reason: "A moderator will look at this with care." },
  "self-harm/intent": { onFlag: "escalate", reason: "A moderator will look at this with care." },
  "self-harm/instructions": { onFlag: "escalate", reason: "A moderator will look at this with care." },
};

const shorteners = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly", "rebrand.ly", "cutt.ly", "shorturl.at", "tiny.cc", "rb.gy", "s.id"];
const dangerousExtensions = /\.(exe|msi|bat|cmd|scr|com|apk|jar|vbs|ps1|dmg|pkg|iso|sh)(\?|#|$)/i;

export function extractLinks(text: string): string[] {
  const found = text.match(/\b(?:https?:\/\/|www\.)[^\s<>"')\]]+|\b(?:javascript|data|vbscript|file):[^\s<>"')\]]+/gi) ?? [];
  return [...new Set(found.map((l) => l.replace(/[.,;:!?]+$/, "")))];
}

export function assessLink(raw: string): RuleHit | null {
  if (/^(javascript|data|vbscript|file):/i.test(raw)) return { rule: "unsafe_link", outcome: "restrict", detail: "Script or local file link" };
  let url: URL;
  try { url = new URL(raw.startsWith("www.") ? `https://${raw}` : raw); } catch { return { rule: "unsafe_link", outcome: "escalate", detail: "Link could not be read" }; }
  const host = url.hostname.toLowerCase();
  if (url.username || url.password) return { rule: "unsafe_link", outcome: "restrict", detail: "Link hides credentials or a different destination" };
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(":") || host === "localhost") return { rule: "unsafe_link", outcome: "restrict", detail: "Link points to a raw network address" };
  if (dangerousExtensions.test(url.pathname)) return { rule: "unsafe_link", outcome: "restrict", detail: "Link downloads a program" };
  if (host.split(".").some((part) => part.startsWith("xn--"))) return { rule: "suspicious_link", outcome: "escalate", detail: "Internationalised domain that may imitate another site" };
  if (shorteners.includes(host.replace(/^www\./, ""))) return { rule: "suspicious_link", outcome: "escalate", detail: "Shortened link hides its destination" };
  if (url.protocol === "http:" && /(login|signin|verify|password|account|wallet|bank)/i.test(url.pathname + url.search)) return { rule: "suspicious_link", outcome: "escalate", detail: "Unencrypted link asking for account details" };
  return null;
}

// Fee-for-funding and guaranteed-return patterns, in English, French and Portuguese. Fraud cannot
// be detected reliably by patterns, so these only ever send work to a person.
const fraudPatterns: RegExp[] = [
  /\b(processing|application|registration|clearance|release|admin(istration)?)\s+fee\b/i,
  /\bpay\s+(a|the|an)?\s*(small\s+)?(fee|deposit)\s+(to|before)\s+(apply|receive|access|claim|unlock)/i,
  /\bguaranteed\s+(returns?|profit|funding|grant|loan|investment)\b/i,
  /\b(double|triple)\s+your\s+(money|investment|capital)\b/i,
  /\b\d{2,4}\s?%\s+(returns?|profit|interest)\s+(per|a|every)\s+(day|week|month)\b/i,
  /\b(frais\s+de\s+(dossier|traitement|déblocage|inscription))\b/i,
  /\brendement\s+garanti\b/i,
  /\b(doublez|triplez)\s+votre\s+(argent|investissement|capital)\b/i,
  /\btaxa\s+de\s+(inscri[cç][aã]o|processamento|libera[cç][aã]o|administra[cç][aã]o)\b/i,
  /\bretorno\s+garantido\b/i,
  /\b(duplique|triplique)\s+o\s+seu\s+(dinheiro|investimento|capital)\b/i,
  /\b(send|envoyez|envie)\b.{0,40}\b(airtime|gift\s*cards?|bitcoin|usdt|crypto|m-?pesa|mobile\s+money)\b.{0,40}\b(to\s+receive|pour\s+recevoir|para\s+receber|to\s+qualify|to\s+unlock)/i,
];
const fundingContext = /\b(grant|funding|investment|investor|loan|capital|financement|subvention|investissement|prêt|financiamento|investimento|empr[eé]stimo|subs[ií]dio)\b/i;
const offPlatformContact = /\b(whats\s?app|telegram|signal)\b.{0,60}\b(funding|grant|invest|loan|financement|financiamento)|\b(funding|grant|invest|loan|financement|financiamento)\b.{0,60}\b(whats\s?app|telegram)\b/i;

export function fraudSignals(text: string): RuleHit[] {
  const hits: RuleHit[] = [];
  for (const p of fraudPatterns) if (p.test(text)) { hits.push({ rule: "suspicious_opportunity", outcome: "escalate", detail: "Payment requested or returns guaranteed" }); break; }
  if (hits.length === 0 && fundingContext.test(text) && offPlatformContact.test(text)) hits.push({ rule: "suspicious_opportunity", outcome: "escalate", detail: "Funding offered through private messaging" });
  return hits;
}

function luhn(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0;
}

// Long identity, card and bank numbers. Phone numbers and work emails are allowed: professionals
// share them on purpose.
export function privacySignals(text: string): RuleHit[] {
  const hits: RuleHit[] = [];
  for (const m of text.match(/\b(?:\d[ -]?){13,19}\b/g) ?? []) {
    const digits = m.replace(/\D/g, "");
    if (digits.length >= 13 && luhn(digits)) { hits.push({ rule: "sensitive_personal_information", outcome: "escalate", detail: "Possible card or national identity number" }); break; }
  }
  if (/\b[A-Z]{2}\d{2}(?:\s?[A-Z0-9]{4}){3,7}\b/.test(text)) hits.push({ rule: "sensitive_personal_information", outcome: "escalate", detail: "Possible bank account number" });
  if (/\b(password|mot de passe|senha|pin)\s*[:=]\s*\S+/i.test(text)) hits.push({ rule: "sensitive_personal_information", outcome: "escalate", detail: "Possible password or PIN" });
  return hits;
}

// Speaking for the Society, or as its officials, without being staff.
export function impersonationSignals(text: string, authorIsStaff: boolean): RuleHit[] {
  if (authorIsStaff) return [];
  const claims = /\b(official|officially|on behalf of|au nom de|em nome d[aeo]|representing|représentant|representante)\b.{0,40}\bASEB\b|\bASEB\s+Society\s+(Secretariat|Board|team|management)\b|\bI\s+am\s+(the|an?)\s+.{0,30}\bof\s+ASEB\b/i;
  return claims.test(text) ? [{ rule: "impersonation", outcome: "escalate", detail: "Appears to speak for ASEB Society" }] : [];
}

export function spamSignals(text: string, links: string[]): RuleHit[] {
  const hits: RuleHit[] = [];
  if (links.length > 6) hits.push({ rule: "spam", outcome: "escalate", detail: "Many links in one contribution" });
  const letters = text.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (letters.length > 80 && letters.replace(/[^A-ZÀ-Þ]/g, "").length / letters.length > 0.7) hits.push({ rule: "spam", outcome: "escalate", detail: "Written almost entirely in capitals" });
  if (/(.)\1{14,}/.test(text)) hits.push({ rule: "spam", outcome: "escalate", detail: "Long runs of repeated characters" });
  const counts = new Map<string, number>();
  for (const l of text.match(/https?:\/\/[^\s<>"')\]]+/gi) ?? []) counts.set(l, (counts.get(l) ?? 0) + 1);
  if ([...counts.values()].some((n) => n >= 3)) hits.push({ rule: "spam", outcome: "escalate", detail: "The same link repeated" });
  return hits;
}

const ruleReasons: Record<string, string> = {
  unsafe_link: "It appears to contain a link that is not safe to open. Remove or replace the link and publish again.",
  suspicious_link: "A moderator is checking a link, because its destination is not clear.",
  suspicious_opportunity: "A moderator is checking the opportunity, because it mentions payments or guaranteed returns. Genuine opportunities are published once checked.",
  sensitive_personal_information: "A moderator is checking whether it shares personal details such as identity, card or bank numbers.",
  impersonation: "A moderator is checking a statement made on behalf of ASEB Society.",
  spam: "A moderator is checking whether it is promotional or repeated content.",
  invalid_media: "One of the attachments could not be accepted. Use a JPEG, PNG or WebP photograph you uploaded here, or a YouTube or Vimeo link.",
};

// Combine the provider's classifications with the ASEB Society rules. The most serious outcome wins:
// restrict over escalate over publish.
export function decide(input: { text: string; provider: ProviderResult | null; extraHits?: RuleHit[]; authorIsStaff?: boolean }): Assessment {
  const links = extractLinks(input.text);
  const hits: RuleHit[] = [
    ...(input.extraHits ?? []),
    ...links.map(assessLink).filter((h): h is RuleHit => h !== null),
    ...fraudSignals(input.text),
    ...privacySignals(input.text),
    ...impersonationSignals(input.text, input.authorIsStaff ?? false),
    ...spamSignals(input.text, links),
  ];
  const categories: string[] = [];
  if (input.provider) {
    for (const [category, rule] of Object.entries(categoryRules)) {
      const flagged = input.provider.categories[category] === true;
      const score = input.provider.scores[category] ?? 0;
      if (flagged) { categories.push(category); hits.push({ rule: `provider:${category}`, outcome: rule.onFlag, detail: `Flagged by ${input.provider.model}` }); }
      else if (rule.reviewBand !== undefined && score >= rule.reviewBand) { categories.push(category); hits.push({ rule: `provider:${category}`, outcome: "escalate", detail: `Score ${score.toFixed(2)} in the review band` }); }
    }
  }
  const worst: Decision = hits.some((h) => h.outcome === "restrict") ? "restrict" : hits.some((h) => h.outcome === "escalate") ? "escalate" : "publish";
  const lead = hits.find((h) => h.outcome === worst);
  const publicReason = !lead ? "" : lead.rule.startsWith("provider:") ? categoryRules[lead.rule.slice(9)]?.reason ?? "" : ruleReasons[lead.rule] ?? "";
  return { decision: worst, categories: [...new Set([...categories, ...hits.filter((h) => !h.rule.startsWith("provider:")).map((h) => h.rule)])], hits, publicReason };
}
