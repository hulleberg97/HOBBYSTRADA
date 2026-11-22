"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Slab } from "./HeroFan";
import type { Listing } from "@/lib/types";

/** Avstanden mellom to kort i buen er 180 px, og buen bruker 3 sekunder på den. Å dra 1 px flytter buen like langt som 16,7 ms. */
const MS_PER_PX = 3000 / 180;
const RUNDE_MS = 21000;

/**
 * Buen med kort øverst på forsiden (telefon). Kortene glir av seg selv (ren CSS, se .fb-bue i globals.css).
 * Her legges berøringen oppå: et trykk åpner annonsen, og man kan dra buen sidelengs med fingeren.
 * Mens man holder står buen stille. Slipper man i fart, glir den litt videre før den går som før.
 */
/** «holder»: kortene vises i holderen med navneplate (samme som i kortraden på PC) i stedet for med hvit ramme. */
export function KortBue({ kort, holder = false }: { kort: { src: string; href: string; l: Listing }[]; holder?: boolean }) {
  const boks = useRef<HTMLDivElement>(null);
  const dra = useRef<{ start: number; sist: number; tid: number; fart: number; flyttet: boolean } | null>(null);
  const dratt = useRef(false);
  const gli = useRef(0);

  const animasjoner = () =>
    (boks.current?.getAnimations?.({ subtree: true }) ?? []).filter((a) => {
      const navn = (a as CSSAnimation).animationName;
      return navn === "fb-bue" || navn === "fb-str";
    });
  const flytt = (px: number) => {
    for (const a of animasjoner()) a.currentTime = Number(a.currentTime) - px * MS_PER_PX;
  };
  const fortsett = () => {
    // Har besøkende bedt om mindre bevegelse, blir buen stående der den ble sluppet
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (const a of animasjoner()) a.play();
  };
  useEffect(() => () => cancelAnimationFrame(gli.current), []);

  return (
    <div
      ref={boks}
      className="fb-bue"
      data-ramme={holder ? "holder" : undefined}
      aria-hidden="true"
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        cancelAnimationFrame(gli.current);
        const alle = animasjoner();
        // Ti hele runder frem endrer ikke bildet, men gir rom for å dra buen bakover uten å treffe starten
        if (alle.length && Number(alle[0].currentTime) < 5 * RUNDE_MS) for (const a of alle) a.currentTime = Number(a.currentTime) + 10 * RUNDE_MS;
        for (const a of alle) a.pause();
        dra.current = { start: e.clientX, sist: e.clientX, tid: e.timeStamp, fart: 0, flyttet: false };
        dratt.current = false;
      }}
      onPointerMove={(e) => {
        const d = dra.current;
        if (!d) return;
        if (!d.flyttet && Math.abs(e.clientX - d.start) > 6) {
          d.flyttet = true;
          dratt.current = true;
          boks.current?.setPointerCapture?.(e.pointerId);
        }
        if (!d.flyttet) return;
        const dx = e.clientX - d.sist;
        const dt = Math.max(1, e.timeStamp - d.tid);
        d.fart = 0.7 * (dx / dt) + 0.3 * d.fart;
        d.sist = e.clientX;
        d.tid = e.timeStamp;
        flytt(dx);
      }}
      onPointerUp={(e) => {
        const d = dra.current;
        dra.current = null;
        if (!d) return;
        // Sluppet i fart: buen glir videre og bremser, så går den som før
        let fart = d.flyttet && e.timeStamp - d.tid < 80 ? Math.max(-3, Math.min(3, d.fart)) : 0;
        let forrige = performance.now();
        const steg = (na: number) => {
          const dt = Math.min(40, na - forrige);
          forrige = na;
          if (Math.abs(fart) < 0.08) return fortsett();
          flytt(fart * dt);
          fart *= Math.pow(0.94, dt / 16);
          gli.current = requestAnimationFrame(steg);
        };
        gli.current = requestAnimationFrame(steg);
      }}
      onPointerCancel={() => {
        // Nettleseren tok over (siden rulles opp eller ned): buen går videre
        dra.current = null;
        fortsett();
      }}
      onClickCapture={(e) => {
        // Etter et drag skal ikke kortet under fingeren åpnes
        if (!dratt.current) return;
        dratt.current = false;
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {kort.map((k, j) => (
        <span key={j} style={{ animationDelay: `${j * 3 - 31.5}s` }}>
          <Link href={k.href} prefetch={false} tabIndex={-1} draggable={false}>
            {holder ? (
              <Slab l={k.l} eager={j === 0} lasting="eager" speil={false} eksMerke={false} />
            ) : (
              <Image src={k.src} alt="" width={300} height={420} sizes="174px" loading="eager" preload={j === 0} fetchPriority={j === 0 ? "high" : "low"} draggable={false} />
            )}
          </Link>
        </span>
      ))}
    </div>
  );
}
