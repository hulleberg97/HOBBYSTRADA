"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const SLOTS = [
  ["", "Ikke festet"],
  ["1", "1 · Vises først"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
  ["5", "5"],
];

/** Admin: fest annonsen til en fast plass på forsiden. */
export function FanSlotSelect({ id, slot }: { id: string; slot: number | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const change = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBusy(true);
    await fetch(`/api/listings/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fanSlot: e.target.value ? Number(e.target.value) : null }),
    });
    setBusy(false);
    router.refresh();
  };
  return (
    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
      Forsiden
      <select
        value={slot ?? ""}
        onChange={change}
        disabled={busy}
        className="h-9 rounded-full border border-slate-300 bg-white px-3 text-xs font-semibold disabled:opacity-50"
      >
        {SLOTS.map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
