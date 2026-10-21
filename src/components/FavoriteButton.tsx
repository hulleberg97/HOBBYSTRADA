"use client";

import { HeartIcon } from "lucide-react";
import { toggleFavorite, useFavorites } from "@/lib/favorites";

/** Hjerte som lagrer annonsen som favoritt. «card» ligger oppå bildet i annonsekortet. */
export function FavoriteButton({ slug, title, variant = "card" }: { slug: string; title: string; variant?: "card" | "detail" }) {
  const on = useFavorites().includes(slug);
  const click = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(slug);
  };
  if (variant === "detail") {
    return (
      <button
        type="button"
        onClick={click}
        aria-pressed={on}
        className="tap-sm inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 aria-pressed:text-rose-600"
      >
        <HeartIcon className={`h-4 w-4 ${on ? "fill-current" : ""}`} aria-hidden="true" />
        {on ? "Lagret" : "Lagre"}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={click}
      aria-pressed={on}
      aria-label={on ? `Fjern ${title} fra favoritter` : `Lagre ${title} som favoritt`}
      className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 before:absolute before:-inset-1.5 before:content-[''] text-slate-700 shadow-sm ring-1 ring-slate-200 backdrop-blur transition hover:scale-105 hover:text-rose-600 aria-pressed:text-rose-600 sm:right-3 sm:top-3"
    >
      <HeartIcon className={`h-4 w-4 ${on ? "fill-current" : ""}`} aria-hidden="true" />
    </button>
  );
}

export function FavoriteCount() {
  const n = useFavorites().length;
  if (!n) return null;
  return (
    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
      {n}
    </span>
  );
}
