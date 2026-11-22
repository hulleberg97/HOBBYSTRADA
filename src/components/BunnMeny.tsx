"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRoundIcon, HouseIcon, MessageCircleIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useUser } from "./useUser";

const UnreadBadge = dynamic(() => import("./UnreadBadge").then((m) => m.UnreadBadge), { ssr: false });

/**
 * Sider uten bunnmeny: annonsesiden og samtalen har egne felt nederst (kontaktknapp og skrivefelt),
 * og innlogging, betaling, kvittering og admin skal være uten forstyrrelser.
 */
const UTEN = [/^\/annonse\//, /^\/meldinger\/.+/, /^\/auth\//, /^\/annonseloft\/betaling/, /^\/kvittering/, /^\/admin/, /^\/privat/];

const punkt = "relative flex flex-col items-center justify-end gap-0.5 pb-1.5 pt-2 text-[11px] font-semibold text-slate-500 aria-[current=page]:text-primary";
const ikon = "h-[22px] w-[22px]";

/** Fast meny nederst på telefon og nettbrett: Hjem, Søk, Selg, Meldinger og Min side. Vises ikke på PC, der toppmenyen har det samme. */
export function BunnMeny() {
  const path = usePathname();
  const user = useUser();
  if (UTEN.some((r) => r.test(path))) return null;
  const her = (p: string) => (path === p || (p !== "/" && path.startsWith(p + "/")) ? "page" : undefined);
  return (
    <nav
      aria-label="Hurtigmeny"
      className="bunnmeny fixed inset-x-0 bottom-0 z-[35] grid grid-cols-5 border-t border-slate-200 bg-[#fff] pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <Link
        href="/"
        aria-current={her("/")}
        className={punkt}
        onClick={(e) => {
          // Allerede på forsiden: rull til toppen i stedet for å laste på nytt
          if (path !== "/") return;
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <HouseIcon className={ikon} strokeWidth={1.75} aria-hidden="true" />
        Hjem
      </Link>
      <Link href="/sok" aria-current={her("/sok")} className={punkt}>
        <SearchIcon className={ikon} strokeWidth={1.75} aria-hidden="true" />
        Søk
      </Link>
      <Link href="/selg" prefetch={false} aria-current={her("/selg")} className={punkt}>
        <span className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-[0_8px_18px_-8px_rgb(11_20_38/0.7)] ring-4 ring-[#fff]">
          <PlusIcon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
        </span>
        Selg
      </Link>
      <Link href={user ? "/meldinger" : "/auth/login?next=/meldinger"} prefetch={false} aria-current={her("/meldinger")} className={punkt}>
        <span className="relative">
          <MessageCircleIcon className={ikon} strokeWidth={1.75} aria-hidden="true" />
          {user && <UnreadBadge />}
        </span>
        Meldinger
      </Link>
      <Link href={user ? "/account" : "/auth/login?next=/account"} prefetch={false} aria-current={her("/account")} className={punkt}>
        <CircleUserRoundIcon className={ikon} strokeWidth={1.75} aria-hidden="true" />
        {user === null ? "Logg inn" : "Min side"}
      </Link>
    </nav>
  );
}
