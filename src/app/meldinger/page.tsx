import { Eyebrow } from "@/components/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquareIcon } from "lucide-react";
import { getUser } from "@/lib/auth";
import { listConversations } from "@/lib/chat";
import { timeAgo } from "@/lib/format";
import { ListingThumb } from "@/components/Chat";

export const metadata: Metadata = { title: "Meldinger", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login?next=/meldinger");
  const conversations = await listConversations(user.id);

  return (
    <div>
      <section className="border-b border-slate-300/60">
        <div className="mx-auto max-w-[880px] px-4 py-10 sm:px-6 sm:py-14">
          <Eyebrow>Min side</Eyebrow>
          <h1 className="mt-3 font-heading text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-slate-950 sm:text-[44px]">Meldinger</h1>
        </div>
      </section>
      <div className="mx-auto max-w-[880px] px-4 pb-24 pt-8 sm:px-6">
        {conversations.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-14 text-center ring-1 ring-inset ring-slate-300/70">
            <MessageSquareIcon className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
            <p className="mt-3 font-semibold text-slate-950">Ingen meldinger ennå</p>
            <p className="mt-1 text-sm text-slate-600">Når du sender eller får en melding om et kort, finner du samtalen her.</p>
            <Link href="/products" className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white">
              Se kortene i markedet
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-3xl ring-1 ring-slate-200">
            {conversations.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/meldinger/${c.id}`}
                  data-unread={c.unread ? "true" : undefined}
                  className="group flex items-center gap-4 bg-white p-4 transition hover:bg-slate-50 data-[unread=true]:bg-sky-50/60 sm:p-5"
                >
                  <ListingThumb image={c.listingImage} title={c.listingTitle} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate font-semibold text-slate-950">{c.otherName}</p>
                      <span className="shrink-0 text-xs text-slate-500" suppressHydrationWarning>
                        {timeAgo(c.lastMessageAt)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-slate-500">
                      {c.role === "seller" ? "Kjøper" : "Selger"} · {c.listingTitle}
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-700 group-data-[unread=true]:font-semibold group-data-[unread=true]:text-slate-950">
                      {c.lastMessage}
                    </p>
                  </div>
                  {c.unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-sky-600" aria-label="Ulest" />}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
