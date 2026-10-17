"use client";

import { useId, useState } from "react";
import { PlusIcon } from "lucide-react";

export function AccordionItem({ q, children }: { q: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div data-open={open} className="group border-b border-slate-200 last:border-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="text-base font-semibold text-slate-950 sm:text-[17px]">{q}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 transition group-data-[open=true]:bg-primary group-data-[open=true]:text-white">
          <PlusIcon className="h-4 w-4 transition-transform duration-200 group-data-[open=true]:rotate-45" aria-hidden="true" />
        </span>
      </button>
      <div id={id} hidden={!open} className="pb-5 pr-12">
        <p className="text-[15px] leading-relaxed text-slate-600">{children}</p>
      </div>
    </div>
  );
}
