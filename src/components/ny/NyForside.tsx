"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRightIcon, ArrowUpRightIcon, BadgeCheckIcon, CameraIcon, CheckIcon, ChevronDownIcon, MessageCircleIcon, TagIcon } from "lucide-react";
import { CardArt } from "@/components/CardArt";
import { formatPrice } from "@/lib/format";
import { graderOf, hasType, matches } from "@/lib/filters";
import type { Listing } from "@/lib/types";
import { NyKort } from "./NyKort";
import { rise, softSpring, spring, stagger } from "./motion";

type Cat = "alle" | "autograf" | "patch" | "nummerert" | "rookie" | "gradert";

const CATS: { id: Cat; label: string; test: (l: Listing) => boolean }[] = [
  { id: "alle", label: "Alle kort", test: () => true },
  { id: "autograf", label: "Autografer", test: (l) => matches(l, "autograf") },
  { id: "patch", label: "Patch / relic", test: (l) => hasType(l, "Patch") },
  { id: "nummerert", label: "Nummererte", test: (l) => hasType(l, "Nummerert") },
  { id: "rookie", label: "Rookies", test: (l) => matches(l, "RC") },
  { id: "gradert", label: "Graderte", test: (l) => graderOf(l.grading) !== "raw" },
];
const count = (list: Listing[], id: Cat) => list.filter(CATS.find((c) => c.id === id)!.test).length;

const display = "font-[family-name:var(--ny-display)]";
const wrap = "mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8";

export function NyForside({ listings, featured, sold }: { listings: Listing[]; featured: Listing | null; sold: Listing[] }) {
  const [cat, setCat] = useState<Cat>("alle");
  const pick = (c: Cat) => {
    setCat(c);
    document.getElementById("utvalg")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="bg-white pb-8 text-zinc-900">
      <Hero listings={listings} featured={featured} sold={sold} />
      <Kategorier listings={listings} onPick={pick} />
      <Utvalg listings={listings} cat={cat} setCat={setCat} />
      <Selg />
    </div>
  );
}

/* ---------------------------------- Hero ---------------------------------- */

function Hero({ listings, featured, sold }: { listings: Listing[]; featured: Listing | null; sold: Listing[] }) {
  const stats = [
    [listings.length, "kort til salgs"],
    [count(listings, "autograf"), "autografer"],
    [count(listings, "nummerert"), "nummererte"],
  ] as const;

  return (
    <section className={`${wrap} pt-6 lg:pt-8`}>
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-3 md:grid-cols-4 md:grid-rows-[repeat(2,minmax(0,250px))]">
        {/* Hovedbudskap */}
        <motion.div variants={rise} className="relative flex flex-col overflow-hidden rounded-3xl border border-zinc-100 bg-zinc-50 p-7 sm:p-10 md:col-span-2 md:row-span-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            Markedsplass for fotballkort
          </span>
          <h1 className={`${display} mt-10 text-[44px] font-light leading-[0.95] tracking-[-0.03em] text-primary sm:text-6xl md:mt-auto lg:text-[76px]`}>
            Finn ditt
            <br />
            <em className="font-normal italic">neste</em> kort.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-zinc-600">
            Kjøp og selg fotballkort direkte i Norge. Autografer, patch, relic og nummererte kort fra samlere over hele landet.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}>
              <Link href="/marked" className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white">
                Se alle annonser
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}>
              <Link href="/selg" className="inline-flex h-12 items-center rounded-full border border-zinc-300 px-6 text-sm font-semibold text-primary transition-colors hover:bg-white">
                Legg ut kort
              </Link>
            </motion.div>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-zinc-200 pt-5">
            {stats.map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className={`${display} text-2xl tabular-nums tracking-tight text-primary`}>{v}</dd>
                <dd className="mt-0.5 text-xs text-zinc-500">{l}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Utvalgt kort med 3D-tilt */}
        <motion.div variants={rise} className="min-h-[460px] md:row-span-2 md:min-h-0">
          {featured ? <UtvalgtKort l={featured} /> : <TomtUtvalg />}
        </motion.div>

        {/* Autografer */}
        <motion.div variants={rise} whileHover={{ y: -3 }} transition={spring} className="min-h-[200px]">
          <Link href="/sok?q=autograf" className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-primary p-6 text-white">
            <svg viewBox="0 0 200 60" className="absolute -right-4 top-10 w-56 text-white/15 transition-transform duration-500 group-hover:-translate-x-1.5" aria-hidden="true">
              <path d="M5 40 c 18 -32 30 8 46 -14 s 16 22 36 -6 s 22 14 40 -8 s 24 18 50 -4 s 18 6 20 -4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-medium tabular-nums text-white/60">{count(listings, "autograf") > 0 && `${count(listings, "autograf")} kort`}</span>
            <span className={`${display} mt-auto text-3xl font-light tracking-tight`}>Autografer</span>
            <span className="mt-1 flex items-center justify-between text-sm text-white/60">
              On-card og sticker
              <ArrowUpRightIcon className="h-[18px] w-[18px] text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        </motion.div>

        {/* Nummererte */}
        <motion.div variants={rise} whileHover={{ y: -3 }} transition={spring} className="min-h-[200px]">
          <Link href="/sok?q=%2F" className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6">
            <span className="relative text-xs font-medium tabular-nums text-zinc-500">{count(listings, "nummerert") > 0 && `${count(listings, "nummerert")} kort`}</span>
            <span className={`${display} absolute right-5 top-3 text-[88px] font-light leading-none tracking-tighter text-zinc-100 transition-colors duration-300 group-hover:text-accent/30`} aria-hidden="true">
              /99
            </span>
            <span className={`${display} relative mt-auto text-3xl font-light tracking-tight text-primary`}>Nummererte</span>
            <span className="relative mt-1 flex items-center justify-between text-sm text-zinc-500">
              Fra /99 til 1/1
              <ArrowUpRightIcon className="h-[18px] w-[18px] text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {sold.length >= 3 && <SolgtBand sold={sold} />}
    </section>
  );
}

function UtvalgtKort({ l }: { l: Listing }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rx = useSpring(useTransform(y, [0, 1], [8, -8]), spring);
  const ry = useSpring(useTransform(x, [0, 1], [-10, 10]), spring);
  const glare = useTransform(x, [0, 1], ["0%", "100%"]);
  // Betalt plassering merkes tydelig (markedsføringsloven § 8)
  const label = l.frontpage ? "Toppannonse" : l.featured ? "Annonseløft" : "Utvalgt kort";

  return (
    <Link
      href={`/annonse/${l.slug}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width);
        y.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        x.set(0.5);
        y.set(0.5);
      }}
      className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-[#0b1426] p-6 text-white [perspective:900px]"
    >
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium uppercase tracking-[0.18em] text-white/50">{label}</span>
        {l.numbered && <span className="rounded-full bg-accent px-2 py-0.5 font-semibold tabular-nums text-accent-foreground">{l.numbered}</span>}
      </div>
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="relative mx-auto my-auto w-[74%] max-w-[250px] py-4 [transform-style:preserve-3d]">
        <div className="relative aspect-[5/7] overflow-hidden rounded-xl shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)] ring-1 ring-white/10">
          {l.image ? (
            <Image src={l.image} alt={l.title} fill priority sizes="250px" className="object-cover" />
          ) : (
            <CardArt listing={l} detail />
          )}
          <motion.div style={{ left: glare }} className="pointer-events-none absolute -top-1/2 h-[200%] w-24 -translate-x-1/2 rotate-12 bg-white/20 blur-xl" />
        </div>
      </motion.div>
      <div>
        <p className="line-clamp-1 text-sm font-semibold">{l.title}</p>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="tabular-nums">{formatPrice(l.price)}</span>
          {l.sellerVerified && (
            <span className="inline-flex items-center gap-1 text-xs text-white/60">
              <BadgeCheckIcon className="h-3.5 w-3.5 text-[#ff5b24]" aria-hidden="true" /> Verifisert med Vipps
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function TomtUtvalg() {
  return (
    <Link href="/selg" className="flex h-full flex-col justify-end rounded-3xl bg-[#0b1426] p-6 text-white">
      <span className={`${display} text-3xl font-light`}>Bli den første på forsiden</span>
      <span className="mt-2 text-sm text-white/60">Legg ut et kort →</span>
    </Link>
  );
}

function SolgtBand({ sold }: { sold: Listing[] }) {
  const items = [...sold, ...sold];
  return (
    <div className="mt-3 flex items-center overflow-hidden rounded-2xl border border-zinc-100 bg-white">
      <Link href="/solgt" className="z-10 shrink-0 border-r border-zinc-100 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary hover:text-zinc-600">
        Nylig solgt
      </Link>
      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <div className="ny-marquee flex w-max gap-8 py-3 pl-6 hover:[animation-play-state:paused]">
          {items.map((s, i) => (
            <Link key={i} href={`/annonse/${s.slug}`} tabIndex={i >= sold.length ? -1 : undefined} aria-hidden={i >= sold.length ? true : undefined} className="flex items-center gap-2 whitespace-nowrap text-sm text-zinc-500 hover:text-zinc-900">
              {s.title}
              <span className="font-semibold tabular-nums text-zinc-900">{formatPrice(s.price)}</span>
              <span className="text-zinc-300" aria-hidden="true">
                •
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Kategorier ------------------------------- */

function Kategorier({ listings, onPick }: { listings: Listing[]; onPick: (c: Cat) => void }) {
  const tiles: { id: Cat; title: string; blurb: string; span: string; tone: "dark" | "light" | "outline"; art: React.ReactNode }[] = [
    {
      id: "gradert",
      title: "Graderte kort",
      blurb: "PSA, BGS og andre – slabbet og sjekket.",
      span: "md:col-span-2 md:row-span-2 min-h-[340px]",
      tone: "dark",
      art: (
        <div className="absolute bottom-6 right-6 top-16 flex items-end gap-3" aria-hidden="true">
          {[10, 9, 10].map((g, i) => (
            <div
              key={i}
              className="flex w-20 flex-col rounded-xl border border-white/15 bg-white/[0.04] p-2 transition-transform duration-500 group-hover:-translate-y-1.5 sm:w-24"
              style={{ transitionDelay: `${i * 50}ms`, height: `${70 + i * 12}%` }}
            >
              <div className="flex items-center justify-between rounded-md bg-white px-2 py-1 text-[10px] font-bold text-primary">
                GEM <span className="text-sm">{g}</span>
              </div>
              <div className="mt-2 flex-1 rounded-md bg-gradient-to-b from-white/20 to-white/5" />
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "rookie",
      title: "Rookies",
      blurb: "Neste generasjon, før alle andre.",
      span: "",
      tone: "light",
      art: (
        <span className="absolute right-5 top-4 rounded-md border-2 border-primary px-1.5 text-xs font-black tracking-wider text-primary" aria-hidden="true">
          RC
        </span>
      ),
    },
    {
      id: "patch",
      title: "Patch / relic",
      blurb: "Kampbrukt materiale.",
      span: "",
      tone: "outline",
      art: (
        <div className="absolute right-5 top-5 grid h-10 w-14 place-items-center rounded-md border-2 border-zinc-300" aria-hidden="true">
          <div className="h-5 w-9 bg-[repeating-linear-gradient(0deg,#d4d4d8_0_3px,transparent_3px_6px)]" />
        </div>
      ),
    },
    {
      id: "autograf",
      title: "Autografer",
      blurb: "Signert på kortet eller sticker.",
      span: "md:col-span-2",
      tone: "light",
      art: (
        <svg viewBox="0 0 200 60" className="absolute right-6 top-1/2 w-48 -translate-y-1/2 text-zinc-300 transition-transform duration-500 group-hover:-translate-x-1.5" aria-hidden="true">
          <path d="M5 40 c 18 -32 30 8 46 -14 s 16 22 36 -6 s 22 14 40 -8 s 24 18 50 -4 s 18 6 20 -4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <section className={`${wrap} pt-20`}>
      <Overskrift eyebrow="Utforsk" title={<>Finn kortet ditt <em className="italic">etter type</em></>} />
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:auto-rows-[200px] md:grid-cols-4">
        {tiles.map((t) => (
          <motion.button
            key={t.id}
            type="button"
            variants={rise}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => onPick(t.id)}
            className={`group relative flex min-h-[180px] flex-col overflow-hidden rounded-3xl p-6 text-left ${t.span} ${
              t.tone === "dark" ? "bg-primary text-white" : t.tone === "light" ? "bg-zinc-100 text-primary" : "border border-zinc-200 bg-white text-primary"
            }`}
          >
            {t.art}
            <span className={`relative h-4 text-xs font-medium tabular-nums ${t.tone === "dark" ? "text-white/60" : "text-zinc-500"}`}>{count(listings, t.id) > 0 && `${count(listings, t.id)} kort`}</span>
            <span className={`${display} relative mt-auto text-[28px] font-light leading-tight tracking-tight`}>{t.title}</span>
            <span className={`relative mt-1 flex items-center justify-between gap-4 text-sm ${t.tone === "dark" ? "text-white/60" : "text-zinc-500"}`}>
              {t.blurb}
              <ArrowUpRightIcon className={`h-[18px] w-[18px] shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${t.tone === "dark" ? "text-white" : "text-primary"}`} aria-hidden="true" />
            </span>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}

/* --------------------------------- Utvalg --------------------------------- */

type Sort = "nyeste" | "pris-lav" | "pris-hoy" | "mest-sett";
const SORTS: { id: Sort; label: string }[] = [
  { id: "nyeste", label: "Nyeste først" },
  { id: "pris-lav", label: "Pris: lav til høy" },
  { id: "pris-hoy", label: "Pris: høy til lav" },
  { id: "mest-sett", label: "Mest sett" },
];
const VIS = 12;

function Utvalg({ listings, cat, setCat }: { listings: Listing[]; cat: Cat; setCat: (c: Cat) => void }) {
  const [sort, setSort] = useState<Sort>("nyeste");
  const [verified, setVerified] = useState(false);

  const results = useMemo(() => {
    const test = CATS.find((c) => c.id === cat)!.test;
    const list = listings.filter((l) => test(l) && (!verified || l.sellerVerified));
    const by: Record<Sort, (a: Listing, b: Listing) => number> = {
      nyeste: (a, b) => b.createdAt.localeCompare(a.createdAt),
      "pris-lav": (a, b) => a.price - b.price,
      "pris-hoy": (a, b) => b.price - a.price,
      "mest-sett": (a, b) => (b.views ?? 0) - (a.views ?? 0),
    };
    // Eksempelannonser alltid sist
    return [...list].sort((a, b) => Number(Boolean(a.isExample)) - Number(Boolean(b.isExample)) || by[sort](a, b));
  }, [listings, cat, sort, verified]);

  return (
    <section id="utvalg" className={`${wrap} scroll-mt-24 pt-20`}>
      <Overskrift
        eyebrow="Til salgs nå"
        title={<>Nylig lagt <em className="italic">ut</em></>}
        right={
          <p className="text-sm tabular-nums text-zinc-500" aria-live="polite">
            {results.length} kort
          </p>
        }
      />

      {/* Filterlinje */}
      <div className="sticky top-[73px] z-30 -mx-4 mt-6 border-b border-zinc-100 bg-white/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:px-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 gap-1 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Kategorier">
            {CATS.map((c) => {
              const active = c.id === cat;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCat(c.id)}
                  className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${active ? "text-white" : "text-zinc-500 hover:text-zinc-900"}`}
                >
                  {active && <motion.span layoutId="ny-chip" transition={spring} className="absolute inset-0 rounded-full bg-primary" />}
                  <span className="relative">{c.label}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setVerified((v) => !v)}
            aria-pressed={verified}
            className={`hidden shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors md:inline-flex ${
              verified ? "border-[#ff5b24]/40 bg-[#ff5b24]/10 text-[#c2410c]" : "border-zinc-200 text-zinc-600"
            }`}
          >
            <BadgeCheckIcon className="h-4 w-4" aria-hidden="true" /> Verifisert med Vipps
          </button>
          <Sortering value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {results.slice(0, VIS).map((l, i) => (
            <NyKort key={l.slug} listing={l} eager={i < 4} />
          ))}
        </AnimatePresence>
      </div>

      {results.length === 0 && (
        <div className="mt-6 rounded-3xl border border-dashed border-zinc-200 py-16 text-center">
          <p className={`${display} text-2xl font-light`}>Ingen kort her ennå</p>
          <p className="mt-1 text-sm text-zinc-500">
            Har du et? <Link href="/selg" className="font-semibold text-primary underline underline-offset-4">Legg det ut</Link>.
          </p>
        </div>
      )}

      {results.length > VIS && (
        <div className="mt-8 flex justify-center">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}>
            <Link href="/marked" className="inline-flex h-12 items-center gap-2 rounded-full border border-zinc-300 px-6 text-sm font-semibold text-primary hover:bg-zinc-50">
              Se alle {results.length} kort i markedet <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      )}
    </section>
  );
}

function Sortering({ value, onChange }: { value: Sort; onChange: (s: Sort) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
      >
        <span className="hidden sm:inline">{SORTS.find((s) => s.id === value)!.label}</span>
        <span className="sm:hidden">Sorter</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring}>
          <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={spring}
            className="absolute right-0 top-full z-40 mt-2 w-56 origin-top-right rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl"
          >
            {SORTS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={s.id === value}
                  onClick={() => {
                    onChange(s.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-zinc-100"
                >
                  {s.label}
                  {s.id === value && <CheckIcon className="h-4 w-4" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------- Selg ---------------------------------- */

const STEG = [
  { icon: CameraIcon, title: "Ta bilde", text: "Forside og bakside. Fyll inn spiller, sett og tilstand." },
  { icon: TagIcon, title: "Sett pris", text: "Se hva lignende kort har gått for under solgte kort.", href: "/solgt" },
  { icon: MessageCircleIcon, title: "Avtal handelen", text: "Kjøper og selger avtaler betaling og frakt direkte i meldinger." },
];

function Selg() {
  return (
    <section className={`${wrap} pt-24`}>
      <div className="grid gap-3 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={softSpring}
          className="relative flex min-h-[360px] flex-col overflow-hidden rounded-3xl bg-primary p-8 text-white sm:p-10 lg:col-span-2"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">For selgere</p>
          <h2 className={`${display} mt-3 text-4xl font-light tracking-[-0.025em] sm:text-5xl`}>
            Fra permen
            <br />
            til <em className="italic">noen som vil ha det.</em>
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Legg ut kortet ditt på et par minutter. Vil du ha mer synlighet, kan du gi annonsen{" "}
            <Link href="/annonseloft" className="text-white underline underline-offset-4">
              annonseløft
            </Link>
            .
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring} className="mt-8 w-fit lg:mt-auto">
            <Link href="/selg" className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground">
              Legg ut kort <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.ol variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="grid gap-3 sm:grid-cols-3 lg:col-span-3">
          {STEG.map((s, i) => (
            <motion.li key={s.title} variants={rise} className="flex flex-col rounded-3xl border border-zinc-200 p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-zinc-100 text-primary">
                  <s.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className={`${display} text-3xl font-light tabular-nums text-zinc-300`}>0{i + 1}</span>
              </div>
              <h3 className="mt-auto pt-10 text-lg font-semibold text-primary">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                {s.text}
                {s.href && (
                  <>
                    {" "}
                    <Link href={s.href} className="font-medium text-primary underline underline-offset-4">
                      Se solgte kort
                    </Link>
                  </>
                )}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>

      <div className="mt-3 flex flex-col gap-4 rounded-3xl border border-zinc-100 bg-zinc-50 p-6 sm:flex-row sm:items-center">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-[#ff5b24]">
          <BadgeCheckIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="font-semibold text-primary">Selgere bekrefter seg med Vipps</p>
          <p className="text-sm text-zinc-500">Merket «Verifisert med Vipps» viser at selgeren har bekreftet navnet sitt med BankID.</p>
        </div>
        <Link href="/#trygg-handel" className="text-sm font-semibold text-primary underline decoration-zinc-300 underline-offset-4 hover:decoration-current">
          Slik handler du trygt
        </Link>
      </div>
    </section>
  );
}

function Overskrift({ eyebrow, title, right }: { eyebrow: string; title: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">{eyebrow}</p>
        <h2 className={`${display} mt-2 text-4xl font-light tracking-[-0.025em] text-primary sm:text-5xl`}>{title}</h2>
      </div>
      {right}
    </div>
  );
}
