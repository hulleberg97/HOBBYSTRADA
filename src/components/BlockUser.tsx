"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BLOCK_RULES } from "@/lib/account";

/** Admin: steng ute eieren av en annonse. Velg hvilket vilkår som er brutt, og bekreft. */
export function BlockUser({ listingId, seller }: { listingId: string; seller: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rule, setRule] = useState<string>(BLOCK_RULES[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    if (!confirm(`Stenge ute ${seller}? Kontoen sperres og annonsene skjules nå. Alt slettes om 30 dager hvis ingen klage får medhold. Vipps-ID-en sperres i to år.`)) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/block", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ listingId, rule }) });
    setBusy(false);
    if (!res.ok) return setError((await res.json().catch(() => ({}))).error ?? "Noe gikk galt.");
    setOpen(false);
    router.refresh();
  }

  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="rounded-full px-3 py-1.5 text-xs font-semibold text-destructive ring-1 ring-inset ring-destructive/30 hover:bg-destructive/5">
        Steng ute selger
      </button>
    );
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select value={rule} onChange={(e) => setRule(e.target.value)} className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs">
        {BLOCK_RULES.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>
      <button type="button" disabled={busy} onClick={run} className="rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">
        {busy ? "Stenger…" : "Bekreft"}
      </button>
      <button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-500 underline">
        Avbryt
      </button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
