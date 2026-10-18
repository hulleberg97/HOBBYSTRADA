import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser, isAdmin } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";
import { fromRow } from "@/lib/listings";
import { BOOSTS, type BoostKey } from "@/lib/boosts";
import { hasVipps } from "@/lib/vipps";
import { formatPrice } from "@/lib/format";
import { ListingActions, MarkPaid, ResolveReport } from "@/components/ListingActions";
import { OwnerListingRow } from "@/components/OwnerListingRow";

export const metadata: Metadata = { title: "Administrasjon", robots: { index: false } };
export const dynamic = "force-dynamic";

const date = (d: string) => new Date(d).toLocaleString("nb-NO", { dateStyle: "medium", timeStyle: "short" });

export default async function AdminPage() {
  const user = await getUser();
  const db = adminClient();
  if (!db || !isAdmin(user)) notFound();

  const [{ data: pending }, { data: orders }, { data: messages }, { data: contact }, { data: all }] = await Promise.all([
    db.from("listings").select("*").eq("status", "pending").order("created_at"),
    db.from("boost_orders").select("*, listings(title, slug)").eq("status", "pending").order("created_at", { ascending: false }),
    db.from("messages").select("*").is("seller_id", null).order("created_at", { ascending: false }).limit(30),
    db.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(30),
    db.from("listings").select("*").in("status", ["active", "sold", "hidden"]).order("created_at", { ascending: false }),
  ]);

  const { data: reports } = await db.from("reports").select("*").eq("handled", false).order("created_at", { ascending: false });
  const { data: reported } = reports?.length
    ? await db
        .from("listings")
        .select("id, slug, title, status")
        .in("slug", [...new Set(reports.map((r) => r.listing_slug))])
    : { data: [] };

  const h2 = "font-heading text-xl font-bold tracking-tight text-slate-950";
  const empty = "mt-4 rounded-3xl bg-slate-50 p-6 text-sm text-slate-600 ring-1 ring-inset ring-slate-200";

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50/70">
        <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-slate-500">Administrasjon</p>
          <h1 className="mt-1 font-heading text-[2rem] font-bold tracking-[-0.03em] text-slate-950">Kontrollpanel</h1>
        </div>
      </section>
      <div className="mx-auto max-w-[1320px] space-y-14 px-4 pb-24 pt-10 sm:px-6 lg:px-8">
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
                        { label: "Avvis", status: "rejected", tone: "danger" },
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
                        <Link href={`/products/${l.slug}`} className="underline">
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
                      <Link href={`/products/${o.listings?.slug}`} className="underline">
                        {o.listings?.title}
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
                      <Link href={`/products/${m.listing_slug}`} className="underline">
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
                            { label: "Merk som solgt", status: "sold" },
                            { label: "Skjul", status: "hidden" },
                          ]
                        : [{ label: "Aktiver", status: "active" }]),
                      { label: "Slett", del: true, tone: "danger" as const },
                    ]}
                  />
                </OwnerListingRow>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
