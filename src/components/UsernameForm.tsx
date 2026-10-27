"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Min side: velg brukernavnet som vises på annonsene. Navnet fra Vipps kan ikke endres. */
export function UsernameForm({ current }: { current: string }) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/account/username", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username: value }) });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setMsg({ ok: false, text: j.error ?? "Noe gikk galt." });
    setMsg({ ok: true, text: "Lagret. Brukernavnet er oppdatert på alle annonsene dine." });
    setEditing(false);
    router.refresh();
  }

  if (!editing)
    return (
      <span className="flex flex-wrap items-center gap-3">
        <span className="font-medium text-slate-900">{current}</span>
        <button type="button" onClick={() => setEditing(true)} className="text-xs text-slate-600 underline underline-offset-2 hover:text-slate-900">
          Endre
        </button>
        {msg?.ok && <span className="text-xs text-emerald-700">{msg.text}</span>}
      </span>
    );
  return (
    <form onSubmit={save} className="flex flex-wrap items-center gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={20}
        autoComplete="nickname"
        aria-label="Brukernavn"
        className="h-9 rounded-full border border-slate-300 bg-white px-3 text-sm focus:border-primary focus:outline-none"
      />
      <button type="submit" disabled={busy} className="h-9 rounded-full bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50">
        {busy ? "Lagrer…" : "Lagre"}
      </button>
      <button type="button" onClick={() => { setEditing(false); setValue(current); setMsg(null); }} className="text-xs text-slate-500 underline">
        Avbryt
      </button>
      {msg && !msg.ok && <span className="w-full text-xs text-destructive">{msg.text}</span>}
    </form>
  );
}
