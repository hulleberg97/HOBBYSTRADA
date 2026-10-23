"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** reasons: velg en grunn før handlingen utføres (brukes når admin avviser en annonse). */
type Action = { label: string; status?: string; del?: boolean; tone?: "primary" | "danger"; reasons?: string[] };

export function ListingActions({ id, actions }: { id: string; actions: Action[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [asking, setAsking] = useState<Action | null>(null);
  const [reason, setReason] = useState("");

  const run = async (a: Action) => {
    if (a.del && !confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    if (a.reasons && asking !== a) {
      setAsking(a);
      setReason(a.reasons[0]);
      return;
    }
    setBusy(true);
    setError("");
    const res = await fetch(`/api/listings/${id}`, {
      method: a.del ? "DELETE" : "PATCH",
      headers: { "content-type": "application/json" },
      body: a.del ? undefined : JSON.stringify({ status: a.status, ...(a.reasons ? { reason } : {}) }),
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
          {a.del && confirmDelete ? "Bekreft sletting" : a.label}
        </button>
      ))}
      {asking?.reasons && (
        <span className="flex w-full flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={`grunn-${id}`}>
            Grunn
          </label>
          <select
            id={`grunn-${id}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="h-9 rounded-full border border-slate-300 bg-white px-3 text-xs text-slate-800"
          >
            {asking.reasons.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <button type="button" disabled={busy} onClick={() => run(asking)} className="inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold text-destructive ring-1 ring-inset ring-destructive/30 hover:bg-destructive/5 disabled:opacity-50">
            Bekreft avvisning
          </button>
          <button type="button" onClick={() => setAsking(null)} className="text-xs font-medium text-slate-500 underline">
            Avbryt
          </button>
        </span>
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
