"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, BadgeCheckIcon, CrownIcon, MapPinIcon, PenLineIcon, ShirtIcon, StarIcon } from "lucide-react";
import { ExampleBadge } from "./ExampleBadge";
import { Slab } from "./HeroFan";
import type { KarusellKort } from "./KortKarusell";

/** Hvor ofte scenen går til neste kort av seg selv. Den stopper for godt når noen tar på den, og går ikke hvis besøkende har bedt om mindre bevegelse. */
const NESTE_MS = 3800;
/** Samme bilde brukes som kort og som fargeskjær i bakgrunnen, så nettleseren henter det bare én gang. */
const BILDE = { width: 300, height: 420, sizes: "174px" } as const;

const wrap = (d: number, n: number) => ((((d + n / 2) % n) + n) % n) - n / 2;
const mod = (i: number, n: number) => ((i % n) + n) % n;
/** Avstanden mellom to kort, i prosent av kortets bredde. */
const STEG = 78;

/**
 * Hvor et kort står når det er «d» plasser fra midten (d = 0 er kortet som er fremme).
 * Forskyvningen er i prosent av kortets egen bredde, så oppsettet følger kortstørrelsen på alle skjermer.
 */
function plass(d: number) {
  const a = Math.abs(d);
  // Nabokortene står litt inn bak kortet i midten, så hele kortet med rammen synes. Kortene to plasser unna synes bare på brede skjermer.
  const x = Math.sign(d) * (Math.min(a, 1) * STEG + Math.max(a - 1, 0) * 68);
  const skala = 1 - 0.24 * Math.min(a, 1) - 0.08 * Math.min(Math.max(a - 1, 0), 1);
  // På telefon tones kortene ut etter nabokortet. På brede skjermer (se .fs-kort i globals.css) synes også kortene to plasser unna.
  const bred = a <= 1 ? 1 : a <= 2 ? 1 - 0.45 * (a - 1) : Math.max(0, 0.55 * (3 - a));
  return {
    transform: `translateX(${x.toFixed(2)}%) scale(${skala.toFixed(4)})`,
    smal: (a <= 1 ? 1 : Math.max(0, 2 - a)).toFixed(3),
    bred: bred.toFixed(3),
    zIndex: String(Math.round(20 - a * 4)),
    dim: (0.28 * Math.min(a, 1) + 0.16 * Math.min(Math.max(a - 1, 0), 1)).toFixed(3),
  };
}

/** Ikonet følger den første korttypen, med de samme ikonene som på fanene under. */
function TypeIkon({ type }: { type: string }) {
  const cls = "h-[13px] w-[13px] shrink-0";
  if (type.startsWith("Autograf")) return <PenLineIcon className={cls} strokeWidth={1.9} aria-hidden="true" />;
  if (type.startsWith("Patch")) return <ShirtIcon className={cls} strokeWidth={1.9} aria-hidden="true" />;
  if (type.startsWith("Rookie")) return <StarIcon className={cls} strokeWidth={1.9} aria-hidden="true" />;
  if (type.startsWith("Base")) return <BadgeCheckIcon className={cls} strokeWidth={1.9} aria-hidden="true" />;
  return null;
}

/**
 * Scenen øverst på forsiden (telefon): kortene står på rekke i et panel, med kortet i midten størst.
 * Panelet tar farge etter kortet som er fremme, og feltet under viser sett, navn, pris, type og sted.
 * Raden kan dras sidelengs, et trykk på et sidekort henter det frem, og et trykk på kortet i midten eller på feltet åpner annonsen.
 */
/**
 * «apen»: uten den avrundede boksen og fargeskjæret. Kortene står rett på sidens hvite bakgrunn og går helt ut til kantene,
 * og merket «Eksempelannonse» står på hvert kort i stedet for i hjørnet av boksen.
 */
/** «holder»: kortene vises i holderen med navneplate (samme som i kortraden på PC), med «Eksempelannonse» nederst på holderen. */
export function KortScene({ kort, apen = false, holder = false }: { kort: KarusellKort[]; apen?: boolean; holder?: boolean }) {
  const n = kort.length;
  // Raden går rundt uten ende. Med færre enn fire kort gjentas de, så det alltid står et kort på hver side.
  const plasser = n >= 4 ? n : n * Math.ceil(4 / n);
  const [aktiv, setAktiv] = useState(0);
  const bane = useRef<HTMLDivElement>(null);
  const el = useRef<(HTMLAnchorElement | null)[]>([]);
  const pos = useRef(0);
  const ramme = useRef(0);
  const brukt = useRef(false);
  const dra = useRef<{ x: number; y: number; pos: number; sistX: number; tid: number; fart: number; drar: boolean; steg: number } | null>(null);
  const dratt = useRef(false);

  const tegn = (p: number) => {
    pos.current = p;
    for (let i = 0; i < plasser; i++) {
      const k = el.current[i];
      if (!k) continue;
      const s = plass(wrap(i - p, plasser));
      k.style.transform = s.transform;
      k.style.zIndex = s.zIndex;
      k.style.setProperty("--dim", s.dim);
      k.style.setProperty("--o", s.smal);
      k.style.setProperty("--o2", s.bred);
      k.style.visibility = s.bred === "0.000" ? "hidden" : "";
      k.toggleAttribute("data-fjern", s.smal === "0.000");
    }
    const naa = mod(Math.round(p), plasser) % n;
    setAktiv((f) => (f === naa ? f : naa));
  };
  const gaTil = (mal: number, ms = 420, myk = false) => {
    cancelAnimationFrame(ramme.current);
    const fra = pos.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || mal === fra) return tegn(mal);
    const start = performance.now();
    const steg = (na: number) => {
      const t = Math.min(1, (na - start) / ms);
      const e = myk ? (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) : 1 - Math.pow(1 - t, 3);
      tegn(fra + (mal - fra) * e);
      if (t < 1) ramme.current = requestAnimationFrame(steg);
    };
    ramme.current = requestAnimationFrame(steg);
  };

  useEffect(() => {
    if (plasser < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const klokke = window.setInterval(() => {
      if (brukt.current || dra.current || document.hidden) return;
      const r = bane.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) return;
      gaTil(Math.round(pos.current) + 1, 640, true);
    }, NESTE_MS);
    return () => {
      window.clearInterval(klokke);
      cancelAnimationFrame(ramme.current);
    };
    // gaTil og tegn bruker bare refs, så klokken settes opp én gang
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plasser]);

  if (!n) return null;
  const k = kort[aktiv];
  return (
    <section className="fs" data-apen={apen ? "" : undefined} data-holder={holder ? "" : undefined} aria-roledescription="karusell" aria-label="Utvalgte annonser">
      {!apen && (
        <>
          {/* Fargeskjæret: kortet som er fremme ligger uskarpt bak et lyst slør */}
          <div className="fs-farge" aria-hidden="true">
            {kort.map((x, i) => (
              <Image key={x.href} src={x.src} alt="" {...BILDE} loading="eager" fetchPriority="low" data-aktiv={i === aktiv ? "true" : undefined} />
            ))}
          </div>
          {k.eksempel && (
            <span className="fs-merke eks-rad">
              <ExampleBadge />
            </span>
          )}
        </>
      )}
      <div
        ref={bane}
        className="fs-bane"
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          cancelAnimationFrame(ramme.current);
          const b = el.current[0]?.offsetWidth ?? 150;
          dra.current = { x: e.clientX, y: e.clientY, pos: pos.current, sistX: e.clientX, tid: e.timeStamp, fart: 0, drar: false, steg: (b * STEG) / 100 };
          dratt.current = false;
        }}
        onPointerMove={(e) => {
          const d = dra.current;
          if (!d) return;
          const dx = e.clientX - d.x;
          if (!d.drar) {
            if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(e.clientY - d.y)) return;
            d.drar = true;
            dratt.current = true;
            brukt.current = true;
            bane.current?.setPointerCapture?.(e.pointerId);
          }
          const dt = Math.max(1, e.timeStamp - d.tid);
          d.fart = 0.7 * ((e.clientX - d.sistX) / dt) + 0.3 * d.fart;
          d.sistX = e.clientX;
          d.tid = e.timeStamp;
          tegn(d.pos - dx / d.steg);
        }}
        onPointerUp={(e) => {
          const d = dra.current;
          dra.current = null;
          if (!d?.drar) return;
          // Sluppet i fart: raden går ett kort videre i den retningen, ellers til nærmeste kort
          const fart = e.timeStamp - d.tid < 90 ? d.fart : 0;
          const mal = Math.abs(fart) > 0.35 ? (fart < 0 ? Math.floor(pos.current) + 1 : Math.ceil(pos.current) - 1) : Math.round(pos.current);
          gaTil(Math.max(Math.round(d.pos) - 2, Math.min(Math.round(d.pos) + 2, mal)), 380);
        }}
        onPointerCancel={() => {
          // Nettleseren tok over (siden rulles opp eller ned): raden faller på plass på nærmeste kort
          if (dra.current?.drar) gaTil(Math.round(pos.current), 300);
          dra.current = null;
        }}
        onClickCapture={(e) => {
          if (!dratt.current) return;
          dratt.current = false;
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {Array.from({ length: plasser }, (_, i) => {
          const x = kort[i % n];
          const s = plass(wrap(i, plasser));
          const kopi = i >= n;
          return (
            <Link
              key={i}
              ref={(a) => {
                el.current[i] = a;
              }}
              href={x.href}
              prefetch={false}
              draggable={false}
              className="fs-kort"
              aria-label={`${x.navn}, ${x.pris}`}
              aria-hidden={kopi ? "true" : undefined}
              tabIndex={kopi ? -1 : undefined}
              data-fjern={s.smal === "0.000" ? "" : undefined}
              style={{ transform: s.transform, zIndex: Number(s.zIndex), visibility: s.bred === "0.000" ? "hidden" : undefined, ["--dim" as string]: s.dim, ["--o" as string]: s.smal, ["--o2" as string]: s.bred }}
              onClick={(e) => {
                // Et trykk på et sidekort henter det frem. Bare kortet i midten åpner annonsen.
                const d = wrap(i - pos.current, plasser);
                if (Math.abs(d) < 0.3) return;
                e.preventDefault();
                brukt.current = true;
                gaTil(Math.round(pos.current + d));
              }}
              onFocus={() => {
                // Tastatur: kortet som får fokus hentes frem
                const d = wrap(i - pos.current, plasser);
                if (Math.abs(d) >= 0.3 && !dra.current) {
                  brukt.current = true;
                  gaTil(Math.round(pos.current + d));
                }
              }}
            >
              {holder && x.l ? (
                <Slab l={x.l} eager={i === 0} lasting="eager" speil={false} />
              ) : (
                <>
                  <Image src={x.src} alt="" {...BILDE} loading="eager" preload={i === 0} fetchPriority={i === 0 ? "high" : "low"} draggable={false} />
                  {apen && x.eksempel && (
                    <span className="fs-kortmerke eks-rad">
                      <ExampleBadge />
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>
      <Link href={k.href} prefetch={false} className="fs-info">
        <span key={aktiv} className="fs-inn">
          <span className="fs-rad">
            <small>{k.sett}</small>
            {k.sted && (
              <em>
                <MapPinIcon className="h-[13px] w-[13px] shrink-0" strokeWidth={1.9} aria-hidden="true" />
                {k.sted}
              </em>
            )}
          </span>
          <span className="fs-rad fs-hoved">
            <b>{k.navn}</b>
            <strong>{k.pris}</strong>
          </span>
          <span className="fs-rad fs-bunn">
            <span className="fs-fakta">
              {(k.type || k.opplag) && (
                <span className="fk-type">
                  {k.type && <TypeIkon type={k.type} />}
                  {k.type && <span>{k.type}</span>}
                  {k.opplag && <u>{k.type ? `· ${k.opplag}` : `Opplag ${k.opplag}`}</u>}
                </span>
              )}
              {k.loft && (
                <span title={k.loft} className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-2 py-1 text-[11px] font-semibold text-accent-foreground">
                  {k.loft === "Toppannonse" && <CrownIcon className="h-3 w-3" aria-hidden="true" />}
                  Annonseløft
                </span>
              )}
            </span>
            <i aria-hidden="true">
              <ArrowRightIcon className="h-4 w-4" />
            </i>
          </span>
        </span>
      </Link>
    </section>
  );
}
