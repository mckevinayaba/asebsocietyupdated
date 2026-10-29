import { useState } from "react";
import { africanCountries } from "@/content/countries";

// Expression-of-interest form used by Country Partners, Ambassadors, Collaborate, Funders and Work With Us.
// In this build, submissions are kept in the browser (localStorage, key "aseb.<table>").
// When Lovable Cloud is connected, replace save() with an insert into the table named in `table`.
// See CLAUDE.md, section "Backend", for the table definitions.

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "url" | "select" | "textarea" | "country" | "choice";
  options?: string[];
  required?: boolean;
  full?: boolean;
  hint?: string;
};

type Props = { table: string; fields: Field[]; consent: string; submitLabel: string; done: { title: string; body: string } };

export function EoiForm({ table, fields, consent, submitLabel, done }: Props) {
  const [v, setV] = useState<Record<string, string>>({});
  const [agree, setAgree] = useState(false);
  const [sent, setSent] = useState(false);
  const [tried, setTried] = useState(false);
  const set = (k: string, val: string) => setV((x) => ({ ...x, [k]: val }));
  const emailOk = (s = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  const missing = fields.filter((f) => f.required && (!v[f.name]?.trim() || (f.type === "email" && !emailOk(v[f.name]))));
  const ok = missing.length === 0 && agree;

  const save = () => {
    setTried(true);
    if (!ok) return;
    const key = `aseb.${table}`;
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.push({ ...v, consent: true, submittedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(list));
    setSent(true);
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
    <form className="border-t border-ink pt-8" onSubmit={(e) => { e.preventDefault(); save(); }} noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        {fields.map((f) => {
          const bad = tried && missing.includes(f);
          const common = { className: `field-input ${bad ? "border-ember" : ""}`, value: v[f.name] || "", "aria-invalid": bad || undefined };
          return (
            <label key={f.name} className={f.full || f.type === "textarea" || f.type === "choice" ? "sm:col-span-2" : ""}>
              <span className="field-label">
                {f.label} {!f.required && <span className="font-normal text-stone">(optional)</span>}
              </span>
              {f.type === "textarea" ? (
                <textarea {...common} rows={4} onChange={(e) => set(f.name, e.target.value)} />
              ) : f.type === "select" || f.type === "country" ? (
                <select {...common} onChange={(e) => set(f.name, e.target.value)}>
                  <option value="">Select</option>
                  {(f.type === "country" ? [...africanCountries, "Diaspora, outside Africa"] : f.options || []).map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : f.type === "choice" ? (
                <span className="mt-1 flex flex-wrap gap-2">
                  {(f.options || []).map((o) => (
                    <button key={o} type="button" onClick={() => set(f.name, o)} aria-pressed={v[f.name] === o}
                      className={`min-h-[40px] border px-4 text-[0.875rem] font-medium transition-colors ${v[f.name] === o ? "border-ink bg-ink text-ivory" : bad ? "border-ember" : "border-hairline hover:border-ink"}`}>
                      {o}
                    </button>
                  ))}
                </span>
              ) : (
                <input {...common} type={f.type === "email" ? "email" : f.type === "url" ? "url" : "text"} inputMode={f.type === "url" ? "url" : undefined} onChange={(e) => set(f.name, e.target.value)} />
              )}
              {f.hint && <span className="mt-2 block text-[0.8125rem] text-stone">{f.hint}</span>}
              {bad && <span className="mt-2 block text-[0.8125rem] text-ember">{f.type === "email" ? "Enter a valid email address." : "This field is required."}</span>}
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
        <button type="submit" className="btn btn-primary">{submitLabel} <span className="arr" aria-hidden="true">→</span></button>
      </div>
      {tried && !ok && <p className="mt-4 text-[0.875rem] text-ember">Complete the required fields and the declaration to continue.</p>}
    </form>
  );
}
