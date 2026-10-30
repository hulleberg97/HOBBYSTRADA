import type { Metadata } from "next";
import { conditionLabel } from "@/lib/conditions";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  HandCoinsIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { CardArt } from "@/components/CardArt";
import { Gallery } from "@/components/Gallery";
import { OwnerBoost } from "@/components/OwnerBoost";
import { ContactCard } from "@/components/ContactCard";
import { ListingCard } from "@/components/ListingCard";
import { getListing, getListings, getSoldListings } from "@/lib/listings";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = await getListing((await params).slug);
  if (!l) return { title: "Fant ikke annonsen" };
  return {
    title: l.title,
    description: `${l.title} – ${formatPrice(l.price)}. ${l.description.split("\n")[0]}`,
    openGraph: { title: l.title, images: l.image ? [l.image] : undefined },
    alternates: { canonical: `/annonse/${l.slug}` },
  };
}

function similar(all: Listing[], l: Listing) {
  const others = all.filter((x) => x.slug !== l.slug);
  const score = (x: Listing) =>
    Number(x.featured) * 3 + Number(x.player === l.player) * 4 + Number(x.club === l.club) * 2 + x.types.filter((t) => l.types.includes(t)).length;
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, 4);
}

export default async function ListingPage({ params }: Props) {
  const l = await getListing((await params).slug);
  if (!l) notFound();
  const [all, soldAll] = await Promise.all([getListings(), getSoldListings()]);
  const history = soldAll.filter((x) => x.slug !== l.slug && x.player === l.player).slice(0, 5);

  // «01/25» er nummereringen (kort 1 av 25), ikke kortnummeret, så det vises som «Nummerert»
  const cardNumber = l.cardNumber && l.cardNumber !== l.numbered ? l.cardNumber : null;

  // Bare felt selgeren har fylt ut vises

  const rows: [string, string | null][] = [
    ["Spiller", l.player],
    ["Klubb", [l.club, l.league].filter(Boolean).join(" · ") || null],
    ["Sett", l.set],
    ["Sesong", l.season],
    ["Kortnummer", cardNumber],
    ["Nummerert", l.numbered],
    ["Produsent", l.producer],
    ["Type", l.types.join(" / ")],
    ["Gradering", l.grading],
    ["Tilstand", conditionLabel(l.condition)],
  ];

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbystrada.vercel.app";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: l.title,
    description: l.description || l.title,
    image: l.image ? [l.image.startsWith("http") ? l.image : site + l.image] : undefined,
    brand: { "@type": "Brand", name: l.producer },
    offers: {
      "@type": "Offer",
      price: l.price,
      priceCurrency: "NOK",
      availability: l.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      url: `${site}/annonse/${l.slug}`,
    },
  };

  return (
    <div className="pb-20 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-[1320px] px-4 pb-28 pt-4 sm:px-6 lg:px-8 lg:pb-20">
        <div className="flex items-center justify-between gap-4">
          <nav aria-label="Brødsmuler" className="flex min-w-0 items-center gap-1 text-sm text-slate-500">
            <Link
              className="tap-sm mr-1 inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 font-medium text-primary hover:bg-slate-100 sm:hidden"
              href="/marked"
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
              Tilbake
            </Link>
            <Link className="hidden shrink-0 hover:text-slate-900 sm:inline" href="/">
              Forsiden
            </Link>
            <ChevronRightIcon className="hidden h-3.5 w-3.5 shrink-0 sm:block" aria-hidden="true" />
            <Link className="hidden shrink-0 hover:text-slate-900 sm:inline" href="/marked">
              Markedet
            </Link>
            <ChevronRightIcon className="hidden h-3.5 w-3.5 shrink-0 sm:block" aria-hidden="true" />
            <span className="hidden truncate text-slate-900 sm:inline">{l.player}</span>
          </nav>
        </div>
        <div className="mt-5 grid gap-8 lg:mt-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div>
              {l.images?.length ? (
                <Gallery
                  images={l.images}
                  title={l.title}
                  badges={
                    <>
                      <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-1.5">
                        {(l.featured || l.bumpedAt) && (
                          <span title={l.frontpage ? "Toppannonse" : l.featured ? "Fremhevet" : "Topp av listen"} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-sm">
                            Annonseløft
                          </span>
                        )}
                        {l.status === "sold" && <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white">Solgt</span>}
                      </div>
                      {l.grading && !/raw|ugradert/i.test(l.grading) && (
                        <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 ring-1 ring-slate-200 backdrop-blur">
                          <ShieldCheckIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                          {l.grading}
                        </span>
                      )}
                    </>
                  }
                />
              ) : (
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-slate-50 to-slate-200 ring-1 ring-inset ring-slate-200">
                  <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-1.5">
                    {(l.featured || l.bumpedAt) && (
                      <span title={l.frontpage ? "Toppannonse" : l.featured ? "Fremhevet" : "Topp av listen"} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-sm">
                        Annonseløft
                      </span>
                    )}
                    {l.status === "sold" && <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white">Solgt</span>}
                  </div>
                  {l.grading && !/raw|ugradert/i.test(l.grading) && (
                    <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 ring-1 ring-slate-200 backdrop-blur">
                      <ShieldCheckIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      {l.grading}
                    </span>
                  )}
                  <div className="px-10 pb-10 pt-16 sm:px-20 sm:pb-14 sm:pt-20">
                    <div className="mx-auto w-full max-w-[300px] sm:max-w-[340px]">
                      <div className="rounded-[18px] border border-white bg-gradient-to-br from-white via-slate-100 to-white p-3 shadow-2xl shadow-slate-900/30">
                        <div className="aspect-[5/7] overflow-hidden rounded-[10px] bg-primary">
                          <CardArt listing={l} square detail />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <p className="mt-3 text-center text-xs text-slate-500">{l.image ? "Bilde fra selger" : "Illustrasjon – annonsen har ikke bilde"}</p>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap gap-1.5">
              {l.types.map((t) => (
                <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {t}
                </span>
              ))}
            </div>
            <h1 className="mt-3 font-heading text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-slate-950 sm:text-[44px]">{l.player}</h1>
            <p className="mt-2 text-base text-slate-600 sm:text-lg">
              {l.set}
              {(l.club || l.league) && <span className="text-slate-400"> · {[l.club, l.league].filter(Boolean).join(" · ")}</span>}
            </p>
            <div className="mt-6">
              <div>
                <ContactCard listing={l} />
                <div className="mt-4 rounded-3xl bg-white p-5 ring-1 ring-inset ring-slate-300/70">
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <ShieldCheckIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                    Handle trygt
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    Du avtaler betaling og frakt direkte med selgeren. HOBBYSTRADA er ikke part i handelen, så ta noen enkle forholdsregler:
                  </p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {(
                      [
                        [EyeIcon, "Be om bilder før du betaler"],
                        [HandCoinsIcon, "Sjekk navnet før du betaler"],
                        [ShieldCheckIcon, "Vurder frakt med sporing"],
                        [MessageCircleIcon, "Hold samtalen i chatten"],
                      ] as const
                    ).map(([Icon, text]) => (
                      <li key={text} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                        <Icon className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
                {!l.featured && !l.ownerListing && l.status === "active" && <OwnerBoost slug={l.slug} ownerId={l.ownerId} />}
              </div>
            </div>
            {l.description && (
              <section className="mt-10">
                <h2 className="font-heading text-xl font-bold tracking-tight text-slate-950">Beskrivelse fra selger</h2>
                <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-slate-700">
                  {l.description
                    .split(/\n+/)
                    .filter(Boolean)
                    .map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                </div>
              </section>
            )}
            <section className="mt-10">
              <h2 className="font-heading text-xl font-bold tracking-tight text-slate-950">Kortdata</h2>
              <dl className="mt-3 overflow-hidden rounded-2xl ring-1 ring-slate-200">
                {rows
                  .filter(([, v]) => v)
                  .map(([k, v], i) => (
                    <div
                      key={k}
                      className={`grid grid-cols-[120px_1fr] gap-4 px-4 py-3 text-sm sm:grid-cols-[160px_1fr] ${i % 2 ? "bg-white" : "bg-slate-50"}`}
                    >
                      <dt className="text-slate-500">{k}</dt>
                      <dd className="font-medium text-slate-900">{v}</dd>
                    </div>
                  ))}
              </dl>
            </section>
          </div>
        </div>
        {history.length > 0 && (
          <section className="mt-16 border-t border-slate-200 pt-10 lg:mt-20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[28px]">Prishistorikk for {l.player}</h2>
                <p className="mt-1 text-sm text-slate-500">Kort av samme spiller som er solgt på HOBBYSTRADA</p>
              </div>
              <Link className="inline-flex shrink-0 items-center gap-0.5 text-sm font-medium text-slate-600 transition hover:text-primary" href="/solgt">
                Prisarkivet
                <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-6 divide-y divide-slate-100 overflow-hidden rounded-2xl ring-1 ring-slate-200">
              {history.map((h) => (
                <li key={h.slug} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-3 text-sm">
                  <Link href={`/annonse/${h.slug}`} className="min-w-0 font-medium text-slate-900 hover:underline">
                    {h.title}
                  </Link>
                  <span className="flex items-center gap-4 tabular-nums">
                    <span className="text-slate-500">
                      {new Date(h.soldAt ?? h.createdAt).toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className="font-semibold text-slate-950">{formatPrice(h.price)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="mt-16 border-t border-slate-200 pt-10 lg:mt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[28px]">Du vil kanskje også like</h2>
            </div>
            <Link className="tap inline-flex shrink-0 items-center gap-0.5 text-sm font-medium text-slate-600 transition hover:text-primary" href="/marked">
              Se alle
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-4">
            {similar(all, l).map((x) => (
              <ListingCard key={x.slug} listing={x} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return (await getListings()).map((l) => ({ slug: l.slug }));
}
