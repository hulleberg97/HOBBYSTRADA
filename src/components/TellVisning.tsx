"use client";

import { useEffect } from "react";

/** Teller én visning når annonsesiden åpnes. Sender bare annonsens adresse, ingenting om den besøkende. */
export function TellVisning({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/visning/${slug}`, { method: "POST", keepalive: true }).catch(() => {});
  }, [slug]);
  return null;
}
