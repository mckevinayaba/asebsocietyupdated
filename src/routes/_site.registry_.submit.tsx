import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@/lib/router";
import { roles } from "@/content/field";
import { africanCountries } from "@/content/countries";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { registrySubmissionSchema } from "@/lib/intake";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_site/registry_/submit")({
  head: () => ({ meta: [
    { title: "Propose a registry record | ASEB Society" },
    { name: "description", content: "Submit your ecosystem-building work and a public source for review in the ASEB Field Registry." },
    { property: "og:title", content: "Propose a registry record | ASEB Society" },
    { property: "og:description", content: "Submit your ecosystem-building work and a public source for Secretariat review." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: RegistrySubmission,
});

function RegistrySubmission() {
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", record_type: "organisation" as "individual" | "organisation", country: "", role: "", bio: "", source_url: "", contact_name: "", contact_email: "" });
  const update = (key: keyof typeof form, value: string) => setForm((previous) => ({ ...previous, [key]: value }));
  if (submitted) return <section className="section"><div className="wrap max-w-3xl"><p className="eyebrow">Submission received</p><h1 className="mt-6 text-display-md">Your work is ready for review.</h1><p className="lede mt-6">Your proposed record has been saved for Secretariat review. It will not appear in the public Registry until approved.</p><Link className="tlink mt-8" to="/registry">Back to the Field Registry →</Link></div></section>;
  return <><PageHero eyebrow="The Field Registry" title="Propose a registry record." lede="Share your ecosystem-building work and a public source. New records are reviewed before publication." /><section className="section-tight"><div className="wrap max-w-3xl"><form className="grid gap-6 sm:grid-cols-2" onSubmit={async (event) => {
    event.preventDefault();
    if (saving) return;
    setError("");
    const parsed = registrySubmissionSchema.safeParse(form);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message || "Check your details."); return; }
    setSaving(true);
    try {
      const { error: saveError } = await supabase.from("registry_submissions").insert(parsed.data);
      if (saveError) setError("Your proposed record could not be saved. Please try again.");
      else setSubmitted(true);
    } catch { setError("Please check your connection and try again."); }
    finally { setSaving(false); }
  }}>
    <label className="sm:col-span-2"><span className="field-label">Practitioner or institution name</span><input required minLength={2} maxLength={200} className="field-input" value={form.name} onChange={(event) => update("name", event.target.value)} /></label>
    <label><span className="field-label">Record type</span><select className="field-input" value={form.record_type} onChange={(event) => update("record_type", event.target.value)}><option value="organisation">Institution</option><option value="individual">Practitioner</option></select></label>
    <label><span className="field-label">Country</span><select required className="field-input" value={form.country} onChange={(event) => update("country", event.target.value)}><option value="">Select a country</option>{africanCountries.map((country) => <option key={country}>{country}</option>)}<option>Diaspora, outside Africa</option></select></label>
    <label className="sm:col-span-2"><span className="field-label">Primary role</span><select required className="field-input" value={form.role} onChange={(event) => update("role", event.target.value)}><option value="">Select a role</option>{roles.map((role) => <option key={role.slug} value={role.slug}>{role.role}</option>)}</select></label>
    <label className="sm:col-span-2"><span className="field-label">Your ecosystem-building work</span><textarea required minLength={20} maxLength={3000} rows={5} className="field-input py-3" value={form.bio} onChange={(event) => update("bio", event.target.value)} /></label>
    <label className="sm:col-span-2"><span className="field-label">Public source URL</span><input required type="url" maxLength={1000} className="field-input" placeholder="https://" value={form.source_url} onChange={(event) => update("source_url", event.target.value)} /></label>
    <label><span className="field-label">Contact name</span><input required minLength={2} maxLength={200} autoComplete="name" className="field-input" value={form.contact_name} onChange={(event) => update("contact_name", event.target.value)} /></label>
    <label><span className="field-label">Contact email</span><input required type="email" maxLength={255} autoComplete="email" className="field-input" value={form.contact_email} onChange={(event) => update("contact_email", event.target.value)} /></label>
    <p className="text-sm text-stone sm:col-span-2">Contact details are private and used to review this submission.</p>
    {error && <p role="alert" className="text-sm text-ember sm:col-span-2">{error}</p>}
    <div className="flex flex-wrap items-center justify-between gap-6 border-t border-hairline pt-6 sm:col-span-2"><Link to="/registry" className="tlink">← Registry</Link><Button className="btn btn-primary h-auto" disabled={saving} type="submit">{saving ? "Saving…" : "Submit for review"} →</Button></div>
  </form></div></section></>;
}