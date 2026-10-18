"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CrownIcon } from "lucide-react";
import { CardArt } from "./CardArt";
import type { Listing } from "@/lib/types";

const POSITIONS = [
  { x: "-88%", y: "34px", r: "-16deg", z: 1 },
  { x: "-46%", y: "10px", r: "-8deg", z: 2 },
  { x: "0%", y: "0px", r: "0deg", z: 5 },
  { x: "46%", y: "10px", r: "8deg", z: 3 },
  { x: "88%", y: "34px", r: "16deg", z: 1 },
];
const ROTATE_MS = 7000;
const SPIN_MS = 4000;
// Karusellen: midten → høyre → ytterst høyre → (bak) ytterst venstre → venstre → midten
const CYCLE = [2, 3, 4, 0, 1];

/** Fem kort i rangering (1 = midten, 2 venstre, 3 høyre, 4 og 5 ytterst). Tomme plasser hoppes over. */
export function pickFan(ranked: (Listing | undefined)[]) {
  const [first, second, third, fourth, fifth] = ranked;
  return [fourth, second, first, third, fifth].flatMap((l, slot) => (l ? [{ listing: l, slot }] : []));
}

/**
 * Kortvifta på forsiden. Kort admin har festet står på sin faste plass. Toppannonser har plass hele perioden;
 * er de flere enn de ledige plassene, roterer de. Resten fylles med de nyeste annonsene.
 */
export function HeroFan({ pinned, paid, fill }: { pinned: Listing[]; paid: Listing[]; fill: Listing[] }) {
  const [offset, setOffset] = useState(0);
  const [turn, setTurn] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setTurn((n) => n + 1), SPIN_MS);
    return () => clearInterval(t);
  }, [paused]);
  const free = 5 - pinned.length;
  const rotating = free > 0 && paid.length > free;
  useEffect(() => {
    if (!rotating) return;
    const t = setInterval(() => setOffset((o) => (o + 1) % paid.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [rotating, paid.length]);

  const taken = new Set(pinned.map((l) => l.slug));
  const candidates = rotating
    ? Array.from({ length: free }, (_, i) => paid[(offset + i) % paid.length])
    : [...paid, ...fill].filter((l, i, all) => !taken.has(l.slug) && all.findIndex((x) => x.slug === l.slug) === i);
  const ranked: (Listing | undefined)[] = Array(5).fill(undefined);
  for (const l of pinned) if (l.fanSlot) ranked[l.fanSlot - 1] = l;
  for (let i = 0; i < 5; i++) if (!ranked[i]) ranked[i] = candidates.shift();

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative mx-auto h-[280px] w-full max-w-[520px] sm:h-[400px] lg:h-[480px] lg:max-w-[600px]"
    >
      {pickFan(ranked).map(({ listing: l, slot: home }) => {
        const step = (CYCLE.indexOf(home) + turn) % 5;
        const slot = CYCLE[step];
        const p = POSITIONS[slot];
        // Kortet som går fra ytterst høyre til ytterst venstre, glir bak de andre.
        const z = step === 3 ? 0 : p.z;
        return (
          <Link
            key={l.slug}
            style={{ zIndex: z, transform: `translate(-50%, 0) translate(${p.x}, ${p.y}) rotate(${p.r})` }}
            className="group absolute left-1/2 top-2 w-[38%] origin-bottom transition-transform duration-[900ms] ease-[cubic-bezier(.4,0,.2,1)] will-change-transform sm:w-[36%]"
            href={`/products/${l.slug}`}
          >
            <div key={offset} className="animate-[fan-in_.6s_ease-out] transition-transform duration-300 ease-out group-hover:-translate-y-4">
              {l.frontpage && (
                <span
                  className={`absolute -top-2 z-10 flex ${slot < 2 ? "-left-2" : "-right-2"} h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg ring-2 ring-white/80`}
                >
                  <CrownIcon className="h-3.5 w-3.5" aria-label="Toppannonse" />
                </span>
              )}
              <div
                data-top={l.frontpage ? "true" : undefined}
                className="relative w-full rounded-[12px] border border-white/60 data-[top=true]:border-accent data-[top=true]:ring-2 data-[top=true]:ring-accent/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(226,232,240,0.78)_45%,rgba(255,255,255,0.9))] p-[5%] shadow-[0_30px_60px_-25px_rgba(2,6,23,0.75)]"
              >
                <div className="rounded-[4px] border-2 border-[#c8102e] bg-white px-[6%] py-[4%] text-[#0b1726]">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 truncate text-[clamp(6px,0.7vw,9px)] font-bold uppercase leading-tight tracking-wide">{l.set}</p>
                    <p className="shrink-0 text-[clamp(6px,0.7vw,9px)] font-bold uppercase leading-tight">{l.cardNumber ? `#${l.cardNumber}` : ""}</p>
                  </div>
                  <div className="mt-[3%] flex items-end justify-between gap-2">
                    <p className="min-w-0 truncate text-[clamp(7px,0.8vw,10px)] font-bold uppercase leading-tight">{l.player}</p>
                    <p className="shrink-0 text-[clamp(7px,0.8vw,10px)] font-bold uppercase leading-tight">{l.types[0]}</p>
                  </div>
                </div>
                <div className="mt-[5%] aspect-[5/7] overflow-hidden rounded-[4px] bg-[#0d2238] ring-1 ring-black/10">
                  {l.image ? (
                    <Image
                      alt=""
                      src={l.image}
                      width={400}
                      height={560}
                      priority
                      sizes="(max-width: 640px) 38vw, 190px"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <CardArt listing={l} square />
                  )}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
