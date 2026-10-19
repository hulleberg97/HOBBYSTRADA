"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, CrownIcon } from "lucide-react";
import { CardArt } from "./CardArt";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";

const SPEED = 0.17; // kort per sekund: ett nytt kort i midten omtrent hvert 6. sekund
const EDGE = 2.45; // kort lenger ut enn dette er skjult (der hopper de rundt til andre siden)

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

/** Plassering langs buen for et kort som står p plasser fra midten (kan være desimaltall). */
function place(p: number) {
  const a = Math.abs(p);
  // Nær midten glir kortene litt fra hverandre, så det nye kortet ikke plutselig dekker det gamle når de bytter plass
  const part = a < 1 ? 14 * Math.sin(Math.PI * p) : 0;
  const x = 47 * p - p * a + part;
  const y = 8 * p * p + 2 * a;
  const lift = Math.max(0, 1 - a);
  const fade = a < 1.9 ? 1 : Math.max(0, 1 - (a - 1.9) / (EDGE - 1.9));
  return {
    transform: `translate(-50%, 0) translate(${x}%, ${y - lift * 10}px) rotate(${8 * p}deg) scale(${1 + 0.06 * lift})`,
    zIndex: 1000 - Math.round(a * 100),
    mask: blend(p),
    opacity: fade,
    // Kortene utenfor midten er dempet, så kortet som kommer inn tones mykt opp
    dim: 0.42 * Math.min(1, a / 1.2) ** 1.3,
    gloss: Math.max(0, 1 - a / 0.55),
    glossX: -p * 170,
  };
}

const BLEND = 0.22; // hvor lenge (i kortplasser) to kort tones over i hverandre når de bytter plass

/**
 * Når et kort passerer midten, bytter det plass i dybden med naboen. I stedet for at det ene kortet plutselig
 * havner foran, gjøres kanten mot naboen gjennomsiktig rundt byttet, så de to kortene tones mykt over i hverandre.
 */
function blend(p: number) {
  const a = Math.abs(p);
  if (a >= 0.5 || a < 0.5 - BLEND) return "none";
  const alpha = (0.5 + (0.5 * (0.5 - a)) / BLEND).toFixed(3);
  const side = p < 0 ? "left" : "right"; // gradienten starter i kanten som vender mot naboen
  return `linear-gradient(to ${side}, rgba(0,0,0,${alpha}) 0%, rgba(0,0,0,${alpha}) 22%, #000 36%)`;
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
  const box = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el || n < 2) return;
    // Med «Reduser bevegelse» glir vifta saktere i stedet for å stå stille
    const base = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? SPEED * 0.5 : SPEED;
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

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
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
        node.style.transform = s.transform;
        node.style.zIndex = String(s.zIndex);
        node.style.maskImage = s.mask;
        node.style.webkitMaskImage = s.mask;
        node.style.opacity = String(s.opacity);
        node.style.pointerEvents = s.opacity < 0.3 ? "none" : "";
        node.style.setProperty("--dim", String(s.dim));
        node.style.setProperty("--gloss", String(s.gloss));
        node.style.setProperty("--gloss-x", `${s.glossX}%`);
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
      io.disconnect();
      el.removeEventListener("pointerover", over);
      el.removeEventListener("pointerleave", out);
      el.removeEventListener("focusin", enter);
      el.removeEventListener("focusout", leave);
    };
  }, [n]);

  const c = cards[center];
  return (
    <div ref={box} className="relative mx-auto h-[330px] w-full max-w-[600px] [--w:38%] sm:h-[430px] sm:[--w:34%] lg:h-[470px]">
      {/* Spotlys bak kortet i midten, og gyllent lys på gulvet */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-12%] h-[105%] w-[62%] -translate-x-1/2 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(255,241,214,0.22),rgba(255,241,214,0.06)_55%,transparent_80%)] [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[9%] left-1/2 h-[60px] w-[70%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(214,178,95,0.45),rgba(214,178,95,0.12)_60%,transparent)]"
      />
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
                zIndex: s.zIndex,
                maskImage: s.mask,
                WebkitMaskImage: s.mask,
                opacity: s.opacity,
                "--dim": s.dim,
                "--gloss": s.gloss,
                "--gloss-x": `${s.glossX}%`,
              } as React.CSSProperties
            }
            className="group absolute left-1/2 top-[4%] w-[var(--w)] origin-bottom will-change-transform"
          >
            <div className="relative transition-transform duration-300 ease-out group-hover:-translate-y-3">
              <Slab l={l} />
              {/* Glans som glir over kortet når det passerer midten */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[12px]" style={{ opacity: "var(--gloss)" }}>
                <div
                  className="absolute inset-y-[-20%] left-[35%] w-[30%] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] mix-blend-soft-light"
                  style={{ transform: "translateX(var(--gloss-x)) rotate(18deg)" }}
                />
              </div>
              {/* Kortene på sidene dempes litt, så midten er i fokus */}
              <div className="pointer-events-none absolute inset-0 rounded-[12px] bg-[#0b1426]" style={{ opacity: "var(--dim)" }} />
            </div>
          </Link>
        );
      })}
      {c && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[200] flex justify-center px-4">
          <Link
            key={`${c.slug}-${center}`}
            href={`/products/${c.slug}`}
            className="pointer-events-auto flex animate-[stage-in_.5s_ease-out] items-center gap-4 rounded-full bg-black/45 py-2 pl-5 pr-2 text-left text-white ring-1 ring-inset ring-[#cfa653]/40 backdrop-blur-md"
          >
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold leading-tight sm:text-sm">{c.player}</span>
              <span className="block truncate text-[11px] text-white/60 sm:text-xs">{c.set}</span>
            </span>
            <span className="shrink-0 font-heading text-sm font-semibold text-[#f2dc9b] sm:text-base">{formatPrice(c.price).replace(",00", "")}</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#cfa653] text-[#0b1426]">
              <ArrowRightIcon className="h-4 w-4" aria-label="Se kortet" />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
