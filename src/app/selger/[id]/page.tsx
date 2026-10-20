import { Eyebrow } from "@/components/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarIcon, MapPinIcon, PackageCheckIcon, TagIcon, type LucideIcon } from "lucide-react";
import { ListingCard } from "@/components/ListingCard";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { getSellerListings } from "@/lib/listings";
import { adminClient } from "@/lib/supabase-admin";

export const revalidate = 300;

type Props = { params: Promise<{ id: string }> };

const valid = (id: string) => id === "hobbystrada" || /^[0-9a-f-]{36}$/.test(id);

async function load(id: string) {
  if (!valid(id)) return null;
  const listings = await getSellerListings(id);
  if (!listings.length) return null;
  const name = listings[0].seller;
  let since = listings.reduce((min, l) => (l.createdAt < min ? l.createdAt : min), listings[0].createdAt);
  if (id !== "hobbystrada") {
    const { data } = (await adminClient()?.auth.admin.getUserById(id)) ?? { data: null };
    if (data?.user?.created_at) since = data.user.created_at;
  }
  return { name, since, listings, verified: listings.some((l) => l.sellerVerified) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await load((await params).id);
  return s ? { title: `${s.name} – kort til salgs` } : { title: "Fant ikke selgeren" };
}

export default async function SellerPage({ params }: Props) {
  const s = await load((await params).id);
  if (!s) notFound();
  const active = s.listings.filter((l) => l.status === "active");
  const sold = s.listings.filter((l) => l.status === "sold");
  const places = [...new Set(s.listings.map((l) => l.location).filter(Boolean))];
  const facts: [LucideIcon, string][] = [
    [CalendarIcon, `Medlem siden ${new Date(s.since).toLocaleDateString("nb-NO", { month: "long", year: "numeric" })}`],
    [TagIcon, `${active.length} til salgs`],
    [PackageCheckIcon, `${sold.length} solgt`],
  ];
  if (places.length) facts.push([MapPinIcon, places.join(", ")]);

  return (
    <div>
      <section className="border-b border-slate-300/60">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-5 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-2xl font-semibold text-primary-foreground">
            {s.name[0]?.toUpperCase()}
          </span>
          <div className="min-w-0">
            <Eyebrow>Selger</Eyebrow>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-slate-950 sm:text-[40px]">{s.name}</h1>
              {s.verified && <VerifiedBadge />}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-600">
              {facts.map(([Icon, text]) => (
                <li key={text} className="inline-flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-[1320px] space-y-14 px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section>
          <h2 className="font-heading text-xl font-bold tracking-tight text-slate-950">Til salgs ({active.length})</h2>
          {active.length ? (
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
              {active.map((l) => (
                <ListingCard key={l.slug} listing={l} variant="market" />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">Selgeren har ingen kort til salgs akkurat nå.</p>
          )}
        </section>
        {sold.length > 0 && (
          <section>
            <h2 className="font-heading text-xl font-bold tracking-tight text-slate-950">Solgt ({sold.length})</h2>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 opacity-80 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
              {sold.map((l) => (
                <ListingCard key={l.slug} listing={l} variant="market" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
