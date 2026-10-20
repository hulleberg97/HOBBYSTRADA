"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { listen } from "@/lib/realtime";

/** Antall samtaler med uleste meldinger. Oppdateres ved sidebytte, i sanntid og når chatten sier fra. */
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
    const t = setInterval(load, 120000);
    window.addEventListener("hs:unread", load);
    // Sanntid: Supabase sier fra når en av brukerens samtaler endres (bare egne samtaler er synlige)
    const stop = listen(`uleste-${Math.random().toString(36).slice(2)}`, (channel) =>
      channel.on("postgres_changes", { event: "UPDATE", schema: "public", table: "conversations" }, load),
    );
    return () => {
      clearInterval(t);
      window.removeEventListener("hs:unread", load);
      stop();
    };
  }, [path]);
  if (!count) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-sky-600 px-1 text-[11px] font-bold leading-none text-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}
