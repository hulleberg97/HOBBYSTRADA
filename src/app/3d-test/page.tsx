import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { CardStage3D, type StageCard } from "@/components/CardStage3D";
import { HeroFan, fanCards } from "@/components/HeroFan";
import { getListings, newest } from "@/lib/listings";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "3D-test", robots: { index: false, follow: false } };
export const revalidate = 60;

/** Testside for 3D-kortene. Ikke lenket fra noe sted. */
export default async function Page() {
  const all = await getListings();
  const pinned = all.filter((l) => l.fanSlot);
  const paid = all.filter((l) => l.frontpage);
  const fill = [...newest(all.filter((l) => l.image)), ...newest(all.filter((l) => !l.image))].slice(0, 10);
  const cards: StageCard[] = fanCards(pinned, paid, fill).map((l) => ({
    slug: l.slug,
    title: l.title,
    image: l.image,
    set: l.set ?? "",
    player: l.player,
    number: l.cardNumber ?? "",
    type: l.types[0] ?? "",
    price: formatPrice(l.price).replace(",00", ""),
    grade: l.grading && !/ugradert|raw/i.test(l.grading) ? l.grading : "",
  }));
  const fallback = <HeroFan pinned={pinned} paid={paid} fill={fill} />;
  const buttons = (center: boolean) => (
    <div className={`mt-8 flex flex-wrap justify-center gap-3 ${center ? "" : "lg:justify-start"}`}>
      <Link className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-primary" href="/products">
        Se alle annonser
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </Link>
      <Link className="inline-flex h-12 items-center rounded-full px-6 text-sm font-semibold text-white ring-1 ring-inset ring-white/35" href="/sell">
        Legg ut annonse
      </Link>
    </div>
  );

  return (
    <div className="bg-background pb-20">
      <p className="mx-auto max-w-[1320px] px-4 pt-6 text-sm font-semibold text-slate-600 sm:px-6 lg:px-8">Variant A · som forsiden i dag, med 3D-kort</p>
      <section className="mx-auto max-w-[1320px] px-4 pt-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[20px] bg-[radial-gradient(120%_120%_at_85%_10%,hsl(var(--ink-soft))_0%,hsl(var(--ink-raised))_45%,hsl(var(--ink))_100%)] text-white sm:rounded-[28px]">
          <div className="relative grid items-center gap-2 px-6 pt-10 sm:px-10 sm:pt-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-0 lg:py-10 lg:pl-16 lg:pr-4">
            <div className="min-w-0 text-center lg:text-left">
              <h1 className="font-heading text-[clamp(2.2rem,4.8vw,4.25rem)] font-bold leading-[0.95] tracking-[-0.04em]">
                Fotballkort.
                <br />
                <span className="text-gold-light">Kjøp og selg.</span>
              </h1>
              <p className="mt-5 text-[15px] leading-relaxed text-white/85 sm:text-lg">Markedsplassen for fotballkort.</p>
              {buttons(false)}
            </div>
            <CardStage3D cards={cards} fallback={fallback} />
          </div>
        </div>
      </section>

      <p className="mx-auto max-w-[1320px] px-4 pt-12 text-sm font-semibold text-slate-600 sm:px-6 lg:px-8">
        Variant B · «studio» i full bredde, som i videoen
      </p>
      <section className="mx-auto max-w-[1320px] px-4 pt-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[20px] bg-[radial-gradient(70%_55%_at_50%_0%,#22355a_0%,#0b1426_70%)] text-white sm:rounded-[28px]">
          <div className="relative px-6 pt-12 text-center sm:pt-16">
            <h2 className="font-heading text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.04em]">
              Fotballkort. <span className="text-gold-light">Kjøp og selg.</span>
            </h2>
            <p className="mt-4 text-[15px] text-white/80 sm:text-lg">Markedsplassen for fotballkort.</p>
            {buttons(true)}
          </div>
          <div className="mt-2">
            <CardStage3D cards={cards} fallback={fallback} />
          </div>
        </div>
      </section>
      <p className="mx-auto mt-6 max-w-[1320px] px-4 text-sm text-slate-600 sm:px-6 lg:px-8">
        Tips: hold musen over et kort for å løfte det, dra for å snurre, og scroll for å gi fart. Trykk på et kort for å åpne annonsen.
      </p>
    </div>
  );
}
