import type { ProgrammeStatus as Status } from "@/content/platform";

export function ProgrammeStatus({ status }: { status: Status }) {
  const tone = status === "Available" ? "border-teal/30 bg-teal-soft text-teal" : status === "Open for Partnership" ? "border-ember/30 bg-signal/10 text-ember" : "border-hairline text-stone";
  return <span className={`inline-flex max-w-full items-center gap-2 rounded border px-3 py-1.5 text-xs font-semibold ${tone}`}><span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${status === "Available" ? "bg-teal" : status === "Open for Partnership" ? "bg-signal" : "bg-stone"}`} />{status}</span>;
}