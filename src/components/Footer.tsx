import Link from "next/link";
import { LangToggle } from "./LangToggle";
import { CookieButton } from "./CookieConsent";

const COLS = [
  {
    title: "Markedet",
    links: [
      ["/products", "Alle kort"],
      ["/search?q=autograf", "Autografkort"],
      ["/search?q=relic", "Relic og patch"],
      ["/search", "Søk"],
    ],
  },
  {
    title: "Selg",
    links: [
      ["/sell", "Legg ut kort"],
      ["/annonseloft", "Annonseløft"],
      ["/faq", "Spørsmål og svar"],
    ],
  },
  {
    title: "Om oss",
    links: [
      ["/about", "Om markedet"],
      ["/#trygg-handel", "Trygg handel"],
      ["/contact", "Kontakt"],
      ["/auth/login", "Logg inn"],
      ["/auth/register", "Opprett konto"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto max-w-[1320px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link className="inline-block" aria-label="HOBBYSTRADA" href="/">
              <span className="relative block h-9 w-[148px] overflow-hidden sm:h-10 sm:w-[166px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/logo-footer.webp"
                  alt="HOBBYSTRADA"
                  className="absolute left-[-25px] top-[-42px] h-[127px] w-[191px] max-w-none mix-blend-lighten [filter:contrast(1.6)] sm:left-[-28px] sm:top-[-47px] sm:h-[142px] sm:w-[214px]"
                />
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Annonser for fotballkort i Norge. Kjøper og selger gjør avtalen direkte.
            </p>
            <LangToggle dark className="mt-6" />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{c.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map(([href, label]) => (
                    <li key={href}>
                      <Link className="text-sm text-white/75 transition hover:text-white" href={href}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} HOBBYSTRADA. Alle rettigheter forbeholdt.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <CookieButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
