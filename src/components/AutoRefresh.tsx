"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Laster siden på nytt med jevne mellomrom, et begrenset antall ganger. Brukes mens vi venter på Vipps. */
export function AutoRefresh({ every = 3000, times = 20 }: { every?: number; times?: number }) {
  const router = useRouter();
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => {
      if (++n > times) clearInterval(t);
      else router.refresh();
    }, every);
    return () => clearInterval(t);
  }, [router, every, times]);
  return null;
}
