import Image from "next/image";
import Link from "next/link";
import { CrownIcon } from "lucide-react";
import { CardArt } from "./CardArt";
import type { Listing } from "@/lib/types";

const MAX_CARDS = 10;

/**
 * Kortene i karusellen, i rekkefølgen de vises frem. Kort admin har festet står på sin faste plass (1 = først).
 * Toppannonser er med hele perioden – er de flere enn de ledige plassene, utvides karusellen. Resten er de nyeste.
 */
export function fanCards(pinned: Listing[], paid: Listing[], fill: Listing[]) {
  const taken = new Set(pinned.map((l) => l.slug));
  const free = 5 - pinned.length;
  const extra = paid.length > free ? paid.slice(0, MAX_CARDS - pinned.length) : [...paid, ...fill];
  const candidates = extra.filter((l, i, all) => !taken.has(l.slug) && all.findIndex((x) => x.slug === l.slug) === i);
  const size = Math.max(5, pinned.length + Math.min(candidates.length, MAX_CARDS - pinned.length));
  const ranked: (Listing | undefined)[] = Array(size).fill(undefined);
  for (const l of pinned) if (l.fanSlot) ranked[l.fanSlot - 1] = l;
  for (let i = 0; i < size; i++) if (!ranked[i]) ranked[i] = candidates.shift();
  return ranked.filter(Boolean) as Listing[];
}

/** H-symbolet (to kort med gullstrek), preget i gullholderen og på baksiden. */
function Mark({ className, cards, bar }: { className?: string; cards: string; bar: string }) {
  return (
    <svg viewBox="12 6 76 88" className={className} aria-hidden="true">
      <g transform="rotate(-7 31 50)">
        <rect x="17" y="12" width="28" height="76" rx="7" fill={cards} />
      </g>
      <g transform="rotate(7 69 50)">
        <rect x="55" y="12" width="28" height="76" rx="7" fill={cards} />
      </g>
      <rect x="33" y="43" width="34" height="14" rx="3" fill={bar} />
    </svg>
  );
}

const GOLD = "bg-[linear-gradient(180deg,#f2dc9b_0%,#d6b25f_35%,#b08a3a_70%,#8a6a26_100%)]";

/** Kortet i plastholder, stående i en gullholder – forsiden og baksiden. */
function Slab({ l }: { l: Listing }) {
  return (
    <>
      <div className="absolute inset-0 [backface-visibility:hidden]">
        {l.frontpage && (
          <span className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg ring-2 ring-white/80">
            <CrownIcon className="h-3.5 w-3.5" aria-label="Toppannonse" />
          </span>
        )}
        <div
          data-top={l.frontpage ? "true" : undefined}
          className="relative w-full rounded-[10px] border border-white/60 bg-[linear-gradient(160deg,rgba(255,255,255,0.95),rgba(226,232,240,0.8)_45%,rgba(255,255,255,0.92))] p-[5%] data-[top=true]:border-accent data-[top=true]:ring-2 data-[top=true]:ring-accent/70"
        >
          {/* HOBBYSTRADA-plakett, bevisst ulik graderingsetiketter */}
          <div className="flex items-center gap-[6%] rounded-[6px] bg-[linear-gradient(180deg,#1a2d52,#0c1730)] px-[6%] py-[5%] ring-1 ring-inset ring-[#cfa653]/70">
            <Mark className="h-[22px] w-auto shrink-0 sm:h-[26px]" cards="#f7f3ea" bar="#cfa653" />
            <div className="min-w-0">
              <p className="truncate text-[9px] font-extrabold uppercase leading-tight text-[#f7f3ea] sm:text-[10px]">{l.player}</p>
              <p className="truncate text-[8px] font-semibold leading-tight text-[#e2c27a] sm:text-[9px]">{l.set}</p>
            </div>
          </div>
          <div className="mt-[5%] aspect-[5/7] overflow-hidden rounded-[3px] bg-[#0d2238] ring-1 ring-black/10">
            {l.image ? (
              <Image alt="" src={l.image} width={400} height={560} priority sizes="170px" className="h-full w-full object-cover" />
            ) : (
              <CardArt listing={l} square />
            )}
          </div>
        </div>
        <div className={`mx-[6%] flex h-[26px] items-center justify-center rounded-b-md ${GOLD} shadow-[inset_0_1px_0_rgba(255,255,255,.5)] sm:h-[34px]`}>
          <Mark className="h-[60%] opacity-80" cards="#7a5a1c" bar="#f6e3a6" />
        </div>
      </div>
      <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
        <div className="flex aspect-[0.66] w-full items-center justify-center rounded-[10px] border border-white/20 bg-[linear-gradient(160deg,#16294a,#0b1628)]">
          <Mark className="w-[38%] opacity-90" cards="#f7f3ea" bar="#c9a24a" />
        </div>
        <div className={`mx-[6%] h-[26px] rounded-b-md ${GOLD} sm:h-[34px]`} />
      </div>
    </>
  );
}

/**
 * Karusellen på forsiden: kortene står i gullholdere i en ring og snurrer sakte, så de vises frem ett og ett.
 * Stopper når musepekeren er over, og står stille for dem som har slått av animasjoner.
 */
export function HeroFan({ pinned, paid, fill }: { pinned: Listing[]; paid: Listing[]; fill: Listing[] }) {
  const cards = fanCards(pinned, paid, fill);
  const n = Math.max(cards.length, 3);
  // Avstand fra midten slik at kortene får litt luft mellom seg (i kortbredder)
  const radius = 0.72 / Math.tan(Math.PI / n);
  return (
    <div className="group/fan relative mx-auto h-[300px] w-full max-w-[600px] [--w:112px] [perspective:1400px] sm:h-[400px] sm:[--w:158px] lg:h-[420px] lg:[--w:176px]">
      <div
        aria-hidden="true"
        className="absolute bottom-[1%] left-1/2 h-[54px] w-[80%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(214,178,95,.4),rgba(214,178,95,.1)_60%,transparent)] blur-[2px]"
      />
      {/* Ringen skyves bakover, så kortet foran står i vanlig størrelse */}
      <div
        style={{ transform: `translateZ(calc(var(--w) * ${(-radius).toFixed(3)}))` }}
        className="absolute left-1/2 top-[2%] h-full w-[var(--w)] -translate-x-1/2 [transform-style:preserve-3d]"
      >
        <div
          style={{ animationDuration: `${n * 6}s` }}
          className="absolute inset-0 animate-[fan-spin_30s_linear_infinite] [transform-style:preserve-3d] group-hover/fan:[animation-play-state:paused] motion-reduce:animate-none"
        >
          {cards.map((l, i) => (
            <Link
              key={l.slug}
              href={`/products/${l.slug}`}
              aria-label={l.title}
              style={{ transform: `rotateY(${(360 / n) * i}deg) translateZ(calc(var(--w) * ${radius.toFixed(3)}))` }}
              className="absolute inset-x-0 top-0 aspect-[0.58] [transform-style:preserve-3d]"
            >
              <Slab l={l} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
