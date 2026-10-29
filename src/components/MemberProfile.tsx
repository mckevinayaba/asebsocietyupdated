import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { africanCountries } from "@/content/countries";
import { roles } from "@/content/field";
import { memberProfileSchema, saveMemberProfile } from "@/lib/member.functions";

type Profile = { name: string; country: string; organisation: string; primary_role: string; bio: string };
export function MemberProfile({ profile, close }: { profile: Profile | null; close: () => void }) {
  const [form, setForm] = useState(profile || { name: "", country: "", organisation: "", primary_role: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const save = useServerFn(saveMemberProfile);
  const client = useQueryClient();
  const update = (key: keyof Profile, value: string) => setForm((previous) => ({ ...previous, [key]: value }));
  return <section><p className="text-sm font-semibold uppercase text-umber">Your account</p><h1 className="mt-3 font-display text-[2rem]">Your member profile.</h1><form className="mt-8 grid gap-6" onSubmit={async (event) => { event.preventDefault(); if (saving) return; setError(""); const parsed = memberProfileSchema.safeParse(form); if (!parsed.success) { setError(parsed.error.issues[0]?.message || "Check your details."); return; } setSaving(true); try { await save({ data: parsed.data }); await client.invalidateQueries({ queryKey: ["member-data"] }); close(); } catch { setError("Your profile could not be saved. Please try again."); } finally { setSaving(false); } }}>
    <label><span className="field-label">Full name</span><input required minLength={2} maxLength={200} className="field-input" autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} /></label>
    <label><span className="field-label">Country</span><select required className="field-input" value={form.country} onChange={(event) => update("country", event.target.value)}><option value="">Select a country</option>{africanCountries.map((country) => <option key={country}>{country}</option>)}<option>Diaspora, outside Africa</option></select></label>
    <label><span className="field-label">Primary role</span><select required className="field-input" value={form.primary_role} onChange={(event) => update("primary_role", event.target.value)}><option value="">Select a role</option>{roles.map((role) => <option key={role.slug} value={role.slug}>{role.role}</option>)}</select></label>
    <label><span className="field-label">Organisation (optional)</span><input maxLength={200} autoComplete="organization" className="field-input" value={form.organisation} onChange={(event) => update("organisation", event.target.value)} /></label>
    <label><span className="field-label">Bio (optional)</span><textarea maxLength={3000} rows={5} className="field-input py-3" value={form.bio} onChange={(event) => update("bio", event.target.value)} /></label>
    {error && <p role="alert" className="text-sm text-ember">{error}</p>}
    <div className="flex flex-wrap justify-between gap-4"><Button variant="ghost" disabled={saving} onClick={close}>← Back</Button><Button type="submit" className="btn btn-primary h-auto" disabled={saving}>{saving ? "Saving…" : "Save profile"} →</Button></div>
  </form></section>;
}