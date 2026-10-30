"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * ask: administrator må oppgi hvilket vilkår som er brutt og en konkret begrunnelse før handlingen utføres
 * (avvisning av ny annonse, fjerning av publisert annonse). warning/refund viser valgfrie felt for fjerning.
 * payload: ekstra felt som sendes som de er (f.eks. klage mottatt/avgjort).
 */
type Ask = { rules: string[]; confirm: string; warning?: boolean; refund?: boolean };
type Action = { label: string; status?: string; del?: boolean; tone?: "primary" | "danger"; ask?: Ask; payload?: Record<string, unknown> };

export function ListingActions({ id, actions }: { id: string; actions: Action[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [asking, setAsking] = useState<Action | null>(null);
  const [rule, setRule] = useState("");
  const [reason, setReason] = useState("");
  const [warning, setWarning] = useState(false);
  const [refund, setRefund] = useState<"ja" | "nei">("ja");

  const run = async (a: Action) => {
    if (a.ask && asking !== a) {
      setAsking(a);
      setRule(a.ask.rules[0]);
      setReason("");
      setWarning(false);
      return;
    }
    if (a.ask && !reason.trim()) {
      setError("Skriv en konkret begrunnelse.");
      return;
    }
    if (a.del && !a.ask && !confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setBusy(true);
    setError("");
    const extra = a.ask ? { rule, reason: reason.trim(), warning: a.ask.warning ? warning : undefined, refundBoost: a.ask.refund ? refund === "ja" : undefined } : {};
    const res = await fetch(`/api/listings/${id}`, {
      method: a.del ? "DELETE" : "PATCH",
      headers: { "content-type": "application/json" },
      body: a.del && !a.ask ? undefined : JSON.stringify({ ...(a.status ? { status: a.status } : {}), ...(a.payload ?? {}), ...extra }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    setConfirmDelete(false);
    setAsking(null);
    if (!res.ok) setError(data.error ?? "Noe gikk galt.");
    else router.refresh();
  };

  const tone = {
    primary: "bg-primary text-white hover:bg-black",
    danger: "text-destructive ring-1 ring-inset ring-destructive/30 hover:bg-destructive/5",
    default: "bg-slate-100 text-slate-800 hover:bg-slate-200",
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((a) => (
        <button
          key={a.label}
          type="button"
          disabled={busy}
          onClick={() => run(a)}
          className={`inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold transition disabled:opacity-50 ${tone[a.tone ?? "default"]}`}
        >
          {a.del && !a.ask && confirmDelete ? "Bekreft sletting" : a.label}
        </button>
      ))}
      {asking?.ask && (
        <div className="w-full space-y-2 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
          <label className="block text-xs font-semibold text-slate-700">
            Vilkår som er brutt
            <select value={rule} onChange={(e) => setRule(e.target.value)} className="mt-1 block h-9 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs font-normal text-slate-800">
              {asking.ask.rules.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-slate-700">
            Begrunnelse (obligatorisk, konkret hva som må rettes)
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} required className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-normal text-slate-800" />
          </label>
          {asking.ask.warning && (
            <label className="flex items-center gap-2 text-xs text-slate-700">
              <input type="checkbox" checked={warning} onChange={(e) => setWarning(e.target.checked)} />
              Dette er en advarsel (mindre alvorlig brudd). Setningen «Dette er en advarsel. Gjentatte brudd kan føre til at kontoen stenges.» tas med.
            </label>
          )}
          {asking.ask.refund && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700">
              <span className="font-semibold">Annonsen har aktivt annonseløft:</span>
              <label className="flex items-center gap-1.5">
                <input type="radio" name={`refund-${id}`} checked={refund === "ja"} onChange={() => setRefund("ja")} /> Refunder ubrukt del
              </label>
              <label className="flex items-center gap-1.5">
                <input type="radio" name={`refund-${id}`} checked={refund === "nei"} onChange={() => setRefund("nei")} /> Ingen refusjon (alvorlig eller gjentatt brudd)
              </label>
            </div>
          )}
          <div className="flex items-center gap-3">
            <button type="button" disabled={busy} onClick={() => run(asking)} className="inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold text-destructive ring-1 ring-inset ring-destructive/30 hover:bg-destructive/5 disabled:opacity-50">
              {asking.ask.confirm}
            </button>
            <button type="button" onClick={() => setAsking(null)} className="text-xs font-medium text-slate-500 underline">
              Avbryt
            </button>
          </div>
        </div>
      )}
      {confirmDelete && (
        <button type="button" onClick={() => setConfirmDelete(false)} className="text-xs font-medium text-slate-500 underline">
          Avbryt
        </button>
      )}
      {error && <p className="w-full text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function MarkPaid({ id, vipps }: { id: string; vipps: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const run = async (check: boolean) => {
    setBusy(true);
    const res = await fetch(`/api/admin/boost/${id}${check ? "?check=1" : ""}`, { method: "POST" });
    const { result } = await res.json().catch(() => ({}));
    setBusy(false);
    if (result === "waiting") setNote("Ikke betalt i Vipps ennå.");
    else router.refresh();
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      {vipps && (
        <button
          type="button"
          disabled={busy}
          onClick={() => run(true)}
          className="inline-flex h-9 items-center rounded-full bg-slate-100 px-4 text-xs font-semibold text-slate-800 transition hover:bg-slate-200 disabled:opacity-50"
        >
          Sjekk Vipps
        </button>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={() => run(false)}
        className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-xs font-semibold text-white transition hover:bg-black disabled:opacity-50"
      >
        {busy ? "Et øyeblikk …" : "Betalt – aktiver løftet"}
      </button>
      {note && <p className="w-full text-xs text-slate-500">{note}</p>}
    </div>
  );
}

export function ResolveReport({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch(`/api/admin/reports/${id}`, { method: "POST" });
        router.refresh();
      }}
      className="inline-flex h-9 items-center rounded-full bg-slate-100 px-4 text-xs font-semibold text-slate-800 transition hover:bg-slate-200 disabled:opacity-50"
    >
      {busy ? "Lagrer …" : "Ferdig behandlet"}
    </button>
  );
}
