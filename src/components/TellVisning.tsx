"use client";

import { useEffect } from "react";

const KEY = "hs_sett";

/**
 * Teller én visning per person: første gang annonsen åpnes i denne nettleseren. Åpner samme person annonsen igjen,
 * telles det ikke på nytt. Listen over sette annonser ligger bare i nettleseren, og det sendes bare annonsens adresse.
 */
export function TellVisning({ slug }: { slug: string }) {
  useEffect(() => {
    let seen: string[] = [];
    try {
      seen = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (!Array.isArray(seen)) seen = [];
    } catch {
      seen = [];
    }
    if (seen.includes(slug)) return;
    try {
      localStorage.setItem(KEY, JSON.stringify([...seen, slug].slice(-500)));
    } catch {}
    fetch(`/api/visning/${slug}`, { method: "POST", keepalive: true }).catch(() => {});
  }, [slug]);
  return null;
}
