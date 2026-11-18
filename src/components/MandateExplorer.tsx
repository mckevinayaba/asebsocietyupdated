import { useState } from "react";
import { programmeReadiness, type ProgrammeKey } from "@/content/platform";
import { Button } from "@/components/ui/button";
import { TLink } from "@/components/Arrow";
import { Photo } from "@/components/Photo";

const programmes: { key: ProgrammeKey; name: string; photo: string; alt: string; focus: string[] }[] = [
  { key: "summit", name: "ASEB Summit & Awards", photo: "aseb-awards-stage-2.jpg", alt: "Ecosystem builders celebrating recognition on the ASEB stage", focus: ["Continental dialogue", "Practitioner recognition", "The Awards archive"] },
  { key: "circles", name: "ASEB Circles", photo: "aseb-networking.jpg", alt: "Ecosystem builders connecting at an ASEB gathering", focus: ["Peer exchange", "Cross-border relationships", "Shared professional challenges"] },
  { key: "academy", name: "ASEB Academy", photo: "aseb-summit-panel.jpg", alt: "Practitioners sharing knowledge at the ASEB Summit", focus: ["Practitioner development", "Operational frameworks", "Learning grounded in evidence"] },
  { key: "field-lab", name: "ASEB Field Lab", photo: "aseb-community-gathering.jpg", alt: "Practitioners and institutions gathered at ASEB", focus: ["Ecosystem conditions", "Research-to-practice", "Startup and climate policy"] },
];

export function MandateExplorer() {
  const [active, setActive] = useState<ProgrammeKey>("summit");
  const programme = programmes.find((item) => item.key === active);
  if (!programme) return null;
  const info = programmeReadiness[active];
  return <div className="mandate-explorer mt-12">
    <div role="tablist" aria-label="ASEB institutional pillars" className="grid grid-cols-2 border-y border-teal/25 lg:grid-cols-4">
      {programmes.map((item, index) => <Button key={item.key} id={`mandate-tab-${item.key}`} role="tab" variant="ghost" aria-selected={item.key === active} aria-controls="mandate-panel" tabIndex={item.key === active ? 0 : -1} onClick={() => setActive(item.key)} onKeyDown={(event) => {
        const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        const next = event.key === "Home" ? programmes[0] : event.key === "End" ? programmes[programmes.length - 1] : direction ? programmes[(index + direction + programmes.length) % programmes.length] : undefined;
        if (next) { event.preventDefault(); setActive(next.key); document.getElementById(`mandate-tab-${next.key}`)?.focus(); }
      }} className={`mandate-tab h-auto min-h-20 whitespace-normal rounded-none px-4 py-5 text-left text-base ${item.key === active ? "bg-teal text-ivory hover:bg-teal hover:text-ivory" : "text-teal hover:bg-teal-soft"}`}>{item.name}</Button>)}
    </div>
    <div id="mandate-panel" role="tabpanel" aria-labelledby={`mandate-tab-${active}`} tabIndex={0} className="grid gap-9 pt-10 lg:grid-cols-12 lg:gap-16">
      <div key={`${active}-photo`} className="mandate-enter lg:col-span-6"><Photo src={`images/events/${programme.photo}`} alt={programme.alt} caption={`${programme.name} · The people behind the purpose`} ratio="aspect-[4/3]" /></div>
      <div key={active} className="mandate-enter flex flex-col justify-center lg:col-span-6"><p className="eyebrow">{info.mandate}</p><h3 className="mt-5 text-3xl leading-tight lg:text-4xl">{info.benefit}</h3><p className="mt-5 text-base text-stone">{info.now}</p><ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-teal">{programme.focus.map((focus) => <li key={focus} className="border-b border-teal/25 pb-1">{focus}</li>)}</ul><div className="mt-8"><TLink to={info.to}>{info.action}</TLink></div></div>
    </div>
  </div>;
}