import { africanCountries } from "@/content/countries";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "url" | "select" | "textarea" | "country" | "choice";
  options?: string[];
  required?: boolean;
  full?: boolean;
  hint?: string;
};

export const enquirySources = {
  "/country-partners": "country_partner_eoi",
  "/ambassadors": "ambassador_eoi",
  "/collaborate": "collaboration_eoi",
  "/funders": "partner_enquiries",
  "/work-with-us": "partner_enquiries",
} as const;
export type EnquirySource = keyof typeof enquirySources;

export function fieldError(field: Field, raw = ""): string | undefined {
  const value = raw.trim();
  if (!value) return field.required ? "This field is required." : undefined;
  if (value.length > 6000) return "Use no more than 6,000 characters.";
  if (field.type === "email" && (value.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) return "Enter a valid email address.";
  if (field.type === "url") {
    try {
      const url = new URL(value);
      if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".")) return "Enter a full http or https website address.";
    } catch { return "Enter a full http or https website address."; }
  }
  const options = field.type === "country" ? [...africanCountries, "Diaspora, outside Africa"] : field.options;
  if (options && !options.includes(value)) return "Select one of the available options.";
  if (field.hint?.includes("300 words") || field.label.includes("300 words")) {
    if (value.split(/\s+/).length > 300) return "Use no more than 300 words.";
  }
  return undefined;
}

export function prepareEnquiry(source: EnquirySource, fields: Field[], values: Record<string, string>, consent: boolean) {
  if (!consent || fields.some((field) => fieldError(field, values[field.name]))) throw new Error("Complete the required fields and declaration.");
  const payload = Object.fromEntries(fields.map((field) => [field.name, (values[field.name] || "").trim()]));
  if (new TextEncoder().encode(JSON.stringify(payload)).length > 40000) throw new Error("Please shorten your enquiry before submitting.");
  return { inquiry_type: enquirySources[source], source_page: source, contact_email: payload.email || "", payload, consent: true, status: "pending" as const };
}