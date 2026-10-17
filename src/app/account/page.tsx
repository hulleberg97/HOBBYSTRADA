import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MailIcon, PlusIcon, ZapIcon } from "lucide-react";
import { getUser, isAdmin } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";
import { fromRow } from "@/lib/listings";
import { ListingActions } from "@/components/ListingActions";
import { OwnerListingRow } from "@/components/OwnerListingRow";

export const metadata: Metadata = { title: "Min side" };
export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ loft?: string }> }) {
  const user = await getUser();
  if (!user) redirect("/auth/login?next=/account");
  const db = adminClient();
  const { data: rows } = db ? await db.from("listings").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }) : { data: [] };
  const listings = (rows ?? []).map(fromRow);
  const { data: messages } = db
    ? await db.from("messages").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }).limit(50)
    : { data: [] };
  const boosted = (await searchParams).loft === "ok";

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50/70">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-end justify-between gap-4 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div>
            <p className="text-sm font-medium text-slate-500">Min side</p>
            <h1 className="mt-1 font-heading text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-slate-950 sm:text-[44px]">Hei, {user.name}</h1>
            <p className="mt-2 text-sm text-slate-600">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isAdmin(user) && (
              <Link href="/admin" className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground">
                Administrasjon
              </Link>
            )}
            <Link
              href="/sell"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-black"
            >
              <PlusIcon className="h-4 w-4" aria-hidden="true" />
              Legg ut kort
            </Link>
            <form action="/auth/logout" method="post">
              <button className="inline-flex h-11 items-center rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-slate-500">
                Logg ut
              </button>
            </form>
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 pb-24 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
        <section>
          {boosted && (
            <p className="mb-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-inset ring-emerald-200">
              Takk! Betalingen er mottatt, og løftet er aktivert på annonsen.
            </p>
          )}
          <h2 className="font-heading text-xl font-bold tracking-tight text-slate-950">Annonsene mine</h2>
          {listings.length === 0 ? (
            <div className="mt-4 rounded-3xl bg-slate-50 px-6 py-12 text-center ring-1 ring-inset ring-slate-200">
              <p className="font-semibold text-slate-950">Du har ingen annonser ennå</p>
              <p className="mt-1 text-sm text-slate-600">Legg ut det første kortet ditt på et par minutter.</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {listings.map((l) => (
                <OwnerListingRow key={l.slug} listing={l}>
                  <ListingActions
                    id={l.id!}
                    actions={[
                      ...(l.status === "active"
                        ? [
                            { label: "Merk som solgt", status: "sold", tone: "primary" as const },
                            { label: "Skjul", status: "hidden" },
                          ]
                        : []),
                      ...(l.status === "sold" || l.status === "hidden" ? [{ label: "Aktiver igjen", status: "active" }] : []),
                      { label: "Slett", del: true, tone: "danger" as const },
                    ]}
                  />
                  {l.status === "active" && !l.featured && (
                    <Link
                      href={`/annonseloft?annonse=${l.slug}`}
                      className="inline-flex h-9 items-center gap-1 rounded-full bg-accent px-4 text-xs font-semibold text-accent-foreground"
                    >
                      <ZapIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      Løft
                    </Link>
                  )}
                </OwnerListingRow>
              ))}
            </ul>
          )}
        </section>
        <aside>
          <h2 className="font-heading text-xl font-bold tracking-tight text-slate-950">Meldinger</h2>
          {(messages ?? []).length === 0 ? (
            <p className="mt-4 rounded-3xl bg-slate-50 p-6 text-sm text-slate-600 ring-1 ring-inset ring-slate-200">
              Når kjøpere sender deg meldinger, vises de her og sendes til e-posten din.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {messages!.map((m) => (
                <li key={m.id} className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
                  <p className="text-xs text-slate-500">
                    {new Date(m.created_at).toLocaleString("nb-NO", { dateStyle: "medium", timeStyle: "short" })} ·{" "}
                    <Link href={`/products/${m.listing_slug}`} className="underline">
                      annonsen
                    </Link>
                  </p>
                  <p className="mt-1 font-semibold text-slate-950">{m.sender_name}</p>
                  <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{m.body}</p>
                  <a
                    href={`mailto:${m.sender_email}?subject=${encodeURIComponent("Svar på meldingen din")}`}
                    className="mt-3 inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold text-white"
                  >
                    <MailIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    Svar {m.sender_email}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
