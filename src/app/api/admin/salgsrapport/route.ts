import { getUser, isAdmin } from "@/lib/auth";
import { invoiceDate, listInvoices } from "@/lib/invoice";
import { adminClient } from "@/lib/supabase-admin";

/** Admin: salgsrapport som CSV (åpnes i Excel og DNB Regnskap). ?fra=2026-01-01&til=2026-12-31 avgrenser perioden. */
export async function GET(req: Request) {
  const db = adminClient();
  if (!db || !isAdmin(await getUser())) return new Response("Ingen tilgang", { status: 403 });
  const p = new URL(req.url).searchParams;
  const from = p.get("fra") || undefined;
  const to = p.get("til") ? new Date(new Date(p.get("til")!).getTime() + 864e5).toISOString().slice(0, 10) : undefined;
  const rows = await listInvoices(db, from, to);
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hobbystrada.no";
  const cell = (v: string | number | null) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    ["Nr", "Dato", "Kjøper", "E-post", "Ytelse", "Annonse", "Beløp (kr)", "Betalingsmåte", "Kvittering"].map(cell).join(";"),
    ...rows.map((r) => [r.no, invoiceDate(r.paidAt), r.buyerName, r.buyerEmail, `Annonseløft: ${r.plan} (${r.days} dager)`, r.listingTitle, r.amount.toFixed(2).replace(".", ","), "Vipps", `${site}/kvittering/${r.id}`].map(cell).join(";")),
    ["", "", "", "", "", "Sum", rows.reduce((s, r) => s + r.amount, 0).toFixed(2).replace(".", ","), "", ""].map(cell).join(";"),
  ];
  const name = `salgsrapport-hobbystrada${from ? `-${from}` : ""}${p.get("til") ? `-${p.get("til")}` : ""}.csv`;
  return new Response("﻿" + lines.join("\r\n"), { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${name}"` } });
}
