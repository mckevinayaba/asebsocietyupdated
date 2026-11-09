import { useState } from "react";
import { personas } from "@/content/platform";
import { Button } from "@/components/ui/button";
import { Btn, TLink } from "@/components/Arrow";

export function FindYourPlace() {
  const [selected, setSelected] = useState<string>(personas[0]?.key ?? "practitioner");
  const person = personas.find((item) => item.key === selected);
  if (!person) return null;
  return <div className="mt-12 grid gap-10 lg:grid-cols-12">
    <div role="group" aria-label="Your role in entrepreneurship" className="flex flex-col border-t border-hairline lg:col-span-5">
      {personas.map((item) => <Button key={item.key} variant="ghost" aria-pressed={selected === item.key} onClick={() => setSelected(item.key)} className={`h-auto min-h-14 w-full justify-between whitespace-normal rounded-none border-b px-4 py-4 text-left text-base ${selected === item.key ? "border-teal bg-teal-soft text-teal" : "border-hairline text-ink"}`}>{item.label}<span aria-hidden="true">{selected === item.key ? "→" : "+"}</span></Button>)}
    </div>
    <div aria-live="polite" aria-atomic="true" className="flex flex-col justify-center border-l-2 border-teal pl-6 lg:col-span-6 lg:col-start-7 lg:pl-10">
      <p className="text-sm font-medium text-teal">{person.example}</p>
      <h3 className="mt-5 text-[2rem] leading-tight lg:text-[2.5rem]">{person.title}</h3>
      <p className="mt-5 max-w-prose text-stone">{person.description}</p>
      <div className="mt-8"><Btn to={person.to} className="max-w-full whitespace-normal text-center">{person.action}</Btn></div>
      <div className="mt-5"><TLink to={person.resource}>{person.resourceLabel}</TLink></div>
    </div>
  </div>;
}