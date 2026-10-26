"use client";

import { useState } from "react";

export function TestMail() {
  const [msg, setMsg] = useState("");
  async function run() {
    setMsg("Sender…");
    const r = await fetch("/api/admin/testmail", { method: "POST" });
    const j = await r.json().catch(() => ({}));
    setMsg(r.ok && j.ok ? `Sendt til ${j.to}. Sjekk innboksen (og søppelpost).` : "Kunne ikke sende. Sjekk e-postoppsettet i Vercel.");
  }
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <button type="button" onClick={run} className="rounded-full px-4 py-1.5 text-sm font-semibold text-primary ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
        Send test av kjøpsbekreftelsen til meg
      </button>
      {msg && <span className="text-sm text-slate-600">{msg}</span>}
    </div>
  );
}
