"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, CrownIcon } from "lucide-react";
import { CardArt } from "./CardArt";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";

const SPEED = 0.17; // kort per sekund: ett nytt kort i midten omtrent hvert 6. sekund

/** H-symbolet (to kort med gullstrek). */
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

let cardW = 200; // kortets bredde i px, målt når siden lastes
let halfW = 300; // halve bredden av vifta i px

/**
 * Plassering for et kort som står p plasser fra midten (kan være desimaltall). Kortene står på en rad i ekte 3D:
 * kortene på sidene er litt mindre, står litt bak og er svakt vridd inn mot midten. Nettleseren regner ut hva som
 * ligger foran, så kortet som kommer til midten glir mykt frem uten å hoppe foran det forrige.
 */
function place(p: number) {
  const a = Math.abs(p);
  const side = Math.sign(p);
  const turn = Math.sin((Math.min(a, 1) * Math.PI) / 2); // 0 i midten, 1 fra nabo-plassen og utover
  const lift = Math.max(0, 1 - a);
  const x = side * (80 * a + 22 * turn); // god avstand, så kortene aldri dekker hverandre når de bytter plass
  const z = 60 * (1 - turn) - 120 * turn - 40 * Math.max(0, a - 1);
  const scale = (1 + 0.06 * lift) * (1 - 0.07 * Math.min(a, 2));
  // Kortene tones ut når de nærmer seg kanten av vifta, i stedet for å kuttes av
  const fade = Math.min(1, Math.max(0, 1 - (Math.abs(x) - ((halfW / cardW) * 100 - 60)) / 70));
  return {
    transform: `translate(-50%, 0) translate3d(${x.toFixed(2)}%, ${(-lift * 8).toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${(-side * 20 * turn).toFixed(2)}deg) scale(${scale.toFixed(3)})`,
    opacity: fade,
    // Kortene utenfor midten er dempet, så kortet som kommer inn tones mykt opp
    dim: 0.42 * Math.min(1, a / 1.2) ** 1.3,
    gloss: Math.max(0, 1 - a / 0.55),
    glossX: -p * 170,
  };
}

/** Avstand fra midten for kort i, gitt hvor langt vifta har glidd. */
function offsetOf(i: number, shift: number, n: number) {
  let p = (((i - shift) % n) + n) % n;
  if (p >= n / 2) p -= n;
  return p;
}

/** Kortet i plastholder med HOBBYSTRADA-plakett, bevisst ulik graderingsetiketter. */
function Slab({ l }: { l: Listing }) {
  return (
    <div
      data-top={l.frontpage ? "true" : undefined}
      style={{ WebkitBoxReflect: "below 8px linear-gradient(transparent 72%, rgba(255,255,255,0.16))" } as React.CSSProperties}
      className="relative w-full rounded-[12px] border border-white/60 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(226,232,240,0.82)_45%,rgba(255,255,255,0.94))] p-[5%] shadow-[0_30px_60px_-25px_rgba(2,6,23,0.8)] data-[top=true]:border-accent data-[top=true]:ring-2 data-[top=true]:ring-accent/70"
    >
      <div className="flex items-center gap-[6%] rounded-[6px] bg-[linear-gradient(180deg,#1a2d52,#0c1730)] px-[6%] py-[5%] ring-1 ring-inset ring-[#cfa653]/70">
        <Mark className="h-[20px] w-auto shrink-0 sm:h-[26px]" cards="#f7f3ea" bar="#cfa653" />
        <div className="min-w-0">
          <p className="truncate text-[9px] font-extrabold uppercase leading-tight text-[#f7f3ea] sm:text-[10px]">{l.player}</p>
          <p className="truncate text-[8px] font-semibold leading-tight text-[#e2c27a] sm:text-[9px]">{l.set}</p>
        </div>
      </div>
      <div className="mt-[5%] aspect-[5/7] overflow-hidden rounded-[4px] bg-[#0d2238] ring-1 ring-black/10">
        {l.image ? (
          <Image alt="" src={l.image} width={400} height={560} priority sizes="(max-width: 640px) 40vw, 200px" className="h-full w-full object-cover" />
        ) : (
          <CardArt listing={l} square />
        )}
      </div>
      {l.frontpage && (
        <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg ring-2 ring-white/80">
          <CrownIcon className="h-3.5 w-3.5" aria-label="Toppannonse" />
        </span>
      )}
    </div>
  );
}

/**
 * Vifta på forsiden: kortene står i en bue og glir sakte og kontinuerlig bortover, så hvert kort passerer midten.
 * Kortet i midten løftes litt, får spotlys og en glans som glir over. Stopper når musepekeren er over.
 */
export function HeroFan({ cards: list }: { cards: Listing[] }) {
  // Med færre enn fem kort gjentas de, så buen alltid er full
  const cards = list.length && list.length < 5 ? Array.from({ length: Math.ceil(5 / list.length) }, () => list).flat() : list;
  const n = cards.length;
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
  const dims = useRef<(HTMLDivElement | null)[]>([]);
  const glosses = useRef<(HTMLDivElement | null)[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el || n < 2) return;
    const measure = () => {
      cardW = refs.current[0]?.offsetWidth || cardW;
      halfW = el.offsetWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);
    // På mobil glir vifta litt roligere. Med «Reduser bevegelse» glir den saktere i stedet for å stå stille.
    const phone = window.matchMedia("(max-width: 640px)").matches ? 0.7 : 1;
    const base = SPEED * phone * (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.5 : 1);
    let shift = 0;
    let speed = base;
    let onCard = false; // musen over et kort: stopp, så det er lett å trykke
    let focused = false;
    let visible = true;
    let shown = 0;
    let last = performance.now();
    let raf = 0;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    // Bare en ekte mus stopper vifta; berøring på mobil skal ikke la den stå
    const over = (e: PointerEvent) => {
      if (e.pointerType === "mouse") onCard = Boolean((e.target as Element).closest?.("a"));
    };
    const out = () => (onCard = false);
    // Bare tastaturfokus (Tab) stopper vifta, ikke fokus etter et museklikk
    const enter = (e: FocusEvent) => (focused = Boolean((e.target as Element).matches?.(":focus-visible")));
    const leave = () => (focused = false);
    el.addEventListener("pointerover", over);
    el.addEventListener("pointerleave", out);
    el.addEventListener("focusin", enter);
    el.addEventListener("focusout", leave);

    // Sist satte verdier per kort, så nettleseren bare får beskjed om det som faktisk endres
    const prev: Record<string, string>[] = Array.from({ length: n }, () => ({}));
    const set = (i: number, el: HTMLElement | null, key: string, value: string) => {
      if (!el || prev[i][key] === value) return;
      prev[i][key] = value;
      el.style.setProperty(key, value);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!visible || document.hidden) return;
      speed += ((onCard || focused ? 0 : base) - speed) * (1 - Math.exp(-dt * 3));
      shift = (shift + speed * dt) % n;
      let nearest = 0;
      let best = 9;
      refs.current.forEach((node, i) => {
        if (!node) return;
        const p = offsetOf(i, shift, n);
        const s = place(p);
        // Bare transform og opacity endres i hvert bilde. Det tar skjermkortet seg av uten å tegne kortene på nytt.
        set(i, node, "transform", s.transform);
        set(i, node, "opacity", s.opacity.toFixed(3));
        set(i, node, "pointer-events", s.opacity < 0.3 ? "none" : "auto");
        set(i, dims.current[i], "opacity", s.dim.toFixed(3));
        set(i, glosses.current[i], "opacity", s.gloss.toFixed(3));
        set(i, glosses.current[i]?.firstElementChild as HTMLElement | null, "transform", `translateX(${s.glossX.toFixed(1)}%) rotate(18deg)`);
        if (Math.abs(p) < best) {
          best = Math.abs(p);
          nearest = i;
        }
      });
      if (nearest !== shown && best < 0.5) {
        shown = nearest;
        setCenter(nearest);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      io.disconnect();
      el.removeEventListener("pointerover", over);
      el.removeEventListener("pointerleave", out);
      el.removeEventListener("focusin", enter);
      el.removeEventListener("focusout", leave);
    };
  }, [n]);

  const c = cards[center];
  return (
    <div ref={box} className="hero-fan relative mx-auto h-[380px] w-full max-w-[900px] [--w:44%] sm:h-[500px] sm:[--w:31%] lg:h-[540px]">
      {/* Gyllent lys på gulvet under kortene */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[9%] left-1/2 h-[60px] w-[70%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(214,178,95,0.45),rgba(214,178,95,0.12)_60%,transparent)]"
      />
      {/* Scenen kortene står i. Med ekte 3D regner nettleseren ut hvilke kort som ligger foran. */}
      <div className="absolute inset-0 [perspective:1100px] [transform-style:preserve-3d]">
        {cards.map((l, i) => {
          const s = place(offsetOf(i, 0, n));
          return (
            <Link
              key={`${l.slug}-${i}`}
              ref={(node) => {
                refs.current[i] = node;
              }}
              href={`/products/${l.slug}`}
              aria-label={l.title}
              style={
                {
                  transform: s.transform,
                  opacity: s.opacity,
                } as React.CSSProperties
              }
              className="group absolute left-1/2 top-[4%] w-[var(--w)] origin-bottom will-change-transform"
            >
              <div className="relative transition-transform duration-300 ease-out group-hover:-translate-y-3">
                <Slab l={l} />
                {/* Glans som glir over kortet når det passerer midten */}
                <div
                  ref={(node) => {
                    glosses.current[i] = node;
                  }}
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-[12px] will-change-[opacity]"
                  style={{ opacity: s.gloss }}
                >
                  <div
                    className="absolute inset-y-[-20%] left-[35%] w-[30%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)] will-change-transform"
                    style={{ transform: `translateX(${s.glossX}%) rotate(18deg)` }}
                  />
                </div>
                {/* Kortene på sidene dempes litt, så midten er i fokus */}
                <div
                  ref={(node) => {
                    dims.current[i] = node;
                  }}
                  data-dim
                  className="pointer-events-none absolute inset-0 rounded-[12px] bg-[#0b1426] will-change-[opacity]"
                  style={{ opacity: s.dim }}
                />
              </div>
            </Link>
          );
        })}
      </div>
      {c && (
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-[200] sm:bottom-0 flex justify-center px-4">
          <Link
            key={`${c.slug}-${center}`}
            href={`/products/${c.slug}`}
            className="pointer-events-auto flex animate-[stage-in_.5s_ease-out] items-center gap-4 rounded-full bg-[#0b1426]/85 py-2 pl-5 pr-2 text-left text-white ring-1 ring-inset ring-[#cfa653]/40"
          >
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold leading-tight sm:text-sm">{c.player}</span>
              <span className="block truncate text-[11px] text-white/60 sm:text-xs">{c.set}</span>
            </span>
            <span className="shrink-0 font-heading text-sm font-semibold text-[#f2dc9b] sm:text-base">{formatPrice(c.price)}</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#cfa653] text-[#0b1426]">
              <ArrowRightIcon className="h-4 w-4" aria-label="Se kortet" />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
