"use client";

import { useEffect } from "react";

/**
 * Teller én visning hver gang annonsesiden åpnes. Telles bare på serveren: ingenting lagres i nettleseren
 * (ekomloven § 3-15), og det sendes bare annonsens adresse, ingenting om den besøkende.
 */
export function TellVisning({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/visning/${slug}`, { method: "POST", keepalive: true }).catch(() => {});
  }, [slug]);
  return null;
}
