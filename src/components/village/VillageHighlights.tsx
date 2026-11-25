import { useQuery } from "@tanstack/react-query";
import { Link } from "@/lib/router";
import { excerpt, permalink, type ContentKind } from "@/lib/community";
import { listLive } from "@/lib/community-data";
import { products, playbookChapters, type ProductKey } from "@/content/products";
import { useCommunity } from "@/hooks/use-community";

const slots: { product: ProductKey; kinds: ContentKind[]; invitation: string; cta: string; to: string }[] = [
  { product: "voices", kinds: ["voice"], invitation: "Every ecosystem has a story. We want yours.", cta: "Share your story", to: "/contribute?kind=voice" },
  { product: "playbook", kinds: ["playbook_contribution"], invitation: playbookChapters[2]!.call, cta: "Contribute to the Playbook", to: "/playbook" },
  { product: "field", kinds: ["post", "article"], invitation: "What is happening in your ecosystem?", cta: "Open The Field", to: "/the-field" },
  { product: "ask", kinds: ["question"], invitation: "No one has all the answers. Ask the question you are stuck on.", cta: "Ask the Village", to: "/ask" },
  { product: "state", kinds: ["research"], invitation: "Share research, surveys and documented cases from your ecosystem.", cta: "State of the Field", to: "/state-of-the-field" },
];

// Each slot shows the latest published item for that product. When nothing is published yet it
// shows that product's real open call, never a placeholder story.
export function VillageHighlights() {
  const community = useCommunity();
  const latest = useQuery({
    queryKey: ["village", "home-highlights"],
    queryFn: async () => Object.fromEntries(await Promise.all(slots.map(async (s) => [s.product, (await listLive({ kinds: s.kinds, limit: 1 }))[0] ?? null] as const))),
    enabled: community.available,
    retry: false,
  });
  return (
    <section className="section border-t border-hairline" aria-labelledby="village-highlights">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6"><p className="eyebrow">From the village</p><h2 id="village-highlights" className="mt-5 text-title">One village. Many voices.</h2></div>
          <p className="lede lg:col-span-5 lg:col-start-8 lg:pt-12">Five ways the field documents, questions and strengthens its own practice, all reviewed before publication.</p>
        </div>
        <ul className="mt-12 grid gap-px border border-hairline bg-hairline md:grid-cols-2 lg:grid-cols-5">
          {slots.map((slot, i) => {
            const item = latest.data?.[slot.product];
            return (
              <li key={slot.product} className={`flex flex-col bg-ivory p-6 ${i === 0 ? "md:col-span-2 lg:col-span-1 lg:row-span-1" : ""}`}>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-umber">{products[slot.product].name}</p>
                {item ? (
                  <>
                    <Link to={permalink(item.kind, item.slug)} className="mt-3 block font-display text-[1.25rem] leading-snug hover:text-ember">{item.title || excerpt(item.body, 90)}</Link>
                    <p className="mt-2 text-[0.8125rem] text-stone">{item.author?.display_name}</p>
                  </>
                ) : <p className="mt-3 font-display text-[1.25rem] leading-snug">{slot.invitation}</p>}
                <Link to={slot.to} className="tlink mt-auto pt-5 text-[0.875rem]">{slot.cta} <span className="arr" aria-hidden="true">→</span></Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
