import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, btnPrimary } from "@/components/ui";
import { MessageCircleIcon, ShieldCheckIcon, ShoppingBagIcon, TagIcon, ZapIcon } from "lucide-react";
import { AccordionItem } from "@/components/Accordion";

export const metadata: Metadata = { title: "Spørsmål og svar", alternates: { canonical: "/sporsmal" } };

/** Spørsmål og svar. Teksten er Låvlis reviderte utkast av 30. oktober 2026, lagt inn ordrett. */
const SECTIONS = [
  {
    title: "Kjøpe",
    Icon: ShoppingBagIcon,
    items: [
      [
        "Hvordan kjøper jeg et kort?",
        "Logg inn, åpne annonsen og trykk «Send melding til selger». Du kan skrive en melding eller gi et bud. I chatten avtaler dere pris, betaling og frakt eller henting.",
      ],
      ["Kan jeg betale for kort på HOBBYSTRADA?", "Nei. Kort kjøpes direkte fra selgeren, og betalingen avtales mellom dere. Kassen på siden brukes bare til annonseløft."],
      [
        "Hvordan gir jeg bud, og når er handelen bindende?",
        "Trykk «Bud» i chatten og skriv beløpet i hele kroner. Budet er et uforpliktende prisforslag. Godtar selgeren, får du en lenke som åpner Vipps med selgeren valgt. Dere er først bundet når du har betalt.",
      ],
      [
        "Hvordan betaler jeg selgeren?",
        "Når budet er godtatt, får du knappen «Åpne Vipps og betal selgeren» i chatten. Sjekk at navnet i Vipps er det samme som selgerens navn i chatten, og skriv inn beløpet. Pengene går rett til selgeren. Dette er en privat betaling, og Vipps’ kjøpsbeskyttelse gjelder ikke. HOBBYSTRADA er ikke part i betalingen.",
      ],
      [
        "Hvem har ansvaret hvis noe går galt i en handel?",
        "Kjøper og selger. HOBBYSTRADA er en annonseplass og ikke part i handelen, og har derfor ikke ansvar for kortet, betalingen eller frakten. Selgerne er privatpersoner, så forbrukerkjøpsloven og angrerett gjelder ikke. Uenighet løses mellom dere. Ved svindel bør du kontakte politiet og rapportere annonsen eller brukeren.",
      ],
    ],
  },
  {
    title: "Selge",
    Icon: TagIcon,
    items: [
      [
        "Blir annonsene sjekket?",
        "Vi kan gå gjennom annonser før eller etter at de publiseres, for å se om de følger reglene. Vi sjekker ikke at kortet er ekte, i oppgitt tilstand eller tilgjengelig. Du ser statusen på annonsen din under Min side.",
      ],
      [
        "Hvorfor må jeg logge inn med Vipps?",
        "Alle som legger ut kort eller sender meldinger, logger inn med Vipps, så kjøper og selger vet hvem de handler med. Fornavnet vises på annonsen, hele navnet i chatten. «Verifisert med Vipps» betyr bare at brukeren har logget inn med Vipps.",
      ],
    ],
  },
  {
    title: "Annonseløft",
    Icon: ZapIcon,
    items: [
      [
        "Hvorfor vises noen annonser først?",
        "Annonser med annonseløft vises først, i rekkefølgen Toppannonse, Fremhevet og Topp av listen, og er merket «Annonseløft». Deretter kommer andre annonser, nyeste først. Sorterer du selv etter pris eller navn, sorteres alle likt. Forsiden viser også annonser vi har valgt selv; disse er ikke betalt for. Les mer under «Slik sorteres annonsene» i vilkårene.",
      ],
      ["Hva koster annonseløft?", "Topp av listen 39 kr (3 dager), Fremhevet 79 kr (7 dager) og Toppannonse 199 kr (30 dager). Prisene er totalpriser, og løftet fornyes ikke automatisk."],
      [
        "Kan jeg angre et annonseløft?",
        "Ja, innen 14 dager. Trykk «Angre avtalen» på kvitteringen under Min side, send angreskjemaet eller send en e-post. Du betaler for den delen av perioden som er brukt, og får resten tilbake innen 14 dager. Les mer i salgsvilkårene under «Angrerett».",
      ],
    ],
  },
  {
    title: "Konto",
    Icon: ShieldCheckIcon,
    items: [
      [
        "Hvordan sletter jeg kontoen?",
        "Gå til Min side, Konto, og trykk «Slett kontoen min». Konto, annonser, varsler og lagrede søk slettes. Meldinger du har sendt, blir stående hos mottakeren som «Slettet bruker», og kvitteringer for annonseløft beholdes så lenge bokføringsloven krever.",
      ],
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
            <Link className={btnPrimary} href="/kontakt">
              Kontakt oss
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
