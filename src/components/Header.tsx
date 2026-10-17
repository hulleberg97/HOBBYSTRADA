"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CircleUserIcon, LayoutGridIcon, MenuIcon, SearchIcon, ShoppingBagIcon, XIcon, ZapIcon } from "lucide-react";
import { LangToggle } from "./LangToggle";
import { CartDrawer } from "./CartDrawer";

const NAV = [
  { href: "/products", label: "Markedet", Icon: LayoutGridIcon },
  { href: "/annonseloft", label: "Annonseløft", Icon: ZapIcon },
];

export function Header({ user }: { user: { name: string } | null }) {
  const router = useRouter();
  const path = usePathname();
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(false);
  const [cart, setCart] = useState(false);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
    setMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 text-primary backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1320px] items-center gap-4 px-4 sm:px-6 lg:gap-6 lg:px-8">
          <Link className="flex shrink-0 items-center gap-2" href="/">
            <span className="relative block h-7 w-[115px] overflow-hidden sm:h-9 sm:w-[148px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/logo-header.webp"
                alt="HOBBYSTRADA"
                className="absolute left-[-20px] top-[-33px] h-[99px] w-[148px] max-w-none sm:left-[-25px] sm:top-[-42px] sm:h-[127px] sm:w-[191px]"
              />
            </span>
          </Link>
          <form className="hidden max-w-[480px] flex-1 md:block" role="search" onSubmit={search}>
            <label className="relative block">
              <span className="sr-only">Søk etter spiller, sett eller kort</span>
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
              <input
                placeholder="Søk i alle annonser"
                className="h-12 w-full rounded-full border border-slate-300 bg-white pl-11 pr-4 text-[15px] text-primary outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
          </form>
          <nav className="ml-auto hidden items-center gap-1 xl:flex" aria-label="Hovedmeny">
            {NAV.map(({ href, label, Icon }) => (
              <Link
                key={href}
                data-current={path.startsWith(href) ? "true" : undefined}
                className="flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-primary data-[current=true]:bg-slate-100 data-[current=true]:text-primary"
                href={href}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1.5 xl:ml-0">
            <div className="hidden lg:block">
              <LangToggle />
            </div>
            <Link
              className="hidden h-10 items-center gap-2 rounded-full bg-slate-100 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-200 sm:flex"
              href={user ? "/account" : "/auth/login"}
            >
              <CircleUserIcon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
              {user ? "Min side" : "Logg inn"}
            </Link>
            <button
              type="button"
              aria-label="Handlekurv"
              onClick={() => setCart(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
            >
              <ShoppingBagIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <Link
              className="hidden h-10 items-center whitespace-nowrap rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-black sm:flex"
              href="/sell"
            >
              Legg ut kort
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
        <form className="px-4 pb-3 md:hidden" role="search" onSubmit={search}>
          <label className="relative block">
            <span className="sr-only">Søk etter spiller, sett eller kort</span>
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              placeholder="Søk etter Messi eller Topps Chrome"
              className="h-11 w-full rounded-full border border-slate-300 bg-white pl-11 pr-4 text-[15px] outline-none placeholder:text-slate-500 focus:border-primary"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
        </form>
        {menu && (
          <nav className="border-t border-slate-200 bg-white px-4 pb-5 pt-2 sm:px-6 xl:hidden" aria-label="Mobilmeny">
            <ul className="divide-y divide-slate-100">
              {[...NAV, { href: "/sell", label: "Legg ut kort", Icon: null }, { href: user ? "/account" : "/auth/login", label: user ? "Min side" : "Logg inn", Icon: CircleUserIcon }].map(
                ({ href, label, Icon }) => (
                  <li key={href}>
                    <Link onClick={() => setMenu(false)} className="flex items-center gap-3 py-3.5 text-[15px] font-medium text-slate-800" href={href}>
                      {Icon && <Icon className="h-[18px] w-[18px] text-slate-500" strokeWidth={1.75} aria-hidden="true" />}
                      {label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
            <LangToggle className="mt-4 lg:hidden" />
          </nav>
        )}
      </header>
      <CartDrawer open={cart} onClose={() => setCart(false)} />
    </>
  );
}
