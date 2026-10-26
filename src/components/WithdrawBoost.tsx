"use client";

import { useState, useSyncExternalStore } from "react";

const now = () => Date.now();
const subscribe = () => () => {};

/** På kvitteringen: bruk angreretten. Viser hva kunden får tilbake, og bekrefter med en gang. */
export function WithdrawBoost({ orderId, days, amount, paidAt }: { orderId: string; days: number; amount: number; paidAt: string }) {
  const [state, setState] = useState<{ busy?: boolean; done?: string; error?: string }>({});
  // Klokka leses via useSyncExternalStore, så rendering er ren (react-hooks/purity)
  const clock = useSyncExternalStore(subscribe, now, () => 0);
  const paid = new Date(paidAt).getTime();
  const sinceDays = clock ? (clock - paid) / 864e5 : 0;
  if (!clock) return null;
  if (sinceDays > 14 || sinceDays >= days) return null;
  const used = Math.min(days, Math.ceil(sinceDays));
  const refund = Math.round((amount * (days - used)) / days);
  async function run() {
    if (!confirm(`Bruke angreretten? Løftet stoppes nå, og du får tilbake ${refund} kr (${days - used} av ${days} dager er ubrukt).`)) return;
    setState({ busy: true });
    const res = await fetch("/api/boost/angre", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderId }) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) return setState({ error: j.error ?? "Noe gikk galt." });
    setState({ done: `Mottatt. Du får en bekreftelse på e-post, og ${j.refund} kr betales tilbake senest innen 14 dager.` });
  }
  return (
    <div className="mt-4 text-sm print:hidden">
      {state.done ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800">{state.done}</p>
      ) : (
        <>
          <button type="button" disabled={state.busy} onClick={run} className="text-slate-600 underline underline-offset-2 hover:text-slate-900 disabled:opacity-50">
            {state.busy ? "Sender…" : "Angre kjøpet"}
          </button>
          <span className="text-slate-500"> (14 dagers angrerett, du får tilbake ubrukte dager)</span>
          {state.error && <p className="mt-2 text-destructive">{state.error}</p>}
        </>
      )}
    </div>
  );
}
