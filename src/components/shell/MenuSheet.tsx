import { useState } from "react";
import { Link } from "@/lib/router";
import { desktopNav, investPath } from "@/content/navigation";
import { useMember } from "@/hooks/use-member";
import { Sheet } from "./Sheet";

// The compact institutional menu for secondary destinations on mobile.
export function MenuSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { user } = useMember();
  const [expanded, setExpanded] = useState<string | null>("About");
  const close = () => onOpenChange(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="ASEB Society" description="Strengthening those who strengthen entrepreneurship.">
      <Link to={investPath} onClick={close} className="btn btn-signal mt-1 w-full">Invest in Our Mission <span className="arr" aria-hidden="true">→</span></Link>
      <Link to="/" onClick={close} className="mt-5 flex min-h-[56px] items-center border-t border-ink font-display text-[1.375rem]">Home</Link>
      <div className="border-t border-hairline">
        {desktopNav.map((group) => {
          const isOpen = expanded === group.label;
          return (
            <div key={group.label} className="border-b border-hairline">
              <button type="button" aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : group.label)} className="flex min-h-[56px] w-full items-center justify-between text-left">
                <span className="font-display text-[1.375rem]">{group.label}</span>
                <span aria-hidden="true" className="text-xl text-stone">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <ul className="pb-3">
                  {group.items.map((item) => (
                    <li key={item.to}><Link to={item.to} onClick={close} className="block py-2.5"><span className="block font-semibold">{item.label}</span><span className="block text-[0.8125rem] text-stone">{item.note}</span></Link></li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 grid gap-3">
        <Link to="/join" onClick={close} className="btn btn-primary w-full">Become a member</Link>
        <Link to={user ? "/app" : "/auth"} onClick={close} className="btn btn-line w-full">{user ? "Open the member app" : "Member sign in"}</Link>
      </div>
      <div className="mt-8 space-y-1 text-[0.875rem] text-stone">
        <a className="block py-1.5 hover:text-ink" href="mailto:aseb@asebsociety.org">aseb@asebsociety.org</a>
        <a className="block py-1.5 hover:text-ink" href="https://wa.me/27731366639" target="_blank" rel="noreferrer">WhatsApp +27 73 136 6639</a>
        <a className="block py-1.5 hover:text-ink" href="https://www.asebs.com" target="_blank" rel="noreferrer">ASEB Summit and Awards, asebs.com ↗</a>
      </div>
    </Sheet>
  );
}
