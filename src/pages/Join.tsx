import { useMemo, useState } from "react";
import { Link, useSearchParams } from "@/lib/router";
import { constituencies, roles, roleBySlug, type ConstituencySlug } from "@/content/field";
import { africanCountries } from "@/content/countries";
import { supabase } from "@/integrations/supabase/client";
import { applicationSchema } from "@/lib/intake";
import { recordBySlug } from "@/content/registry";
import { Button } from "@/components/ui/button";

// Applications are private Cloud intake rows; submission does not confer membership.

type Form = { role: string; type: "individual" | "organisation"; name: string; email: string; country: string; organisation: string; linkedin: string; code: boolean };

const code = [
  "I put the interests of founders and the ecosystem ahead of my own visibility.",
  "I represent my work, its outcomes and its sources honestly.",
  "I credit the people and institutions whose work I build on.",
  "I share what I learn, so that others in the field do not start from nothing.",
  "I treat founders, peers and communities with care, and I protect what they share in confidence.",
];

const steps = ["Your role", "About you", "Code of Practice", "Confirmation"];

export default function Join() {
  const [params] = useSearchParams();
  const preRole = roleBySlug(params.get("role") || "");
  const intent = params.get("intent");
  const claimRecord = recordBySlug(params.get("record") || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState<ConstituencySlug>(preRole?.constituency || "practitioners");
  const [f, setF] = useState<Form>({
    role: preRole?.slug || "",
    type: params.get("type") === "organisation" ? "organisation" : "individual",
    name: "", email: "", country: "", organisation: "", linkedin: "", code: false,
  });
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));
  const role = roleBySlug(f.role);
  const tabRoles = useMemo(() => roles.filter((r) => r.constituency === tab), [tab]);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email);
  const canNext = step === 0 ? !!f.role : step === 1 ? f.name.trim().length > 1 && emailOk && !!f.country : step === 2 ? f.code : true;

  const next = async () => {
    if (!canNext || saving) return;
    setError("");
    if (step === 2) {
      const validated = applicationSchema.safeParse(f);
      if (!validated.success) { setError(validated.error.issues[0]?.message || "Check your details."); return; }
      setSaving(true);
      try {
        const applicationIntent = intent === "partner" || intent === "nominate" || intent === "steward" || intent === "claim" ? intent : "member";
        const { error: saveError } = await supabase.from("membership_applications").insert({ name: validated.data.name, email: validated.data.email, country: f.country, role: f.role, membership_type: f.type, organisation: validated.data.organisation, profile_url: validated.data.linkedin, code_accepted: true, intent: applicationIntent, registry_slug: claimRecord?.slug || null });
        if (saveError) { setError("Your application could not be saved. Please try again."); return; }
      } catch { setError("Your application could not be saved. Please check your connection and try again."); return; }
      finally { setSaving(false); }
    }
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0 });
  };

  const intro =
    intent === "claim" && claimRecord ? `Request to claim ${claimRecord.name}. The Secretariat will review your relationship to this record before linking it to an account.`
    : intent === "partner" ? "Start a partner conversation. Tell us your role in the field first, so we can route you to the right team."
    : intent === "nominate" ? "Register your interest in ASEB 2027 nominations. We will write to you when nominations open."
    : intent === "steward" ? "Express interest in becoming a Country Steward. Stewards begin as Members."
    : "Membership is the first step on the recognition pathway. It takes about three minutes.";

  return (
    <section className="min-h-[70vh] border-b border-hairline">
      <div className="wrap grid gap-12 pb-24 pt-12 lg:grid-cols-12 lg:gap-10 lg:pt-20">
        <aside className="lg:col-span-4">
          <p className="eyebrow">Join the Society</p>
          <h1 className={`mt-6 text-display-md ${step === 3 ? "hidden lg:block" : ""}`}>Take your place in the field.</h1>
          {step < 3 && <p className="mt-6 text-[1rem] leading-relaxed text-stone">{intro}</p>}
          <div className="mt-8 lg:hidden">
            <div className="grid grid-cols-4 gap-1">{steps.map((s, i) => <span key={s} className={`h-[3px] ${i <= step ? "bg-signal" : "bg-linen"}`} />)}</div>
            <p className="mt-3 text-[0.875rem] text-stone">Step {step + 1} of 4 · <span className="font-semibold text-ink">{steps[step]}</span></p>
          </div>
          <ol className="mt-10 hidden border-t border-hairline lg:block">
            {steps.map((s, i) => (
              <li key={s} className={`flex items-center gap-4 border-b border-hairline py-4 text-[0.9375rem] ${i === step ? "font-semibold text-ink" : i < step ? "text-ink" : "text-stone"}`}>
                <span aria-hidden="true" className={`block h-2 w-2 rounded-full border ${i <= step ? "border-ember bg-ember" : "border-stone"}`} />
                {s}
                {i < step && <span className="ml-auto text-[0.8125rem] font-medium text-stone">Done</span>}
              </li>
            ))}
          </ol>
        </aside>

        <div className="min-w-0 lg:col-span-7 lg:col-start-6">
          {step === 0 && (
            <div>
              <h2 className="font-display text-[2rem] leading-tight">Which best describes your role in the field?</h2>
              <p className="mt-3 text-[0.9375rem] text-stone">Your answer sets your profile badge, your Circle suggestions and your Academy track. You can add two secondary roles later.</p>
              <div className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist">
                {constituencies.map((c) => (
                  <Button variant="ghost" key={c.slug} role="tab" aria-selected={tab === c.slug} onClick={() => setTab(c.slug)}
                    className={`min-h-[40px] shrink-0 border px-4 text-[0.875rem] font-medium transition-colors ${tab === c.slug ? "border-ink bg-ink text-ivory" : "border-hairline hover:border-ink"}`}>
                    {c.name}
                  </Button>
                ))}
              </div>
              <fieldset className="mt-6 border-t border-ink">
                <legend className="sr-only">Role</legend>
                {tabRoles.map((r) => (
                  <label key={r.slug} className={`flex cursor-pointer items-start gap-4 border-b border-hairline px-1 py-5 transition-colors hover:bg-paper ${f.role === r.slug ? "bg-paper" : ""}`}>
                    <input type="radio" name="role" className="peer sr-only" checked={f.role === r.slug} onChange={() => set("role", r.slug)} />
                    <span className={`mt-1.5 inline-block h-3 w-3 shrink-0 border ${f.role === r.slug ? "border-signal bg-signal" : "border-ink/40"}`} aria-hidden="true" />
                    <span>
                      <span className="block text-[1.0625rem] font-medium">{r.role}</span>
                      <span className="mt-1 block text-[0.875rem] leading-relaxed text-stone">{r.contribution}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-display text-[2rem] leading-tight">About you</h2>
              <p className="mt-3 text-[0.9375rem] text-stone">Joining as {role ? `${/^[AEIOU]/.test(role.role) ? "an" : "a"} ${role.role}` : "a Member"}.</p>
              <div className="mt-8 inline-flex border border-ink" role="radiogroup" aria-label="Membership type">
                {(["individual", "organisation"] as const).map((t) => (
                  <Button variant="ghost" key={t} type="button" role="radio" aria-checked={f.type === t} onClick={() => set("type", t)}
                    className={`min-h-[44px] px-5 text-[0.875rem] font-semibold ${f.type === t ? "bg-ink text-ivory" : ""}`}>
                    {t === "individual" ? "As a practitioner" : "For an institution"}
                  </Button>
                ))}
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="field-label">{f.type === "organisation" ? "Institution name" : "Full name"}</span>
                  <input className="field-input" value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete={f.type === "organisation" ? "organization" : "name"} />
                </label>
                <label>
                  <span className="field-label">Email</span>
                  <input className="field-input" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
                  {f.email && !emailOk && <span className="mt-2 block text-[0.8125rem] text-ember">Enter a valid email address.</span>}
                </label>
                <label>
                  <span className="field-label">Country</span>
                  <select className="field-input" value={f.country} onChange={(e) => set("country", e.target.value)}>
                    <option value="">Select a country</option>
                    {africanCountries.map((c) => <option key={c}>{c}</option>)}
                    <option>Diaspora, outside Africa</option>
                  </select>
                </label>
                {f.type === "individual" && (
                  <label>
                    <span className="field-label">Organisation <span className="font-normal text-stone">(optional)</span></span>
                    <input className="field-input" value={f.organisation} onChange={(e) => set("organisation", e.target.value)} autoComplete="organization" />
                  </label>
                )}
                <label className={f.type === "individual" ? "" : "sm:col-span-2"}>
                  <span className="field-label">LinkedIn or website <span className="font-normal text-stone">(optional)</span></span>
                  <input className="field-input" value={f.linkedin} onChange={(e) => set("linkedin", e.target.value)} inputMode="url" />
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-[2rem] leading-tight">The Code of Practice</h2>
              <p className="mt-3 text-[0.9375rem] text-stone">Every Member signs the Code. It is the basis of the recognition pathway. Draft for consultation with the Leadership Council.</p>
              <ol className="mt-8 border-t border-ink">
                {code.map((c, i) => (
                  <li key={i} className="grid grid-cols-[2.5rem_1fr] border-b border-hairline py-5 text-[1rem] leading-relaxed">
                    <span aria-hidden="true" className="mt-[0.7em] block h-px w-4 bg-signal" />
                    {c}
                  </li>
                ))}
              </ol>
              <label className="mt-8 flex cursor-pointer items-start gap-4">
                <input type="checkbox" className="sr-only" checked={f.code} onChange={(e) => set("code", e.target.checked)} />
                <span className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center border text-[0.75rem] font-bold ${f.code ? "border-ink bg-ink text-ivory" : "border-ink/50"}`} aria-hidden="true">{f.code ? "✓" : ""}</span>
                <span className="text-[1rem]">I commit to the ASEB Code of Practice.</span>
              </label>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="eyebrow">Application received</p>
              <h2 className="mt-5 font-display text-[2.5rem] leading-tight">Thank you for taking your place in the field.</h2>
              <p className="mt-6 text-[1.0625rem] leading-relaxed text-stone">
                Thank you, {f.name.split(" ")[0]}. Your application has been saved for Secretariat review, with {f.email} as your contact address. Membership and profile claims remain subject to review.
              </p>
              <dl className="mt-10 grid border-t border-ink text-[0.9375rem] sm:grid-cols-3">
                <div className="border-b border-hairline py-5"><dt className="text-stone">Role</dt><dd className="mt-1 font-medium">{role?.role}</dd></div>
                <div className="border-b border-hairline py-5 sm:border-l sm:pl-5"><dt className="text-stone">Country</dt><dd className="mt-1 font-medium">{f.country}</dd></div>
                <div className="border-b border-hairline py-5 sm:border-l sm:pl-5"><dt className="text-stone">Application status</dt><dd className="mt-1 font-medium">Pending review</dd></div>
              </dl>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link to="/app" className="btn btn-primary">Preview the member app <span className="arr" aria-hidden="true">→</span></Link>
                <Link to="/registry" className="btn btn-line">Find your record <span className="arr" aria-hidden="true">→</span></Link>
              </div>
            </div>
          )}

          {step < 3 && (
            <>
            {error && <p role="alert" className="mt-8 text-sm text-ember">{error}</p>}
            <div className="mt-12 flex items-center justify-between gap-4 border-t border-hairline pt-8">
              <Button variant="ghost" type="button" disabled={saving} onClick={() => setStep((s) => Math.max(0, s - 1))} className={`min-h-[44px] text-[0.9375rem] font-semibold ${step === 0 ? "invisible" : ""}`}>
                ← Back
              </Button>
              <Button type="button" onClick={next} disabled={!canNext || saving} className="btn btn-primary h-auto disabled:cursor-not-allowed disabled:opacity-40">
                {saving ? "Saving application…" : step === 2 ? "Submit application" : "Continue"} <span className="arr" aria-hidden="true">→</span>
              </Button>
            </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
