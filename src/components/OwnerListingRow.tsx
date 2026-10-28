import Link from "next/link";
import { CardArt } from "./CardArt";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";

export const STATUS_LABEL: Record<string, string> = {
  pending: "Venter på godkjenning",
  active: "Aktiv",
  sold: "Solgt",
  hidden: "Skjult",
  rejected: "Avvist",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  sold: "bg-slate-100 text-slate-600 ring-slate-200",
  hidden: "bg-slate-100 text-slate-600 ring-slate-200",
  rejected: "bg-destructive/5 text-destructive ring-destructive/30",
};

export function OwnerListingRow({ listing: l, extra, children }: { listing: Listing; extra?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <li className="flex flex-col gap-4 rounded-3xl bg-white p-4 ring-1 ring-slate-200 sm:flex-row sm:items-center sm:p-5">
      <div className="h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        {l.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={l.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <CardArt listing={l} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${STATUS_STYLE[l.status]}`}>
          {STATUS_LABEL[l.status]}
        </span>
        <p className="mt-1.5 font-medium text-slate-950">
          {l.status === "active" || l.status === "sold" ? (
            <Link href={`/annonse/${l.slug}`} className="hover:underline">
              {l.title}
            </Link>
          ) : (
            l.title
          )}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-slate-950">{formatPrice(l.price)}</p>
        {extra}
      </div>
      {children}
    </li>
  );
}
