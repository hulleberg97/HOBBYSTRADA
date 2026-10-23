import Link from "next/link";
import { BellIcon, CheckCircle2Icon, ClockIcon, SearchIcon, XCircleIcon, ZapIcon } from "lucide-react";
import { timeAgo } from "@/lib/format";
import type { Notification, NotificationKind } from "@/lib/notifications";

const ICON: Record<NotificationKind, { Icon: typeof BellIcon; tone: string }> = {
  approved: { Icon: CheckCircle2Icon, tone: "bg-emerald-50 text-emerald-700" },
  rejected: { Icon: XCircleIcon, tone: "bg-red-50 text-red-700" },
  boost: { Icon: ZapIcon, tone: "bg-accent/15 text-[#8a6a24]" },
  boost_expiring: { Icon: ClockIcon, tone: "bg-accent/15 text-[#8a6a24]" },
  saved_search: { Icon: SearchIcon, tone: "bg-sky-50 text-sky-700" },
};

/** Listen på Varsler-siden. Uleste har blå prikk og lys bakgrunn. */
export function NotificationList({ items }: { items: Notification[] }) {
  return (
    <>
          {items.length === 0 ? (
            <div className="rounded-3xl bg-white px-6 py-12 text-center ring-1 ring-inset ring-slate-300/70">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <BellIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-4 font-semibold text-slate-950">Ingen varsler ennå</p>
              <p className="mt-1 text-sm text-slate-600">Her får du beskjed når annonsen din blir godkjent, når løftet ditt er aktivert, og når nye kort passer søkene dine.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-300/70">
              {items.map((n) => {
                const { Icon, tone } = ICON[n.kind] ?? ICON.approved;
                const inner = (
                  <>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-3">
                        <span className="font-semibold text-slate-950">{n.title}</span>
                        {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-600" aria-label="Nytt" />}
                      </span>
                      {n.body && <span className="mt-0.5 block text-sm text-slate-700">{n.body}</span>}
                      <span className="mt-1 block text-xs text-slate-500" suppressHydrationWarning>
                        {timeAgo(n.createdAt)}
                      </span>
                    </span>
                  </>
                );
                const cls = `flex gap-4 p-4 sm:p-5 ${n.read ? "" : "bg-sky-50/40"}`;
                return (
                  <li key={n.id}>
                    {n.href ? (
                      <Link href={n.href} className={`${cls} transition hover:bg-slate-50`}>
                        {inner}
                      </Link>
                    ) : (
                      <div className={cls}>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
    </>
  );
}
