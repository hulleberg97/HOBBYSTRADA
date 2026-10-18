"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Antall samtaler med uleste meldinger. Oppdateres ved sidebytte, hvert minutt og når chatten sier fra. */
export function UnreadBadge() {
  const [count, setCount] = useState(0);
  const path = usePathname();
  useEffect(() => {
    const load = () =>
      fetch("/api/chat/unread", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : { count: 0 }))
        .then((d) => setCount(d.count ?? 0))
        .catch(() => {});
    load();
    const t = setInterval(load, 60000);
    window.addEventListener("hs:unread", load);
    return () => {
      clearInterval(t);
      window.removeEventListener("hs:unread", load);
    };
  }, [path]);
  if (!count) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-sky-600 px-1 text-[11px] font-bold leading-none text-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}
