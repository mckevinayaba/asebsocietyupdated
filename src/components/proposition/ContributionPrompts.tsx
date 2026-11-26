import { Link } from "@/lib/router";
import { campaigns } from "@/content/proposition";
import { siteOrigin } from "@/lib/seo";

// Contribution campaigns: questions the field is invited to answer, each linked to the product
// that takes the answer, and easy to pass on. These are prompts, never quotations.
export function ContributionPrompts({ only, sharePath }: { only?: string[]; sharePath: string }) {
  const list = only ? campaigns.filter((c) => only.some((o) => c.to.includes(o))) : campaigns;
  const url = `${siteOrigin}${sharePath}`;
  return (
    <ul className="border-t border-ink">
      {list.map((c) => {
        const text = `${c.prompt} Contribute on ASEB Society:`;
        const links = [
          { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
          { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
          { label: "Email", href: `mailto:?subject=${encodeURIComponent(c.prompt)}&body=${encodeURIComponent(`${text} ${url}`)}` },
        ];
        return (
          <li key={c.prompt} className="grid gap-4 border-b border-hairline py-6 lg:grid-cols-12 lg:gap-10">
            <p className="font-display text-[1.375rem] leading-snug lg:col-span-7 lg:text-[1.625rem]">{c.prompt}</p>
            <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end lg:text-right">
              <Link to={c.to} className="tlink font-semibold">{c.label} <span className="arr" aria-hidden="true">→</span></Link>
              <p className="flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] text-stone lg:justify-end">
                <span>Pass it on:</span>
                {links.map((l) => <a key={l.label} href={l.href} target={l.label === "Email" ? undefined : "_blank"} rel="noreferrer" className="underline underline-offset-4 hover:text-ink" aria-label={`Share this question by ${l.label}`}>{l.label}</a>)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
