import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, btnPrimary } from "@/components/ui";
import { MessageCircleIcon, ShieldCheckIcon, ShoppingBagIcon, TagIcon, ZapIcon } from "lucide-react";
import { AccordionItem } from "@/components/Accordion";

export const metadata: Metadata = { title: "Spørsmål og svar" };

const SECTIONS = [
  {
    title: "Kjøpe",
    Icon: ShoppingBagIcon,
    items: [
      [
        "Hvordan kjøper jeg et kort?",
        "Logg inn, åpne annonsen og trykk «Send melding til selger». Du kan skrive en melding eller gi et bud. I chatten under Meldinger avtaler dere pris, betaling og frakt eller henting.",
      ],
      [
        "Kan jeg betale for kortet her på siden?",
        "Nei. Kort i markedet kjøpes direkte fra selgeren, og betalingen avtales mellom dere. Kassen på siden brukes bare til annonseløft.",
      ],
      [
        "Hva betyr «Fremhevet»?",
        "Selgeren har kjøpt annonseløft. Fremhevede annonser har gullmerke og vises foran vanlige annonser i markedet. Toppannonser vises aller først.",
      ],
      ["Hva betyr «Illustrasjon»?", "Selgeren har ikke lastet opp bilde ennå. Be alltid om bilder av forside og bakside før du handler."],
    ],
  },
  {
    title: "Selge",
    Icon: TagIcon,
    items: [
      [
        "Hvordan legger jeg ut et kort?",
        "Trykk «Legg ut kort» og fyll inn spiller, sett, tilstand eller gradering, pris og bilder. Trykk «Send inn annonsen» når du er ferdig.",
      ],
      [
        "Når blir annonsen synlig?",
        "Vi går gjennom annonser før de publiseres i markedet. Du ser statusen på Min side, og annonsen dukker opp i markedet så snart den er godkjent.",
      ],
      [
        "Hvilke bilder bør jeg legge ved?",
        "Forsidebilde er påkrevd. Legg gjerne ved bakside og opptil fire nærbilder av sentrering, hjørner, kanter og overflate – det gir kjøperen trygghet.",
      ],
      ["Kan jeg selge graderte kort?", "Ja. Oppgi graderingsselskap og karakter, for eksempel PSA 10 eller BGS 9.5. Ugraderte kort kalles ofte «raw»."],
    ],
  },
  {
    title: "Annonseløft",
    Icon: ZapIcon,
    items: [
      [
        "Hva er annonseløft?",
        "Annonseløft gir annonsen mer synlighet. Du kan velge Topp av listen (3 dager), Fremhevet (7 dager) eller Toppannonse (30 dager). Toppannonser er med i kortvifta øverst på forsiden hele perioden. Priser finner du på siden for annonseløft.",
      ],
      ["Hvordan kjøper jeg annonseløft?", "Velg pakke på siden for annonseløft og betal i kassen her på siden."],
    ],
  },
  {
    title: "Trygg handel",
    Icon: ShieldCheckIcon,
    items: [
      [
        "Hvordan handler jeg trygt?",
        "Be om bilder eller video av kortet, gjerne med en lapp med dagens dato ved siden av. Sjekk at mottakeren i Vipps eller banken har samme fornavn som selgeren i annonsen, og møt selgeren hvis dere bor i nærheten. Vurder frakt med sporing for best mulig trygghet, og vær ekstra varsom hvis prisen er langt under markedet.",
      ],
      [
        "Hvem har ansvaret hvis noe går galt?",
        "Kjøper og selger. HOBBYSTRADA er en annonseplass og ikke part i handelen. Vi har derfor ikke ansvar for kortet, betalingen eller frakten. Uenighet løses mellom dere, og ved svindel bør du kontakte politiet. Vi fjerner annonser og stenger kontoer som bryter vilkårene.",
      ],
      ["Kan jeg sende bilder i chatten?", "Ja. Trykk på bildeknappen i chatten for å sende et bilde, for eksempel av baksiden eller et hjørne av kortet."],
      ["Jeg ser en mistenkelig annonse. Hva gjør jeg?", "Trykk «Rapporter» på annonsen, eller kontakt oss med lenken til annonsen."],
    ],
  },
];

export default function FaqPage() {
  return (
    <div>
      <PageHeader eyebrow="Hjelp" title="Spørsmål og svar" lead="Alt du trenger å vite om å kjøpe, selge og løfte annonser i markedet.">
        <nav className="mt-8 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" aria-label="Spørsmål og svar">
          {SECTIONS.map(({ title, Icon }, i) => (
            <Link
              key={title}
              href={`#del-${i + 1}`}
              className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 ring-1 ring-inset ring-slate-300 transition hover:ring-primary"
            >
              <Icon className="h-[18px] w-[18px] text-primary" strokeWidth={1.75} aria-hidden="true" />
              {title}
            </Link>
          ))}
        </nav>
      </PageHeader>
      <div className="mx-auto max-w-[1320px] px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-12">
          {SECTIONS.map((s, i) => (
            <section key={s.title} id={`del-${i + 1}`} className="scroll-mt-28">
              <h2 className="mb-4 font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950">{s.title}</h2>
              <div className="rounded-3xl bg-white px-5 ring-1 ring-slate-200 sm:px-7">
                {s.items.map(([q, a]) => (
                  <AccordionItem key={q} q={q}>
                    {a}
                  </AccordionItem>
                ))}
              </div>
            </section>
          ))}
          <div className="flex flex-col items-start gap-5 rounded-3xl bg-white p-7 ring-1 ring-slate-300/70 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary">
                <MessageCircleIcon className="h-5 w-5 text-accent" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-heading text-xl font-bold tracking-tight text-slate-950">Fant du ikke svaret?</h2>
                <p className="mt-1 text-sm text-slate-600">Send oss en melding, så hjelper vi deg.</p>
              </div>
            </div>
            <Link className={btnPrimary} href="/contact">
              Kontakt oss
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
