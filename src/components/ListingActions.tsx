"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Action = { label: string; status?: string; del?: boolean; tone?: "primary" | "danger" };

export function ListingActions({ id, actions }: { id: string; actions: Action[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  const run = async (a: Action) => {
    if (a.del && !confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setBusy(true);
    setError("");
    const res = await fetch(`/api/listings/${id}`, {
      method: a.del ? "DELETE" : "PATCH",
      headers: { "content-type": "application/json" },
      body: a.del ? undefined : JSON.stringify({ status: a.status }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    setConfirmDelete(false);
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
      {confirmDelete && (
        <button type="button" onClick={() => setConfirmDelete(false)} className="text-xs font-medium text-slate-500 underline">
          Avbryt
        </button>
      )}
      {error && <p className="w-full text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function MarkPaid({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch(`/api/admin/boost/${id}`, { method: "POST" });
        router.refresh();
      }}
      className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-xs font-semibold text-white transition hover:bg-black disabled:opacity-50"
    >
      {busy ? "Aktiverer …" : "Betalt – aktiver løftet"}
    </button>
  );
}
