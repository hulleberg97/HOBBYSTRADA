"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartIcon, HomeIcon, LayoutGridIcon, PlusCircleIcon, UserRoundIcon } from "lucide-react";

const TABS = [
  ["/", "Hjem", HomeIcon],
  ["/products", "Markedet", LayoutGridIcon],
  ["/sell", "Selg", PlusCircleIcon],
  ["/favoritter", "Favoritter", HeartIcon],
  ["/account", "Profil", UserRoundIcon],
] as const;

/** Fast meny nederst på mobil, som i en app. Vises bare i stil-testen (?stil2=1). */
export function MobileTabBar() {
  const path = usePathname();
  return (
    <nav aria-label="Snarveier" className="tabbar fixed inset-x-0 bottom-0 z-40 hidden border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-5">
        {TABS.map(([href, label, Icon]) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-slate-500 aria-[current=page]:text-slate-950"
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.75} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
