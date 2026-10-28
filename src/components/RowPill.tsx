"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import type { Listing } from "@/lib/types";
import { formatPrice } from "@/lib/format";

/** TEST ?pill=midt: prislappen følger kortet som til enhver tid står nærmest midten av den glidende raden. */
export function RowPill({ cards }: { cards: Listing[] }) {
  const [slug, setSlug] = useState(cards[0]?.slug ?? "");
  useEffect(() => {
    let raf = 0;
    let current = "";
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const lis = document.querySelectorAll<HTMLElement>(".mag-rull > li[data-slug]");
      if (!lis.length) return;
      const mid = window.innerWidth / 2;
      let best = "";
      let dist = Infinity;
      lis.forEach((li) => {
        const r = li.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < dist) {
          dist = d;
          best = li.dataset.slug || "";
        }
      });
      if (best && best !== current) {
        current = best;
        setSlug(best);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const c = cards.find((l) => l.slug === slug) ?? cards[0];
  if (!c) return null;
  return (
    <Link
      key={c.slug}
      href={`/annonse/${c.slug}`}
      className="fan-pill flex animate-[stage-in_.5s_ease-out] items-center gap-4 rounded-full bg-[#f7f5f0] py-2 pl-5 pr-2 text-left text-[#0b1426] shadow-[0_8px_24px_-14px_rgb(11_20_38/0.35)] ring-1 ring-inset ring-[#ebe6da]"
    >
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-semibold leading-tight sm:text-sm">{c.player}</span>
        <span className="block truncate text-[11px] text-[#6b6455] sm:text-xs">{c.set}</span>
      </span>
      <span className="shrink-0 font-heading text-sm font-bold text-[#8a6a24] sm:text-base">{formatPrice(c.price)}</span>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#cfa653] text-[#0b1426]">
        <ArrowRightIcon className="h-4 w-4" aria-label="Se kortet" />
      </span>
    </Link>
  );
}
