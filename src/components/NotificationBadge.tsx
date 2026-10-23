"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Antall uleste varsler på bjella. Oppdateres ved sidebytte og hvert annet minutt. */
export function NotificationBadge() {
  const [count, setCount] = useState(0);
  const path = usePathname();
  useEffect(() => {
    const load = () =>
      fetch("/api/notifications/unread", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : { count: 0 }))
        .then((d) => setCount(d.count ?? 0))
        .catch(() => {});
    load();
    const t = setInterval(load, 120000);
    return () => clearInterval(t);
  }, [path]);
  if (!count) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-sky-600 px-1 text-[11px] font-bold leading-none text-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}
