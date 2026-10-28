"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Konto = { id: string; email: string; name: string; created: string; listings: number };

/** Admin, før lansering: slett testdata og testkontoer. Aktive annonser beholdes. */
export function RyddTestdata({ kontoer }: { kontoer: Konto[] }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const btn = "rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50";

  async function data() {
    if (!confirm("Slette alle bestillinger, samtaler, varsler, lagrede søk, rapporter, sperringer og bilder fra testingen? Aktive annonser og kontoer beholdes. Dette kan ikke angres.")) return;
    setBusy(true);
    setMsg("Rydder…");
    const r = await fetch("/api/admin/rydd", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ what: "data" }) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setMsg(`Feil: ${j.error ?? r.status}`);
    const rows = Object.entries(j.deleted as Record<string, number>).filter(([, n]) => n > 0);
    setMsg(rows.length ? `Slettet: ${rows.map(([k, n]) => `${k} ${n}`).join(", ")}.` : "Ingenting å slette, databasen var allerede ren.");
    router.refresh();
  }

  async function konto(k: Konto) {
    if (!confirm(`Slette kontoen ${k.email} (${k.name}) med ${k.listings} annonser? Dette kan ikke angres.`)) return;
    setBusy(true);
    const r = await fetch("/api/admin/rydd", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ what: "konto", id: k.id }) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    setMsg(r.ok ? `Kontoen ${k.email} er slettet.` : `Feil: ${j.error ?? r.status}`);
    router.refresh();
  }

  return (
    <div className="mt-3 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
      <p className="text-sm text-slate-600">
        Før lansering: sletter bestillinger, samtaler, varsler, lagrede søk, rapporter, sperringer, annonser som ikke er aktive, og bilder som ikke er i bruk.
        Aktive annonser og kontoer beholdes.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" disabled={busy} onClick={data} className={`${btn} text-destructive`}>
          Slett testdata
        </button>
        {msg && <span className="text-sm text-slate-600">{msg}</span>}
      </div>
      {kontoer.length > 0 && (
        <>
          <p className="mt-5 text-sm font-semibold text-slate-900">Andre kontoer ({kontoer.length})</p>
          <ul className="mt-2 divide-y divide-slate-100 text-sm">
            {kontoer.map((k) => (
              <li key={k.id} className="flex flex-wrap items-center justify-between gap-3 py-2">
                <span>
                  <span className="font-medium text-slate-900">{k.email}</span> <span className="text-slate-500">· {k.name} · {k.listings} annonser · opprettet {k.created}</span>
                </span>
                <button type="button" disabled={busy} onClick={() => konto(k)} className={`${btn} text-destructive`}>
                  Slett konto
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
