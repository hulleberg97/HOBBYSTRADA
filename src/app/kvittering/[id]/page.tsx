import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser, isAdmin } from "@/lib/auth";
import { COMPANY } from "@/lib/company";
import { formatPrice } from "@/lib/format";
import { getInvoice, invoiceDate } from "@/lib/invoice";
import { adminClient } from "@/lib/supabase-admin";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = { title: "Kvittering", robots: { index: false } };

/** Salgsdokument for et betalt annonseløft. Vises for kjøperen og for admin. Kan skrives ut eller lagres som PDF. */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = adminClient();
  const user = await getUser();
  if (!db || !user) notFound();
  const inv = await getInvoice(db, id);
  if (!inv || (inv.userId !== user.id && !isAdmin(user))) notFound();
  const row = "flex justify-between gap-6 py-2";
  return (
    <div className="min-h-screen bg-background print:bg-white">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link href="/account?fane=konto" className="text-sm text-slate-600 underline underline-offset-2">
            ← Min side
          </Link>
          <PrintButton />
        </div>
        <article className="rounded-3xl bg-white p-8 ring-1 ring-slate-200 print:p-0 print:ring-0 sm:p-10">
          <header className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-200 pb-6">
            <div>
              <p className="font-heading text-2xl font-bold tracking-tight text-slate-950">Kvittering</p>
              <p className="mt-1 text-sm text-slate-600">Salgsdokument nr. {inv.no ?? "–"}</p>
            </div>
            <div className="text-right text-sm text-slate-600">
              <p className="font-semibold text-slate-950">{COMPANY.name}</p>
              <p>Org.nr. {COMPANY.orgnr}</p>
              <p>{COMPANY.street}</p>
              <p>{COMPANY.postal}</p>
              <p>{COMPANY.email}</p>
            </div>
          </header>
          <dl className="mt-6 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Kjøper</dt>
              <dd className="font-medium text-slate-950">{inv.buyerName}</dd>
              {inv.buyerEmail && <dd className="text-slate-600">{inv.buyerEmail}</dd>}
            </div>
            <div>
              <dt className="text-slate-500">Dato for betaling og levering</dt>
              <dd className="font-medium text-slate-950">{invoiceDate(inv.paidAt)}</dd>
              <dd className="text-slate-600">Betalt med Vipps. Levert på hobbystrada.no.</dd>
            </div>
          </dl>
          <table className="mt-8 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="pb-2 font-medium">Ytelse</th>
                <th className="pb-2 text-right font-medium">Beløp</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3">
                  <p className="font-medium text-slate-950">Annonseløft: {inv.plan}</p>
                  <p className="text-slate-600">
                    {inv.days} dager, for annonsen «{inv.listingTitle}»
                  </p>
                </td>
                <td className="py-3 text-right font-medium text-slate-950">{formatPrice(inv.amount)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className={`${row} font-semibold text-slate-950`}>Totalt betalt</td>
                <td className="py-2 text-right font-heading text-lg font-bold text-slate-950">{formatPrice(inv.amount)}</td>
              </tr>
            </tfoot>
          </table>
          <p className="mt-6 text-xs text-slate-500">
            Beløpet er uten merverdiavgift. {COMPANY.name} er ikke registrert i Merverdiavgiftsregisteret. Betalingen er gjennomført i sin helhet, ingen
            forfall. Angrerett: tjenesten ble levert straks etter at du ba om det, og angreretten falt bort (se salgsvilkårene).
          </p>
        </article>
      </div>
    </div>
  );
}
