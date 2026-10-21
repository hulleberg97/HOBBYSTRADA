import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { HeroFan } from "@/components/HeroFan";
import { Annonseloft, Kategorier, Nyeste, SlikFungerer, TryggHandel, Utvalgte, forsideData } from "@/components/forside/Seksjoner";

export const revalidate = 60;

export default async function Home() {
  const { all, featured, latest, c, fanList } = await forsideData();
  return (
    <div className="bg-background">
      <section className="bg-background">
        <div className="mx-auto max-w-[1320px] sm:px-6 sm:pt-6 lg:px-8">
          <div
            id="hero"
            data-oppsett="vifte"
            data-tekst="5"
            data-farge="lys"
            className="hero-bg relative overflow-hidden text-white sm:rounded-[28px]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,hsl(var(--accent))_50%,transparent)] opacity-60"
            ></div>
            <div className="hero-grid relative grid items-center gap-2 px-6 pt-10 sm:px-10 sm:pt-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-0 lg:py-10 lg:pl-16 lg:pr-4">
              <div className="hero-text min-w-0">
                {/* Antallet vises først når det er stort nok til å imponere */}
                {all.length >= 20 && (
                  <p className="hero-badge mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85 ring-1 ring-inset ring-white/15">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
                    {all.length} aktive annonser nå
                  </p>
                )}
                <p className="hero-title font-heading text-[clamp(2.2rem,4.8vw,4.25rem)] font-bold leading-[0.95] tracking-[-0.04em]">
                  Fotballkort.
                  <br className="hero-br" /> <span className="hero-gold text-gold-light">Kjøp og selg.</span>
                </p>
                {/* Overskriften som vises over vifta er sidens h1 */}
                <h1 className="hero-sub mt-5 max-w-md text-[15px] leading-relaxed text-white/85 sm:text-lg">
                  <span>
                    Kjøp og selg <span className="hero-accent">fotballkort</span>
                    <span className="tittel-under">Norges markedsplass for samlere</span>
                  </span>
                </h1>
                <div className="hero-buttons mt-7 flex gap-2.5 sm:mt-8 sm:gap-3">
                  <Link
                    className="hero-primary inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 text-[13px] font-semibold text-primary transition hover:bg-gold-light sm:h-12 sm:px-6 sm:text-sm"
                    href="/products"
                  >
                    Se alle annonser
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    className="hero-ghost inline-flex h-11 items-center whitespace-nowrap rounded-full px-5 text-[13px] font-semibold text-white ring-1 ring-inset ring-white/35 transition hover:bg-white/10 sm:h-12 sm:px-6 sm:text-sm"
                    href="/sell"
                  >
                    Legg ut kort
                  </Link>
                </div>
              </div>
              <div className="mt-10 sm:mt-6 lg:mt-0">
                <HeroFan cards={fanList} />
              </div>
            </div>
            {/* Kortene som glir ut til høyre tones inn i bakgrunnen i stedet for å kuttes av kanten */}
            <div
              aria-hidden="true"
              className="hero-edge pointer-events-none absolute inset-y-0 right-0 z-[300] hidden w-28 bg-[linear-gradient(90deg,transparent,#0b1830_85%)] lg:block"
            ></div>
          </div>
        </div>
      </section>
      <Kategorier c={c} />
      <Utvalgte featured={featured} />
      <Nyeste latest={latest} />
      <SlikFungerer />
      <TryggHandel />
      <Annonseloft />
    </div>
  );
}
