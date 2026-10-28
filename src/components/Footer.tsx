import Link from "next/link";
import { CookieButton } from "./CookieConsent";
import { AccountLinks } from "./AccountLinks";

const COLS = [
  {
    title: "Markedet",
    links: [
      ["/marked", "Alle kort"],
      ["/sok?q=autograf", "Autografkort"],
      ["/sok?q=relic", "Patch / relic"],
      ["/solgt", "Solgte kort"],
      ["/sok", "Søk"],
    ],
  },
  {
    title: "Selg",
    links: [
      ["/selg", "Legg ut kort"],
      ["/annonseloft", "Annonseløft"],
      ["/sporsmal", "Spørsmål og svar"],
    ],
  },
  {
    title: "Om oss",
    links: [
      ["/om-oss", "Om markedet"],
      ["/#trygg-handel", "Trygg handel"],
      ["/kontakt", "Kontakt"],
    ],
    account: true,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto max-w-[1320px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link className="inline-block" aria-label="HOBBYSTRADA" href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-hvit.svg" alt="HOBBYSTRADA" width={169} height={28} className="h-[28px] w-auto" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">Annonser for fotballkort i Norge. Kjøper og selger gjør avtalen direkte.</p>
            <a
              href="https://www.instagram.com/hobbystrada"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="HOBBYSTRADA på Instagram"
              className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-white/20 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
          <div className="fot-kol columns-2 gap-8 sm:grid sm:grid-cols-3 [&>div]:mb-8 [&>div]:break-inside-avoid sm:[&>div]:mb-0">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{c.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map(([href, label]) => (
                    <li key={href}>
                      <Link className="relative text-sm text-white/75 transition before:absolute before:-inset-y-2 before:inset-x-0 before:content-[''] hover:text-white" href={href}>
                        {label}
                      </Link>
                    </li>
                  ))}
                  {"account" in c && <AccountLinks className="relative text-sm text-white/75 transition before:absolute before:-inset-y-2 before:inset-x-0 before:content-[''] hover:text-white" />}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} HOBBYSTRADA</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {(
              [
                ["/vilkar", "Vilkår"],
                ["/salgsvilkar", "Salgsvilkår"],
                ["/personvern", "Personvern"],
                ["/refusjon", "Refusjon"],
              ] as const
            ).map(([href, label]) => (
              <Link key={href} href={href} className="relative transition before:absolute before:-inset-y-2.5 before:inset-x-0 before:content-[''] hover:text-white">
                {label}
              </Link>
            ))}
            <CookieButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
