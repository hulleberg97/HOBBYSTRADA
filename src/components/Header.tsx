"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BellIcon, CircleUserIcon, HeartIcon, MenuIcon, MessageCircleIcon, PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { FavoriteCount } from "./FavoriteButton";
import { useUser } from "./useUser";
import { SearchSuggest } from "./SearchSuggest";

// Lastes bare for innloggede, så Supabase-koden ikke følger med for alle besøkende
const UnreadBadge = dynamic(() => import("./UnreadBadge").then((m) => m.UnreadBadge), { ssr: false });
const NotificationBadge = dynamic(() => import("./NotificationBadge").then((m) => m.NotificationBadge), { ssr: false });

const MOBILE_NAV = [
  ["/marked", "Markedet"],
  ["/solgt", "Solgte kort"],
  ["/selg", "Legg ut kort"],
  ["/favoritter", "Favoritter"],
];

const PLACEHOLDER = "Søk etter spiller, lag eller sett, f.eks. Haaland auto";

/** Alt som forklarer hvordan markedet virker, samlet i én meny. */
const HELP = [
  ["/#trygg-handel", "Trygg handel", "Slik handler du trygt"],
  ["/annonseloft", "Annonseløft", "Selg raskere med synlighet"],
  ["/solgt", "Solgte kort", "Se prisene på solgte kort"],
  ["/sporsmal", "Spørsmål og svar", "Svar på det folk lurer på"],
  ["/om-oss", "Om oss", "Om markedet og hvem som driver det"],
  ["/kontakt", "Kontakt", "Send oss en melding"],
];

export function Header() {
  const user = useUser();
  const router = useRouter();
  const path = usePathname();
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  // Mobilmenyen: lås siden bak, så bare menyen ruller
  useEffect(() => {
    if (!menu) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    const place = () => setMenuTop(headerRef.current?.getBoundingClientRect().bottom ?? 0);
    place();
    window.addEventListener("resize", place);
    return () => {
      html.style.overflow = before;
      window.removeEventListener("resize", place);
    };
  }, [menu]);

  const go = (term: string) => {
    // Søket går rett til markedet, der filtrene er
    router.push(term.trim() ? `/marked?q=${encodeURIComponent(term.trim())}` : "/marked");
    setMenu(false);
  };
  const search = (e: React.FormEvent) => {
    e.preventDefault();
    go(q);
  };

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 text-primary backdrop-blur">
        <div className="mx-auto flex h-[60px] max-w-[1320px] items-center gap-3 px-4 sm:h-[72px] sm:px-6 lg:gap-5 lg:px-8">
          {/* Logoen er alltid en forsideknapp: lukker menyen, og ruller til toppen om du allerede er på forsiden */}
          <Link
            className="flex shrink-0 items-center gap-2"
            href="/"
            aria-label="HOBBYSTRADA – til forsiden"
            onClick={(e) => {
              setMenu(false);
              if (path === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                router.refresh();
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.svg" alt="HOBBYSTRADA" width={169} height={28} fetchPriority="high" className="h-[22px] w-auto sm:h-[26px]" />
          </Link>
          {/* Søket står alltid synlig: i toppen på PC, i egen rad under på mobil */}
          <form className="hidden min-w-0 flex-1 md:block" role="search" onSubmit={search}>
            <SearchField q={q} setQ={setQ} go={go} />
          </form>
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Hovedmeny">
            {(
              [
                ["/marked", "Markedet"],
                ["/solgt", "Solgte kort"],
              ] as const
            ).map(([href, label]) => (
              <Link
                key={href}
                data-current={path.startsWith(href) ? "true" : undefined}
                className="whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-primary data-[current=true]:bg-slate-100 data-[current=true]:text-primary"
                href={href}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Link
              className="flex h-9 items-center gap-1 whitespace-nowrap rounded-full bg-primary px-3.5 text-[13px] font-semibold text-white transition hover:bg-black sm:h-10 sm:px-5 sm:text-sm"
              href="/selg"
            >
              <PlusIcon className="h-4 w-4 sm:hidden" aria-hidden="true" />
              Legg ut kort
            </Link>
            <Link
              className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-full px-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:flex"
              href={user ? "/account" : "/auth/login"}
            >
              <CircleUserIcon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
              {user ? "Min side" : "Logg inn"}
            </Link>
            {/* Meldinger, varsler og favoritter som ikoner på PC; på mobil ligger de i menyen */}
            <Link
              href={user ? "/meldinger" : "/auth/login?next=/meldinger"}
              aria-label="Meldinger"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 sm:flex"
            >
              <MessageCircleIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              {user && <UnreadBadge />}
            </Link>
            {user && (
              <Link
                href="/varsler"
                aria-label="Varsler"
                className="relative hidden h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 sm:flex"
              >
                <BellIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                <NotificationBadge />
              </Link>
            )}
            <Link
              href="/favoritter"
              aria-label="Favoritter"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 sm:flex"
            >
              <HeartIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              <FavoriteCount />
            </Link>
            <button
              type="button"
              aria-label={menu ? "Lukk meny" : "Åpne meny"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100 xl:hidden"
            >
              {menu ? <XIcon className="h-5 w-5" aria-hidden="true" /> : <MenuIcon className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
        <form className="px-4 pb-2.5 sm:px-6 md:hidden" role="search" onSubmit={search}>
          <SearchField q={q} setQ={setQ} go={go} />
        </form>
      </header>
      {menu && (
        <div
          style={{ top: menuTop }}
          className="fixed inset-x-0 bottom-0 z-50 flex flex-col overflow-y-auto overscroll-contain border-t border-slate-200 bg-white px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 xl:hidden"
        >
          <nav className="mx-auto flex w-full max-w-[1320px] flex-col sm:px-2" aria-label="Mobilmeny">
            {(user ? [["/meldinger", "Meldinger"], ["/varsler", "Varsler"], ...MOBILE_NAV] : MOBILE_NAV).map(([href, label]) => (
              <Link
                key={href}
                onClick={() => setMenu(false)}
                className="flex items-center justify-between border-b border-slate-100 py-4 text-lg font-semibold tracking-tight last:border-0"
                href={href}
              >
                {label}
                <span className="text-slate-400">›</span>
              </Link>
            ))}
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6a24]">Slik fungerer det</p>
            <ul className="mt-1">
              {HELP.map(([href, label]) => (
                <li key={href}>
                  <Link
                    onClick={() => setMenu(false)}
                    className="flex items-center justify-between border-b border-slate-100 py-3 text-[15px] font-medium text-slate-700 last:border-0"
                    href={href}
                  >
                    {label}
                    <span className="text-slate-400">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto grid grid-cols-2 gap-2 pt-6 sm:hidden">
            <Link
              onClick={() => setMenu(false)}
              className="flex h-12 items-center justify-center rounded-full bg-[#f5f1e8] text-sm font-semibold text-[#0b1426]"
              href={user ? "/account" : "/auth/login"}
            >
              {user ? "Min side" : "Logg inn"}
            </Link>
            <Link
              onClick={() => setMenu(false)}
              className="flex h-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
              href="/selg"
            >
              Legg ut kort
            </Link>
          </div>
          {user && (
            <form action="/auth/logout" method="post" className="pt-2 sm:mt-auto sm:pt-6">
              <button className="h-12 w-full rounded-full text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50">Logg ut</button>
            </form>
          )}
        </div>
      )}
    </>
  );
}

function SearchField({ q, setQ, go }: { q: string; setQ: (v: string) => void; go: (v: string) => void }) {
  return (
    <label className="relative block w-full md:max-w-xl">
      <span className="sr-only">{PLACEHOLDER}</span>
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
      <SearchSuggest
        value={q}
        onChange={setQ}
        onPick={go}
        inputProps={{
          placeholder: PLACEHOLDER,
          enterKeyHint: "search",
          className:
            "h-10 w-full rounded-full border border-slate-300 bg-slate-50 pl-10 pr-4 text-[15px] outline-none placeholder:text-slate-500 focus:border-primary focus:bg-white sm:h-11",
        }}
      />
    </label>
  );
}
