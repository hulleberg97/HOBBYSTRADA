"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Admin: bryter for om annonsen er med på forsiden. */
export function FanSlotSelect({ id, on }: { id: string; on: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const toggle = async () => {
    setBusy(true);
    await fetch(`/api/listings/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ fanSlot: on ? null : true }) });
    setBusy(false);
    router.refresh();
  };
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={on}
      className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50 aria-pressed:bg-slate-900 aria-pressed:text-white aria-pressed:ring-slate-900 disabled:opacity-50"
    >
      {on ? "På forsiden" : "Legg på forsiden"}
    </button>
  );
}
