import { Eyebrow } from "@/components/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser, isAdmin } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";
import { fromRow } from "@/lib/listings";
import { BOOSTS, type BoostKey } from "@/lib/boosts";
import { hasVipps } from "@/lib/vipps";
import { settlePending } from "@/lib/settle-boost";
import { formatPrice } from "@/lib/format";
import { ListingActions, MarkPaid, ResolveReport } from "@/components/ListingActions";
import { BlockUser } from "@/components/BlockUser";
import { Unblock } from "@/components/Unblock";
import { SalesReport } from "@/components/SalesReport";
import { TestMail } from "@/components/TestMail";
import { RyddTestdata } from "@/components/RyddTestdata";
import { sitePassword } from "@/lib/private";
import { invoiceDate, listInvoices } from "@/lib/invoice";
import { OwnerListingRow } from "@/components/OwnerListingRow";
import { FanSlotSelect } from "@/components/FanSlotSelect";
import { ForsideMeny, type ForsideKort } from "@/components/ForsideMeny";
import { frontpageRow, rowLabel } from "@/lib/frontpage-row";

export const metadata: Metadata = { title: "Administrasjon", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Dato n dager tilbake, som ÅÅÅÅ-MM-DD. Egen funksjon, så Date.now() ikke kalles under rendering. */
function since90(days = 90) {
  return new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
}
const date = (d: string) => new Date(d).toLocaleString("nb-NO", { dateStyle: "medium", timeStyle: "short" });

export default async function AdminPage() {
  const user = await getUser();
  const db = adminClient();
  if (!db || !isAdmin(user)) notFound();
  // Betalte løft aktiveres før listen hentes, så bare ekte ubetalte bestillinger vises
  await settlePending(db).catch(() => 0);

  const [{ data: pending }, { data: orders }, { data: messages }, { data: contact }, { data: all }] = await Promise.all([
    db.from("listings").select("*").eq("status", "pending").order("created_at"),
    db.from("boost_orders").select("*, listings(title, slug)").eq("status", "pending").order("created_at", { ascending: false }),
    db.from("messages").select("*").is("seller_id", null).order("created_at", { ascending: false }).limit(30),
    db.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(30),
    db.from("listings").select("*").in("status", ["active", "sold", "hidden"]).order("created_at", { ascending: false }),
  ]);

  const sales = await listInvoices(db, since90());
  // Forsiden: raden slik den vises nå, og alle aktive annonser som kan velges
  const aktive = (all ?? []).filter((r) => r.status === "active").map(fromRow);
  const kort = (l: (typeof aktive)[number]): ForsideKort => ({
    id: l.id!,
    slug: l.slug,
    title: l.title,
    image: l.image,
    fanSlot: l.fanSlot ?? null,
    label: rowLabel(l),
    isExample: Boolean(l.isExample),
  });
  const forsideRad = frontpageRow(aktive).map(kort);
  const forsideKort = aktive.map(kort);
  // Før lansering: andre kontoer enn admin, så testkontoer kan slettes fra admin
  const { data: users } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const kontoer = (users?.users ?? [])
    .filter((u) => u.id !== user!.id)
    .map((u) => ({
      id: u.id,
      email: u.email ?? "",
      name: String(u.user_metadata?.name ?? u.user_metadata?.username ?? ""),
      created: new Date(u.created_at).toLocaleDateString("nb-NO"),
      listings: (all ?? []).filter((l) => l.owner_id === u.id).length,
    }));
  // Samtaler og bud som finnes på eksempelannonser. Vises til gjennomsyn; de slettes ikke, og kan ikke føre til salg.
  const exampleSlugs = (all ?? []).filter((r) => r.owner_listing).map((r) => r.slug as string);
  const { data: exampleChats } = exampleSlugs.length
    ? await db.from("conversations").select("id, listing_slug, listing_title, buyer_name, accepted_offer, last_message_at").in("listing_slug", exampleSlugs).order("last_message_at", { ascending: false })
    : { data: [] };
  const { data: blocked } = await db.from("blocked_users").select("vipps_sub, rule, blocked_at, user_id, delete_after").not("user_id", "is", null).order("blocked_at", { ascending: false });
  const blockedNames = new Map<string, string>();
  for (const b of blocked ?? []) {
    const { data: u } = await db.auth.admin.getUserById(b.user_id as string);
    blockedNames.set(b.vipps_sub as string, (u.user?.user_metadata?.name as string) || u.user?.email || "Ukjent");
  }
  const { data: reports } = await db.from("reports").select("*").eq("handled", false).order("created_at", { ascending: false });
  const { data: reported } = reports?.length
    ? await db
        .from("listings")
        .select("id, slug, title, status")
        .in("slug", [...new Set(reports.map((r) => r.listing_slug))])
    : { data: [] };

  const h2 = "font-heading text-xl font-bold tracking-tight text-slate-950";
  const empty = "mt-4 rounded-3xl bg-white p-6 text-sm text-slate-600 ring-1 ring-inset ring-slate-300/70";

  return (
    <div>
      <section className="border-b border-slate-300/60">
        <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8">
          <Eyebrow>Administrasjon</Eyebrow>
          <h1 className="mt-3 font-heading text-[2rem] font-bold tracking-[-0.03em] text-slate-950">Kontrollpanel</h1>
        </div>
      </section>
      <div className="mx-auto max-w-[1320px] space-y-14 px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section>
          <h2 className={h2}>Forsiden</h2>
          <p className="mt-1 text-sm text-slate-600">Velg hvilke kort som vises på forsiden. Toppannonser og fremhevede annonser vises alltid først. Endringer vises med en gang.</p>
          <div className="mt-4">
            <ForsideMeny row={forsideRad} listings={forsideKort} />
          </div>
        </section>
        <section>
          <h2 className={h2}>Venter på godkjenning ({pending?.length ?? 0})</h2>
          {!pending?.length ? (
            <p className={empty}>Ingen nye annonser.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pending.map((r) => {
                const l = fromRow(r);
                return (
                  <OwnerListingRow
                    key={l.slug}
                    listing={l}
                    extra={
                      <div className="mt-2 space-y-1 text-xs text-slate-600">
                        <p>
                          {l.seller} · {l.location} · {r.contact_name} · {r.contact_email} {r.contact_phone && `· ${r.contact_phone}`}
                        </p>
                        {l.description && <p className="whitespace-pre-line">{l.description}</p>}
                        {(l.images?.length ?? 0) > 1 && (
                          <div className="flex gap-2 pt-1">
                            {l.images!.map((src) => (
                              <a key={src} href={src} target="_blank" rel="noopener" className="block h-14 w-10 overflow-hidden rounded ring-1 ring-slate-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={src} alt="" className="h-full w-full object-cover" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    }
                  >
                    <ListingActions
                      id={l.id!}
                      actions={[
                        { label: "Godkjenn", status: "active", tone: "primary" },
                        {
                          label: "Avvis",
                          status: "rejected",
                          tone: "danger",
                          reasons: [
                            "Bildene viser ikke kortet tydelig",
                            "Mangler eller har feil opplysninger om kortet",
                            "Ikke et fotballkort",
                            "Mistanke om falskt eller kopiert kort",
                            "Bryter annonsereglene",
                          ],
                        },
                      ]}
                    />
                  </OwnerListingRow>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <h2 className={h2}>Rapporterte annonser ({reports?.length ?? 0})</h2>
          {!reports?.length ? (
            <p className={empty}>Ingen nye rapporter.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {reports.map((r) => {
                const l = reported?.find((x) => x.slug === r.listing_slug);
                return (
                  <li key={r.id} className="rounded-3xl bg-white p-5 text-sm ring-1 ring-slate-200">
                    <p className="text-xs text-slate-500">
                      {date(r.created_at)}{" "}
                      {r.reporter_email && (
                        <>
                          ·{" "}
                          <a href={`mailto:${r.reporter_email}`} className="underline">
                            {r.reporter_email}
                          </a>
                        </>
                      )}
                    </p>
                    <p className="mt-1 font-semibold text-slate-950">{r.reason}</p>
                    <p className="mt-0.5">
                      {l ? (
                        <Link href={`/annonse/${l.slug}`} className="underline">
                          {l.title}
                        </Link>
                      ) : (
                        <span className="text-slate-500">Annonsen er slettet</span>
                      )}
                      {l && l.status !== "active" && <span className="ml-2 text-xs text-slate-500">({l.status === "hidden" ? "skjult" : l.status})</span>}
                    </p>
                    {r.details && <p className="mt-2 whitespace-pre-line text-slate-700">{r.details}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {l && l.status === "active" && <ListingActions id={l.id} actions={[{ label: "Skjul annonsen", status: "hidden", tone: "danger" }]} />}
                      <ResolveReport id={r.id} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <h2 className={h2}>Bestilte annonseløft ({orders?.length ?? 0})</h2>
          {!orders?.length ? (
            <p className={empty}>Ingen ubetalte bestillinger.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-5 ring-1 ring-slate-200">
                  <div>
                    <p className="font-semibold text-slate-950">
                      {BOOSTS[o.plan as BoostKey].name} – {formatPrice(Number(o.amount))}
                    </p>
                    <p className="text-sm text-slate-600">
                      <Link href={`/annonse/${o.listings?.slug}`} className="underline">
                        {o.listings?.title ?? o.listing_title ?? "Slettet annonse"}
                      </Link>{" "}
                      · {o.buyer_email} · {date(o.created_at)}
                    </p>
                  </div>
                  <MarkPaid id={o.id} vipps={hasVipps()} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid gap-10 lg:grid-cols-2">
          <section>
            <h2 className={h2}>Meldinger til HOBBYSTRADA-annonser</h2>
            {!messages?.length ? (
              <p className={empty}>Ingen meldinger.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {messages.map((m) => (
                  <li key={m.id} className="rounded-3xl bg-white p-5 text-sm ring-1 ring-slate-200">
                    <p className="text-xs text-slate-500">
                      {date(m.created_at)} ·{" "}
                      <Link href={`/annonse/${m.listing_slug}`} className="underline">
                        annonsen
                      </Link>
                    </p>
                    <p className="mt-1 font-semibold">
                      {m.sender_name} ·{" "}
                      <a href={`mailto:${m.sender_email}`} className="underline">
                        {m.sender_email}
                      </a>
                    </p>
                    <p className="mt-2 whitespace-pre-line text-slate-700">{m.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className={h2}>Kontaktskjema</h2>
            {!contact?.length ? (
              <p className={empty}>Ingen henvendelser.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {contact.map((m) => (
                  <li key={m.id} className="rounded-3xl bg-white p-5 text-sm ring-1 ring-slate-200">
                    <p className="text-xs text-slate-500">
                      {date(m.created_at)} · {m.topic}
                    </p>
                    <p className="mt-1 font-semibold">
                      {m.name} ·{" "}
                      <a href={`mailto:${m.email}`} className="underline">
                        {m.email}
                      </a>
                    </p>
                    <p className="mt-2 whitespace-pre-line text-slate-700">{m.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {(blocked?.length ?? 0) > 0 && (
          <section>
            <h2 className={h2}>Utestengte brukere ({blocked!.length})</h2>
            <p className="mt-1 text-sm text-slate-600">Kontoen er sperret og annonsene skjult. Slettes automatisk på datoen under, med mindre en klage får medhold.</p>
            <ul className="mt-4 divide-y divide-slate-100 rounded-3xl bg-white px-5 ring-1 ring-slate-200">
              {blocked!.map((b) => (
                <li key={b.vipps_sub as string} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                  <span className="font-medium text-slate-900">{blockedNames.get(b.vipps_sub as string)}</span>
                  <span className="text-slate-600">{b.rule as string}</span>
                  <span className="text-slate-500">
                    Stengt {date(b.blocked_at as string)} · slettes {date(b.delete_after as string)}
                  </span>
                  <Unblock vippsSub={b.vipps_sub as string} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className={h2}>Salg siste 90 dager ({sales.length})</h2>
          <p className="mt-1 text-sm text-slate-600">Hvert betalt løft får et fortløpende salgsdokumentnummer. Rapporten under er til regnskapet, og hver rad har lenke til kvitteringen.</p>
          <SalesReport now={since90(0)} />
          <TestMail />
          {sitePassword() && <RyddTestdata kontoer={kontoer} />}
          {sales.length > 0 && (
            <ul className="mt-4 divide-y divide-slate-100 rounded-3xl bg-white px-5 ring-1 ring-slate-200">
              {sales.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                  <span className="text-slate-500">#{r.no ?? "–"}</span>
                  <span className="text-slate-600">{invoiceDate(r.paidAt)}</span>
                  <span className="min-w-0 flex-1 truncate font-medium text-slate-900">
                    {r.buyerName} · {r.plan} · {r.listingTitle}
                  </span>
                  <span className="font-semibold text-slate-950">{formatPrice(r.amount)}</span>
                  <a href={`/kvittering/${r.id}`} className="text-xs underline underline-offset-2">
                    Kvittering
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className={h2}>Samtaler om eksempelannonser ({exampleChats?.length ?? 0})</h2>
          <p className="mt-1 text-sm text-slate-600">Eksempelannonser er ikke til salgs. Disse samtalene kan ikke føre til salg, og listes bare til gjennomsyn.</p>
          {!exampleChats?.length ? (
            <p className={empty}>Ingen samtaler om eksempelannonser.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-200 rounded-2xl ring-1 ring-slate-200">
              {exampleChats.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                  <span className="min-w-0 flex-1 truncate font-medium text-slate-900">{c.listing_title}</span>
                  <span className="text-slate-600">{c.buyer_name}</span>
                  {c.accepted_offer != null && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">Godtatt bud: {formatPrice(Number(c.accepted_offer))}</span>}
                  <span className="text-xs text-slate-500">{date(c.last_message_at)}</span>
                  <Link href={`/meldinger/${c.id}`} className="text-xs underline underline-offset-2">
                    Åpne
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2 className={h2}>Alle annonser ({all?.length ?? 0})</h2>
          <ul className="mt-4 space-y-3">
            {(all ?? []).map((r) => {
              const l = fromRow(r);
              return (
                <OwnerListingRow key={l.slug} listing={l} extra={<p className="mt-1 text-xs text-slate-500">{r.contact_email ?? "HOBBYSTRADA"}</p>}>
                  <ListingActions
                    id={l.id!}
                    actions={[
                      ...(l.status === "active"
                        ? [
                            ...(l.isExample ? [] : [{ label: "Merk som solgt", status: "sold" }]),
                            { label: "Skjul", status: "hidden" },
                          ]
                        : [{ label: "Aktiver", status: "active" }]),
                      { label: "Slett", del: true, tone: "danger" as const },
                    ]}
                  />
                  {l.status === "active" && <FanSlotSelect id={l.id!} on={Boolean(l.fanSlot)} />}
                  {l.status === "active" && (
                    <a href={`/api/admin/ig/${l.slug}`} className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                      Instagram-bilde
                    </a>
                  )}
                  {r.owner_id && <BlockUser listingId={l.id!} seller={l.seller} />}
                </OwnerListingRow>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
