"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Admin: opphev en utestengelse (klage fikk medhold). */
export function Unblock({ vippsSub }: { vippsSub: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function run() {
    if (!confirm("Oppheve utestengelsen? Kontoen åpnes og annonsene legges ut igjen.")) return;
    setBusy(true);
    await fetch("/api/admin/unblock", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ vippsSub }) });
    setBusy(false);
    router.refresh();
  }
  return (
    <button type="button" disabled={busy} onClick={run} className="rounded-full px-3 py-1.5 text-xs font-semibold text-primary ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50">
      {busy ? "Åpner…" : "Åpne kontoen igjen"}
    </button>
  );
}
