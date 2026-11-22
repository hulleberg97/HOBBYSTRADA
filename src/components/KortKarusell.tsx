"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, BadgeCheckIcon, CrownIcon, MapPinIcon, PenLineIcon, ShirtIcon, StarIcon } from "lucide-react";
import { ExampleBadge } from "./ExampleBadge";

export type KarusellKort = {
  href: string;
  src: string;
  navn: string;
  sett: string;
  pris: string;
  sted: string;
  /** Korttypen som vises med ikon («Autograf», «Autograf + Patch» …), og opplaget hvis kortet er nummerert («02/10»). Begge kan være tomme. */
  type: string;
  opplag: string;
  eksempel: boolean;
  /** Betalt plassering: «Toppannonse», «Fremhevet» eller tom. Merkes alltid med «Annonseløft» (markedsføringsloven § 8). */
  loft: string;
};

/** Ikonet følger den første korttypen, med de samme ikonene som på fanene under. */
function TypeIkon({ type }: { type: string }) {
  const cls = "h-[13px] w-[13px] shrink-0";
  if (type.startsWith("Autograf")) return <PenLineIcon className={cls} strokeWidth={1.9} aria-hidden="true" />;
  if (type.startsWith("Patch")) return <ShirtIcon className={cls} strokeWidth={1.9} aria-hidden="true" />;
  if (type.startsWith("Rookie")) return <StarIcon className={cls} strokeWidth={1.9} aria-hidden="true" />;
  if (type.startsWith("Base")) return <BadgeCheckIcon className={cls} strokeWidth={1.9} aria-hidden="true" />;
  return null;
}

/** Hvor ofte karusellen går til neste kort av seg selv, og hvor lenge den venter etter at noen har tatt på den. */
const NESTE_MS = 3400;
const VENT_MS = 7000;

/**
 * Karusellen øverst på forsiden (telefon): liggende fliser med kortet til venstre og sett, navn, pris og sted til høyre.
 * Hele flisen er en lenke til annonsen. Raden er en vanlig sidelengs rulleliste, så den sveipes med fingeren som ellers på telefonen.
 * Den går også til neste flis av seg selv, og venter når noen har tatt på den.
 */
/** «lat»: karusellen står lenger ned på siden, så bildene hentes først når den nærmer seg skjermen. */
export function KortKarusell({ kort, lat = false }: { kort: KarusellKort[]; lat?: boolean }) {
  const rad = useRef<HTMLDivElement>(null);
  const [aktiv, setAktiv] = useState(0);

  useEffect(() => {
    const el = rad.current;
    if (!el) return;
    // Flisen som står fremme er tydelig, naboene er dempet
    const ser = new IntersectionObserver(
      (treff) => {
        for (const t of treff) if (t.isIntersecting) setAktiv(Number((t.target as HTMLElement).dataset.nr));
      },
      { root: el, threshold: 0.8 },
    );
    for (const f of el.children) ser.observe(f);

    let vent = 0;
    const tatt = () => {
      vent = Date.now() + VENT_MS;
    };
    el.addEventListener("pointerdown", tatt, { passive: true });
    el.addEventListener("touchmove", tatt, { passive: true });
    el.addEventListener("wheel", tatt, { passive: true });
    // Har besøkende bedt om mindre bevegelse, går ikke karusellen av seg selv
    const rolig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const klokke = rolig
      ? 0
      : window.setInterval(() => {
          if (Date.now() < vent || document.hidden) return;
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          const flis = el.firstElementChild as HTMLElement | null;
          if (!flis) return;
          const slutt = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
          el.scrollTo({ left: slutt ? 0 : el.scrollLeft + flis.offsetWidth + 12, behavior: "smooth" });
        }, NESTE_MS);
    return () => {
      ser.disconnect();
      window.clearInterval(klokke);
      el.removeEventListener("pointerdown", tatt);
      el.removeEventListener("touchmove", tatt);
      el.removeEventListener("wheel", tatt);
    };
  }, []);

  return (
    <div ref={rad} className="fk" role="list" aria-label="Utvalgte annonser">
      {kort.map((k, i) => (
        <Link key={k.href} href={k.href} prefetch={false} role="listitem" data-nr={i} data-aktiv={i === aktiv ? "true" : undefined} className="fk-flis" draggable={false}>
          <span className="fk-bilde">
            <Image src={k.src} alt="" width={224} height={312} sizes="112px" loading={lat ? "lazy" : "eager"} preload={!lat && i === 0} fetchPriority={!lat && i === 0 ? "high" : "low"} draggable={false} />
          </span>
          {k.eksempel && (
            <span className="fk-merke eks-rad">
              <ExampleBadge />
            </span>
          )}
          <span className="fk-tekst">
            <small>{k.sett}</small>
            <b>{k.navn}</b>
            <strong>{k.pris}</strong>
            {(k.type || k.opplag) && (
              <span className="fk-type">
                {k.type && <TypeIkon type={k.type} />}
                {k.type && <span>{k.type}</span>}
                {k.opplag && <u>{k.type ? `· ${k.opplag}` : `Opplag ${k.opplag}`}</u>}
              </span>
            )}
            {k.loft && (
              <span title={k.loft} className="mt-1.5 inline-flex items-center gap-1 self-start rounded-full bg-accent px-2 py-1 text-[11px] font-semibold text-accent-foreground">
                {k.loft === "Toppannonse" && <CrownIcon className="h-3 w-3" aria-hidden="true" />}
                Annonseløft
              </span>
            )}
            <span className="fk-bunn">
              <em>
                {k.sted && <MapPinIcon className="h-[13px] w-[13px] shrink-0" strokeWidth={1.9} aria-hidden="true" />}
                <span>{k.sted}</span>
              </em>
              <i aria-hidden="true">
                <ArrowRightIcon className="h-4 w-4" />
              </i>
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
