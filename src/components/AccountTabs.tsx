import Link from "next/link";

const TABS = [
  ["annonser", "Annonser", "/account"],
  ["meldinger", "Meldinger", "/meldinger"],
  ["varsler", "Lagrede søk", "/account?fane=varsler"],
  ["konto", "Konto", "/account?fane=konto"],
] as const;

/** Fanene på Min side. Meldinger har egen side, men samme faner. */
export function AccountTabs({ active, unread = 0, listings, alerts }: { active: string; unread?: number; listings?: number; alerts?: number }) {
  return (
    <nav aria-label="Min side" className="border-b border-slate-300/60">
      <ul className="mx-auto flex max-w-[880px] gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:px-6">
        {TABS.map(([key, label, href]) => (
          <li key={key}>
            <Link
              href={href}
              aria-current={active === key ? "page" : undefined}
              className="relative flex h-12 items-center gap-2 whitespace-nowrap px-3 text-sm font-semibold text-slate-500 transition after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full hover:text-slate-900 aria-[current=page]:text-slate-950 aria-[current=page]:after:bg-primary"
            >
              {label}
              {key === "annonser" && listings !== undefined && <span className="text-xs font-medium text-slate-400">{listings}</span>}
              {key === "meldinger" && unread > 0 && (
                <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-sky-600 px-1 text-[11px] font-bold text-white">
                  {unread}
                </span>
              )}
              {key === "varsler" && !!alerts && <span className="text-xs font-medium text-slate-400">{alerts}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
