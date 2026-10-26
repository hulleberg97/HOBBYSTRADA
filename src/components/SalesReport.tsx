"use client";

import { useState } from "react";

const MONTHS = ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"];
const pad = (n: number) => String(n).padStart(2, "0");

/** Admin: last ned salgsrapport for en måned (ett trykk) eller en valgfri periode. */
export function SalesReport({ now }: { now: string }) {
  const today = new Date(now);
  const [from, setFrom] = useState(`${today.getFullYear()}-01-01`);
  const [to, setTo] = useState(`${today.getFullYear()}-12-31`);
  const input = "rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm";
  // De tre siste månedene, nyeste først
  const months = [0, 1, 2].map((back) => {
    const d = new Date(today.getFullYear(), today.getMonth() - back, 1);
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const ym = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
    return { label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, href: `/api/admin/salgsrapport?fra=${ym}-01&til=${ym}-${pad(last)}` };
  });
  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-600">Månedsrapport:</span>
        {months.map((m) => (
          <a key={m.href} href={m.href} className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-black">
            {m.label}
          </a>
        ))}
      </div>
      <form action="/api/admin/salgsrapport" method="get" className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-600">Annen periode:</span>
        <input type="date" name="fra" value={from} onChange={(e) => setFrom(e.target.value)} className={input} aria-label="Fra" />
        <input type="date" name="til" value={to} onChange={(e) => setTo(e.target.value)} className={input} aria-label="Til" />
        <button type="submit" className="rounded-full px-4 py-1.5 text-sm font-semibold text-primary ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
          Last ned CSV
        </button>
      </form>
    </div>
  );
}
