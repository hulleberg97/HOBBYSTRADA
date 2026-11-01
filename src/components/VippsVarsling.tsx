"use client";

import { useState } from "react";

/** Adminpanelet: slår på varsling fra Vipps, så annonseløft aktiveres med en gang betalingen er godkjent. */
export function VippsVarsling({ registered, createdAt }: { registered: boolean; createdAt: string | null }) {
  const [state, setState] = useState<{ registered: boolean; busy: boolean; note: string }>({ registered, busy: false, note: "" });
  const run = async (method: "POST" | "DELETE") => {
    setState((s) => ({ ...s, busy: true, note: "" }));
    const res = await fetch("/api/admin/vipps-webhook", { method });
    const data = await res.json().catch(() => ({}));
    setState({ registered: method === "POST" ? res.ok : false, busy: false, note: res.ok ? (method === "POST" ? "Vipps varsler nå siden ved hver betaling." : "Varslingen er slått av.") : (data.error ?? "Noe gikk galt.") });
  };
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-3xl bg-white p-5 text-sm ring-1 ring-slate-200">
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-950">Automatisk aktivering</p>
        <p className="text-slate-600">
          {state.registered
            ? `Vipps varsler siden når en betaling er godkjent, så løftet aktiveres med en gang.${createdAt ? ` Slått på ${new Date(createdAt).toLocaleDateString("nb-NO")}.` : ""}`
            : "Ikke slått på. Løft aktiveres først når kunden kommer tilbake til siden, eller når du trykker «Sjekk Vipps»."}
        </p>
        {state.note && <p className="mt-1 text-xs text-slate-500">{state.note}</p>}
      </div>
      <button
        type="button"
        disabled={state.busy}
        onClick={() => run(state.registered ? "DELETE" : "POST")}
        className={`inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold transition disabled:opacity-50 ${state.registered ? "bg-slate-100 text-slate-800 hover:bg-slate-200" : "bg-primary text-white hover:bg-black"}`}
      >
        {state.busy ? "Et øyeblikk …" : state.registered ? "Slå av" : "Slå på varsling fra Vipps"}
      </button>
    </div>
  );
}
