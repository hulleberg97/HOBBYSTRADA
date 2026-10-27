import { Eyebrow, btnSecondary } from "@/components/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOutIcon, PlusIcon, ZapIcon } from "lucide-react";
import { getUser, getVerification, isAdmin } from "@/lib/auth";
import { hasVippsLogin } from "@/lib/vipps-login";
import { VerifiedBadge, VippsButton } from "@/components/VerifiedBadge";
import { adminClient } from "@/lib/supabase-admin";
import { paidBoosts, recentBoosts, settlePending } from "@/lib/settle-boost";
import { isPlaceholderEmail } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { BoostNotice } from "@/components/BoostNotice";
import { activeBoost, boostDate } from "@/lib/boosts";
import { fromRow } from "@/lib/listings";
import { ListingActions } from "@/components/ListingActions";
import { EditListing } from "@/components/EditListing";
import { SavedSearches } from "@/components/SavedSearches";
import { DeleteAccount } from "@/components/DeleteAccount";
import { OwnerListingRow } from "@/components/OwnerListingRow";
import { unreadCount } from "@/lib/chat";
import { AccountTabs } from "@/components/AccountTabs";

export const metadata: Metadata = { title: "Min side" };
export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ fane?: string }> }) {
  const tab = (await searchParams).fane ?? "annonser";
  const user = await getUser();
  if (!user) redirect("/auth/login?next=/account");
  const db = adminClient();
  const verification = await getVerification(user.id);
  // Løft som er betalt i Vipps, men ikke aktivert ennå, aktiveres her
  if (db) await settlePending(db, user.id).catch(() => 0);
  const boosted = db ? await recentBoosts(db, user.id).catch(() => []) : [];
  const { data: rows } = db ? await db.from("listings").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }) : { data: [] };
  const listings = (rows ?? []).map(fromRow);
  // Aktivt løft per annonse: navnet på det sterkeste løftet og når det varer til
  const boostOf = new Map((rows ?? []).flatMap((r) => (activeBoost(r) ? [[r.slug as string, activeBoost(r)!]] : [])));
  const until = boostDate;
  const { data: searches } = db
    ? await db.from("saved_searches").select("id, label, query").eq("user_id", user.id).order("created_at", { ascending: false })
    : { data: [] };
  const unread = await unreadCount(user.id);
  const purchases = db && tab === "konto" ? await paidBoosts(db, user.id).catch(() => []) : [];
  const email = isPlaceholderEmail(user.email) ? "Ingen e-post fra Vipps" : user.email;

  return (
    <div>
      <section className="border-b border-slate-300/60">
        <div className="mx-auto flex max-w-[880px] flex-wrap items-end justify-between gap-4 px-4 py-10 sm:px-6 sm:py-14">
          <div className="min-w-0">
            <Eyebrow>Min side</Eyebrow>
            <h1 className="mt-3 font-heading text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-slate-950 [overflow-wrap:anywhere] sm:text-[44px]">
              {/* Fornavnet holder; er navnet en e-post, brukes delen før @ */}
              Hei, {(user.fullName || user.name).includes("@") ? user.name.split("@")[0] : (user.fullName || user.name).split(" ")[0]}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              {email}
              {verification && <VerifiedBadge />}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isAdmin(user) && (
              <Link href="/admin" className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground">
                Administrasjon
              </Link>
            )}
            <Link
              href="/sell"
              className={`${listings.length === 0 ? "hidden" : "inline-flex"} h-11 md:hidden items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-black`}
            >
              <PlusIcon className="h-4 w-4" aria-hidden="true" />
              Legg ut kort
            </Link>
            <form action="/auth/logout" method="post">
              <button className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-800 ring-1 ring-inset ring-slate-300 transition hover:ring-slate-500">
                <LogOutIcon className="h-4 w-4" aria-hidden="true" />
                Logg ut
              </button>
            </form>
          </div>
        </div>
      </section>
      <AccountTabs active={tab} unread={unread} listings={listings.length} alerts={searches?.length ?? 0} />
      <div className="mx-auto max-w-[880px] px-4 pb-24 pt-8 sm:px-6">
        <BoostNotice items={boosted} />
        {hasVippsLogin() && !verification && (
          <div className="mb-8 rounded-3xl bg-white p-5 ring-1 ring-slate-300/70">
            <h2 className="font-semibold text-slate-950">Bekreft deg med Vipps</h2>
            <p className="mb-4 mt-1 text-sm text-slate-600">
              Bekreft deg med Vipps for å legge ut kort og chatte. Det tar noen sekunder, og du gjør det bare én gang.
            </p>
            <VippsButton href="/auth/vipps?next=/account" label="Bekreft med Vipps" />
          </div>
        )}
        {tab === "annonser" && (
          <section>
            <h2 className="sr-only">Annonsene mine</h2>
            {listings.length === 0 ? (
              <div className="mt-4 rounded-3xl bg-white px-6 py-12 text-center ring-1 ring-inset ring-slate-300/70">
                <p className="font-semibold text-slate-950">Du har ingen annonser ennå</p>
                <p className="mt-1 text-sm text-slate-600">Legg ut det første kortet ditt på et par minutter.</p>
                <Link
                  href="/sell"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-black"
                >
                  <PlusIcon className="h-4 w-4" aria-hidden="true" />
                  Legg ut kort
                </Link>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {listings.map((l) => (
                  <OwnerListingRow
                    key={l.slug}
                    listing={l}
                    extra={
                      l.status !== "rejected" &&
                      l.status !== "sold" && (
                        <div className="mt-2">
                          <EditListing
                            id={l.id!}
                            price={l.price}
                            location={l.location}
                            condition={l.condition}
                            description={l.description}
                            images={l.images ?? (l.image ? [l.image] : [])}
                            club={l.club}
                            league={l.league}
                          />
                        </div>
                      )
                    }
                  >
                    <ListingActions
                      id={l.id!}
                      actions={[
                        ...(l.status === "active"
                          ? [
                              { label: "Merk som solgt", status: "sold", tone: "primary" as const },
                              { label: "Skjul", status: "hidden" },
                            ]
                          : []),
                        ...(l.status === "sold" || l.status === "hidden" ? [{ label: "Legg ut igjen", status: "active" }] : []),
                        { label: "Slett", del: true, tone: "danger" as const },
                      ]}
                    />
                    {l.status === "active" && boostOf.get(l.slug) && (
                      <span className="inline-flex h-9 items-center gap-1 rounded-full bg-accent/15 px-4 text-xs font-semibold text-[#8a6a24] ring-1 ring-inset ring-accent/50">
                        <ZapIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        Aktivt løft: {boostOf.get(l.slug)!.name} til {until(boostOf.get(l.slug)!.until)}
                      </span>
                    )}
                    {l.status === "active" && !boostOf.get(l.slug) && (
                      <Link
                        href={`/annonseloft?annonse=${l.slug}`}
                        className="inline-flex h-9 items-center gap-1 rounded-full bg-accent px-4 text-xs font-semibold text-accent-foreground"
                      >
                        <ZapIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        Løft annonsen
                      </Link>
                    )}
                  </OwnerListingRow>
                ))}
              </ul>
            )}
          </section>
        )}
        {tab === "varsler" && (
          <section>
            <h2 className="font-heading text-xl font-bold tracking-tight text-slate-950">Lagrede søk</h2>
            <SavedSearches items={searches ?? []} />
          </section>
        )}
        {tab === "konto" && (
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-300/70 sm:p-6">
              <h2 className="font-heading text-xl font-bold tracking-tight text-slate-950">Kontoen din</h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-[140px_1fr]">
                <dt className="text-slate-500">Navn</dt>
                <dd className="font-medium text-slate-900">
                  {user.fullName || user.name}
                  <span className="ml-2 text-xs font-normal text-slate-500">Fra Vipps. Fornavnet vises på annonsene, hele navnet i chatten.</span>
                </dd>
                <dt className="text-slate-500">E-post</dt>
                <dd className="font-medium text-slate-900">{email}</dd>
                <dt className="text-slate-500">Sted</dt>
                <dd className="font-medium text-slate-900">{user.location || "Ikke oppgitt"}</dd>
                {/* Vises først når Vipps-innlogging er slått på */}
                {hasVippsLogin() && (
                  <>
                    <dt className="text-slate-500">Vipps</dt>
                    <dd className="font-medium text-slate-900">{verification ? "Bekreftet" : "Ikke bekreftet"}</dd>
                  </>
                )}
              </dl>
              <form action="/auth/logout" method="post" className="mt-6">
                <button className={btnSecondary}>Logg ut</button>
              </form>
            </div>
            <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-300/70 sm:p-6">
              <h2 className="font-heading text-xl font-bold tracking-tight text-slate-950">Kjøpte annonseløft</h2>
              {purchases.length === 0 ? (
                <p className="mt-2 text-sm text-slate-600">Du har ikke kjøpt annonseløft ennå.</p>
              ) : (
                <ul className="mt-3 divide-y divide-slate-100">
                  {purchases.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">
                          {p.name}{" "}
                          <span className="font-normal text-slate-500">
                            · {new Date(p.paidAt).toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Oslo" })}
                          </span>
                        </p>
                        <p className="truncate text-slate-500">
                          {p.slug ? (
                            <Link href={`/products/${p.slug}`} className="underline underline-offset-2">
                              {p.title}
                            </Link>
                          ) : (
                            p.title
                          )}
                        </p>
                      </div>
                      <p className="shrink-0 text-right font-semibold text-slate-950">
                        {formatPrice(p.amount)}
                        <Link href={`/kvittering/${p.id}`} className="block text-xs font-normal text-slate-500 underline underline-offset-2">
                          Kvittering
                        </Link>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-slate-500">Kvitteringen kan skrives ut eller lagres som PDF. Vipps-appen viser også betalingen.</p>
            </div>
            <DeleteAccount />
          </section>
        )}
      </div>
    </div>
  );
}
