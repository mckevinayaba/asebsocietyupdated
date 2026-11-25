// Bottom sheet on mobile, side panel on desktop. Built on the accessible Radix dialog primitive
// (focus trap, Escape to close, labelled title) with ASEB surfaces instead of library defaults.
import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { CloseIcon } from "./Icons";

export function Sheet({ open, onOpenChange, title, description, children, tone = "light", side = "auto" }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  tone?: "light" | "night";
  side?: "auto" | "bottom";
}) {
  const surface = tone === "night" ? "bg-night text-ivory on-dark" : "bg-ivory text-ink";
  const placement = side === "bottom"
    ? "inset-x-0 bottom-0 max-h-[88svh] rounded-t-[14px] lg:inset-x-auto lg:left-1/2 lg:w-[560px] lg:-translate-x-1/2"
    : "inset-x-0 bottom-0 max-h-[88svh] rounded-t-[14px] lg:inset-y-0 lg:left-auto lg:right-0 lg:max-h-none lg:w-[480px] lg:rounded-none";
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay fixed inset-0 z-[60] bg-night/60" />
        <Dialog.Content className={`sheet-panel fixed z-[61] flex flex-col overflow-hidden ${placement} ${surface}`}>
          <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-current opacity-20 lg:hidden" aria-hidden="true" />
          <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-4 lg:px-8 lg:pt-8">
            <div>
              <Dialog.Title className="font-display text-[1.5rem] leading-tight">{title}</Dialog.Title>
              {description ? <Dialog.Description className="mt-1 text-sm opacity-70">{description}</Dialog.Description> : <Dialog.Description className="sr-only">{title}</Dialog.Description>}
            </div>
            <Dialog.Close className="-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors hover:bg-current/10" aria-label="Close">
              <CloseIcon />
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[calc(24px+var(--safe-bottom))] lg:px-8">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
