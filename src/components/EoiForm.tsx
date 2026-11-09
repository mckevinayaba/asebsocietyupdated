import { useSearchParams } from "@/lib/router";
import { circleKeys } from "@/lib/programme-intake";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { submitProgrammeInterest } from "@/lib/member.functions";
import { useMember } from "@/hooks/use-member";
import { useEffect, useState } from "react";
import { africanCountries } from "@/content/countries";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { fieldError, prepareEnquiry, type Field, type EnquirySource } from "@/lib/eoi";
export type { Field } from "@/lib/eoi";

type Props = { source: EnquirySource; fields: Field[]; consent: string; submitLabel: string; done: { title: string; body: string } };

export function EoiForm({ source, fields, consent, submitLabel, done }: Props) {
  const { user } = useMember();
  const [params] = useSearchParams();
  const requestedGroup = params.get("group");
  const submitMemberInterest = useServerFn(submitProgrammeInterest);
  const queryClient = useQueryClient();
  const [v, setV] = useState<Record<string, string>>({});
  useEffect(() => { if (source === "/communities" && requestedGroup?.startsWith("group:") && circleKeys.includes(requestedGroup)) setV(value => ({ ...value, groups: requestedGroup })); }, [source, requestedGroup]);
  const [agree, setAgree] = useState(false);
  const [sent, setSent] = useState(false);
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, val: string) => setV((x) => ({ ...x, [k]: val }));
  const missing = fields.filter((f) => fieldError(f, v[f.name]));
  const ok = missing.length === 0 && agree;

  const save = async () => {
    setTried(true);
    if (!ok || saving) return;
    setSaving(true);
    setError("");
    try {
      const enquiry = prepareEnquiry(source, fields, v, agree);
      const programme = ["/communities", "/learning", "/field-lab"].includes(source);
      const verified = programme ? await supabase.auth.getUser() : null;
      if (programme && (user || verified?.data.user)) {
        await submitMemberInterest({ data: { source, values: v, consent: agree } });
        await queryClient.invalidateQueries({ queryKey: ["member-data"] });
      } else {
        const { error: insertError } = await supabase.from(programme ? "programme_interests" : source === "/insights" ? "insight_pitches" : "partnership_enquiries").insert(programme ? { ...enquiry, user_id: null } : enquiry);
        if (insertError) throw new Error("Your enquiry could not be saved. Please try again; your answers are still here.");
      }
      setSent(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your enquiry could not be saved. Please try again.");
    } finally { setSaving(false); }
  };

  if (sent)
    return (
      <div className="border-t border-ink pt-8" role="status">
        <p className="eyebrow">Received</p>
        <h3 className="mt-5 font-display text-[2rem] leading-tight">{done.title}</h3>
        <p className="mt-4 max-w-prose text-[1rem] leading-relaxed text-stone">{done.body}</p>
      </div>
    );

  return (
    <form className="border-t border-ink pt-8" aria-busy={saving} onSubmit={(e) => { e.preventDefault(); void save(); }} noValidate>
      <fieldset disabled={saving}>
      <div className="grid gap-6 sm:grid-cols-2">
        {fields.map((f) => {
          const bad = tried && missing.includes(f);
          const common = { className: `field-input ${bad ? "border-ember" : ""}`, value: v[f.name] || "", "aria-invalid": bad || undefined };
          return (
            <label key={f.name} className={f.full || f.type === "textarea" || f.type === "choice" || f.type === "multiple" ? "sm:col-span-2" : ""}>
              <span className="field-label">
                {f.label} {!f.required && <span className="font-normal text-stone">(optional)</span>}
              </span>
              {f.type === "multiple" ? (
                <span className="mt-3 grid gap-3 sm:grid-cols-2">
                  {f.options?.map(option => <span key={option} className="flex items-start gap-3 border-b border-hairline pb-3"><input type="checkbox" className="mt-1 accent-teal" aria-label={f.optionLabels?.[option] || option} checked={(v[f.name] || "").split("|").includes(option)} onChange={event => { const selected = (v[f.name] || "").split("|").filter(Boolean); set(f.name, (event.target.checked ? [...selected, option] : selected.filter(item => item !== option)).join("|")); }} /><span className="text-sm">{f.optionLabels?.[option] || option}</span></span>)}
                </span>
              ) : f.type === "textarea" ? (
                <textarea {...common} rows={4} onChange={(e) => set(f.name, e.target.value)} />
              ) : f.type === "select" || f.type === "country" ? (
                <select {...common} onChange={(e) => set(f.name, e.target.value)}>
                  <option value="">Select</option>
                  {(f.type === "country" ? [...africanCountries, "Diaspora, outside Africa"] : f.options || []).map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : f.type === "choice" ? (
                <span className="mt-1 flex flex-wrap gap-2">
                  {(f.options || []).map((o) => (
                     <Button variant="ghost" key={o} type="button" onClick={() => set(f.name, o)} aria-pressed={v[f.name] === o}
                      className={`min-h-[40px] border px-4 text-[0.875rem] font-medium transition-colors ${v[f.name] === o ? "border-ink bg-ink text-ivory" : bad ? "border-ember" : "border-hairline hover:border-ink"}`}>
                      {o}
                     </Button>
                  ))}
                </span>
              ) : (
                <input {...common} type={f.type === "email" ? "email" : f.type === "url" ? "url" : "text"} inputMode={f.type === "url" ? "url" : undefined} onChange={(e) => set(f.name, e.target.value)} />
              )}
              {f.hint && <span className="mt-2 block text-[0.8125rem] text-stone">{f.hint}</span>}
               {bad && <span className="mt-2 block text-[0.8125rem] text-ember">{fieldError(f, v[f.name])}</span>}
            </label>
          );
        })}
      </div>
      <label className="mt-8 flex cursor-pointer items-start gap-4">
        <input type="checkbox" className="sr-only" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center border text-[0.75rem] font-bold ${agree ? "border-ink bg-ink text-ivory" : tried ? "border-ember" : "border-ink/50"}`} aria-hidden="true">{agree ? "✓" : ""}</span>
        <span className="text-[0.9375rem] leading-relaxed">{consent}</span>
      </label>
      <div className="mt-10 flex flex-col gap-4 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.8125rem] text-stone">Your details are used only to assess this expression of interest, under POPIA.</p>
         <Button type="submit" className="btn btn-primary h-auto whitespace-normal">{saving ? "Sending…" : submitLabel} <span className="arr" aria-hidden="true">→</span></Button>
      </div>
      {tried && !ok && <p className="mt-4 text-[0.875rem] text-ember">Complete the required fields and the declaration to continue.</p>}
      </fieldset>
      {error && <p role="alert" className="mt-4 text-[0.875rem] text-ember">{error}</p>}
    </form>
  );
}
