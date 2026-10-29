import { Link, useParams } from "@/lib/router";
import { constituencies, constituencyBySlug, roleBySlug, rolesFor, type ConstituencySlug } from "@/content/field";
import { registry } from "@/content/registry";
import { statements } from "@/content/site";
import { PageHero } from "@/components/PageHero";
import { Btn, TLink } from "@/components/Arrow";
import NotFound from "./NotFound";

// Maps each role to the award names used across editions in the Registry.
const awardPatterns: Record<string, RegExp> = {
  "ecosystem-builder": /^(Startup )?Ecosystem Builder|^Best Ecosystem Builder/,
  "youth-ecosystem-builder": /^Youth/,
  "immigrant-ecosystem-builder": /^Immigrant/,
  "diaspora-bridge-builder": /^Diaspora/,
  mentor: /Mentor/,
  coach: /Coach/,
  "angel-investor": /^Angel Investor/,
  "founder-wellbeing": /Wellbeing/,
  "media-creator": /Media/,
  eso: /Support Organisation|Social Entrepreneurship Support/,
  "service-provider": /Service Provider/,
  "innovation-hub": /Innovation Hub/,
  "incubator-accelerator": /^(Incubator|Accelerator)/,
  "coworking-space": /Coworking/,
  "entrepreneurship-education": /Entrepreneurship Education/,
  "financing-angel-network": /Financing/,
  "funder-development-partner": /Funder/,
  "corporate-cvc": /Corporate/,
  "ecosystem-collaboration": /^Ecosystem Collaboration/,
  "tech-transfer": /Technology Transfer/,
  "cross-border": /Cross-Border/,
  "ecosystem-event": /Event/,
  "investment-readiness": /Investment Readiness/,
  "policy-government": /Policy/,
  "research-measurement": /Research/,
  dei: /Diversity/,
  "infrastructure-shared-systems": /Infrastructure/,
  university: /University/,
};

export function FieldIndex() {
  return (
    <>
      <PageHero eyebrow="The Field" title={<>One field. Twenty&#8209;eight roles.</>} lede={statements.whoBuilds} />
      <section className="section">
        <div className="wrap space-y-20 lg:space-y-28">
          {constituencies.map((c) => (
            <div key={c.slug} className="grid gap-10 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <span aria-hidden="true" className="block h-[3px] w-12 bg-signal" />
                <h2 className="mt-6 text-display-sm">{c.name}</h2>
                <p className="mt-4 font-display text-[1.25rem] leading-snug text-ink/80">{c.headline}</p>
                <p className="mt-5 text-[0.9375rem] leading-relaxed text-stone">{c.intro}</p>
                <div className="mt-7"><TLink to={`/field/${c.slug}`}>The {c.name.toLowerCase()} page</TLink></div>
              </div>
              <ul className="border-t border-ink lg:col-span-6 lg:col-start-7">
                {rolesFor(c.slug).map((r) => (
                  <li key={r.slug}>
                    <Link to={`/field/role/${r.slug}`} className="group flex items-baseline justify-between gap-6 border-b border-hairline py-4">
                      <span className="text-[1.0625rem] transition-colors group-hover:text-ember">{r.role}</span>
                      <span className="text-ink/30 transition-all group-hover:translate-x-1 group-hover:text-ember" aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function ConstituencyPage() {
  const { slug = "" } = useParams();
  const c = constituencyBySlug(slug);
  if (!c) return <NotFound />;
  const rs = rolesFor(c.slug as ConstituencySlug);
  return (
    <>
      <PageHero eyebrow={`The Field · ${c.name}`} title={c.headline} lede={c.intro}>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Btn to="/join">Join as one of these roles</Btn>
          <Btn to="/registry" variant="line">Find others in the Registry</Btn>
        </div>
      </PageHero>
      <section className="section">
        <div className="wrap">
          <div className="hidden grid-cols-12 gap-10 border-b border-ink pb-4 text-eyebrow font-semibold uppercase text-stone lg:grid">
            <span className="col-span-4">Role</span>
            <span className="col-span-4">Your contribution</span>
            <span className="col-span-4">What the Society offers</span>
          </div>
          <ul className="border-t border-ink lg:border-t-0">
            {rs.map((r) => (
              <li key={r.slug} className="reveal grid gap-4 border-b border-hairline py-8 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-4">
                  <Link to={`/field/role/${r.slug}`} className="font-display text-[1.625rem] leading-tight hover:text-ember">{r.role}</Link>
                  <p className="mt-2 text-[0.8125rem] text-stone">{r.award}</p>
                </div>
                <p className="text-[1rem] leading-relaxed lg:col-span-4">{r.contribution}</p>
                <p className="text-[1rem] leading-relaxed text-stone lg:col-span-4">{r.offer}</p>
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-4">
            {constituencies.filter((x) => x.slug !== c.slug).map((x) => (
              <TLink key={x.slug} to={`/field/${x.slug}`}>{x.name}</TLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function RolePage() {
  const { slug = "" } = useParams();
  const r = roleBySlug(slug);
  if (!r) return <NotFound />;
  const c = constituencyBySlug(r.constituency)!;
  const pattern = awardPatterns[r.slug];
  const related = pattern ? registry.filter((x) => x.recognitions.some((rec) => pattern.test(rec.award))).slice(0, 8) : [];

  return (
    <>
      <PageHero eyebrow={`${c.name} · Role`} title={r.role} lede={r.contribution} />
      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="eyebrow">What the Society offers</p>
            <p className="mt-6 font-display text-[1.75rem] leading-snug">{r.offer}</p>
            <dl className="mt-10 grid grid-cols-1 border-t border-hairline text-[0.9375rem] sm:grid-cols-2">
              <div className="border-b border-hairline py-5 sm:pr-6"><dt className="text-stone">Award category</dt><dd className="mt-1 font-medium">{r.award}</dd></div>
              <div className="border-b border-hairline py-5 sm:border-l sm:pl-6"><dt className="text-stone">Part of the field</dt><dd className="mt-1 font-medium"><Link className="hover:text-ember" to={`/field/${c.slug}`}>{c.name}</Link></dd></div>
            </dl>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Btn to={`/join?role=${r.slug}`}>Join as {/^[AEIOU]/.test(r.role) ? "an" : "a"} {r.role}</Btn>
              <Btn to="/summit" variant="line">Nominate for the Awards</Btn>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-eyebrow font-semibold uppercase text-stone">Recognised in this role</p>
            {related.length ? (
              <ul className="mt-5 border-t border-ink">
                {related.map((x) => (
                  <li key={x.slug}>
                    <Link to={`/registry/${x.slug}`} className="group flex items-baseline justify-between gap-4 border-b border-hairline py-4">
                      <span>
                        <span className="block text-[1.0625rem] group-hover:text-ember">{x.name}</span>
                        <span className="text-[0.8125rem] text-stone">{x.country} · {x.recognitions.map((rec) => `${rec.result} ${rec.year}`).join(", ")}</span>
                      </span>
                      <span className="text-ink/30 group-hover:text-ember" aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 border-t border-ink pt-5 text-[0.9375rem] text-stone">Records for this role are being added to the Field Registry.</p>
            )}
            <div className="mt-6"><TLink to="/registry">The full Registry</TLink></div>
          </div>
        </div>
      </section>
    </>
  );
}
