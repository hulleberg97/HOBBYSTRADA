"use client";

import { useState, useSyncExternalStore } from "react";
import { angreDato, angreDatoTekst, refusjon } from "@/lib/angrerett";

const now = () => Date.now();
const subscribe = () => () => {};

/** På kvitteringen: bruk angreretten. Knappen vises til og med angredatoen (slutten av perioden eller 14 dager, det som kommer først). */
export function WithdrawBoost({ orderId, days, amount, paidAt }: { orderId: string; days: number; amount: number; paidAt: string }) {
  const [state, setState] = useState<{ busy?: boolean; done?: string; error?: string }>({});
  // Klokka leses via useSyncExternalStore, så rendering er ren (react-hooks/purity)
  const clock = useSyncExternalStore(subscribe, now, () => 0);
  if (!clock) return null;
  const frist = angreDato(paidAt, days);
  if (clock > frist.getTime()) return null;
  const { totalHours, usedHours, refund } = refusjon(amount, days, paidAt, clock);
  async function run() {
    const q =
      usedHours >= totalHours
        ? "Angre avtalen? Perioden er over, så løftet er levert fullt ut. Vi svarer deg på e-post."
        : `Angre avtalen? Løftet stoppes nå, og du får tilbake ${refund} kr for den delen av perioden som ikke er brukt.`;
    if (!confirm(q)) return;
    setState({ busy: true });
    const res = await fetch("/api/boost/angre", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderId }) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) return setState({ error: j.error ?? "Noe gikk galt." });
    setState({ done: `Mottatt. Du får en bekreftelse på e-post, og ${j.refund} kr betales tilbake senest innen 14 dager.` });
  }
  return (
    <div className="mt-6 border-t border-slate-200 pt-5 text-sm print:hidden">
      {state.done ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800">{state.done}</p>
      ) : (
        <>
          <p className="font-semibold text-slate-900">Angrerett</p>
          <p className="mt-1 text-slate-600">
            Du kan angre til og med {angreDatoTekst(frist)}.
          </p>
          <button
            type="button"
            disabled={state.busy}
            onClick={run}
            className="mt-3 inline-flex h-11 items-center justify-center rounded-full border-2 border-slate-900 px-6 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white disabled:opacity-50"
          >
            {state.busy ? "Sender…" : "Angre avtalen"}
          </button>
          {state.error && <p className="mt-2 text-destructive">{state.error}</p>}
        </>
      )}
    </div>
  );
}
