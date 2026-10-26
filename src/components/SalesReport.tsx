"use client";

import { useState } from "react";

/** Admin: last ned salgsrapport for en periode. */
export function SalesReport() {
  const y = new Date().getFullYear();
  const [from, setFrom] = useState(`${y}-01-01`);
  const [to, setTo] = useState(`${y}-12-31`);
  const input = "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm";
  return (
    <form action="/api/admin/salgsrapport" method="get" className="mt-4 flex flex-wrap items-center gap-2">
      <label className="text-sm text-slate-600">Fra</label>
      <input type="date" name="fra" value={from} onChange={(e) => setFrom(e.target.value)} className={input} />
      <label className="text-sm text-slate-600">Til</label>
      <input type="date" name="til" value={to} onChange={(e) => setTo(e.target.value)} className={input} />
      <button type="submit" className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-black">
        Last ned CSV
      </button>
    </form>
  );
}
