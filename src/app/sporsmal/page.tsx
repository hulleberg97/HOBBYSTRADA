import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, btnPrimary } from "@/components/ui";
import { MessageCircleIcon, ShieldCheckIcon, ShoppingBagIcon, TagIcon, ZapIcon } from "lucide-react";
import { AccordionItem } from "@/components/Accordion";

export const metadata: Metadata = { title: "Spørsmål og svar", alternates: { canonical: "/sporsmal" } };

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
        "Hvordan gir jeg bud?",
        "Trykk «Bud» i chatten og skriv beløpet i hele kroner. Selgeren kan godta eller avslå. Godtar selgeren, er avtalen inngått mellom dere, og du får en Vipps-knapp i chatten.",
      ],
      [
        "Hvordan betaler jeg?",
        "Når budet er godtatt, får du knappen «Betal med Vipps» i chatten. Den åpner Vipps med selgeren valgt. Sjekk at navnet i Vipps er det samme som selgerens navn i chatten, og skriv inn beløpet. Pengene går rett til selgeren; HOBBYSTRADA er ikke part i betalingen.",
      ],
      [
        "Hvordan får jeg kortet tilsendt?",
        "Trykk «Send adressen min» i chatten etter at budet er godtatt. Selgeren kjøper frakt hos Posten og legger inn sendingsnummeret, som blir en sporingslenke i chatten. Dere kan også avtale henting.",
      ],
      [
        "Hva betyr «Fremhevet»?",
        "Selgeren har kjøpt annonseløft. Fremhevede annonser har gullmerke og vises foran vanlige annonser og annonser med Topp av listen. Toppannonser vises aller først.",
      ],
      ["Hva betyr «Illustrasjon»?", "Illustrasjon vises bare på annonser uten bilde. Alle nye annonser må ha bilde av forsiden, og du kan alltid be selgeren om flere bilder i chatten."],
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
      [
        "Hvordan beskjærer jeg bildene?",
        "Når du velger et bilde, kan du dra i hjørnene og kantene for å velge utsnittet, og rotere det, før det legges til. Trykk «Beskjær» på et bilde for å gjøre det på nytt.",
      ],
      ["Hvor mange annonser kan jeg ha?", "Så mange du vil, men én annonse per kort. Flere kort kan selges samlet i én annonse, for eksempel en bunke."],
      [
        "Kan jeg endre annonsen etterpå?",
        "Ja. Under Min side kan du endre pris, sted, tilstand, klubb, liga, beskrivelse og bilder. Nye bilder må godkjennes før annonsen vises igjen.",
      ],
      [
        "Hva gjør jeg når kortet er solgt?",
        "Trykk «Merk som solgt» under Min side. Annonsen flyttes til prisarkivet «Solgte kort» i 12 måneder. Har annonsen aktivt løft, stopper løftet.",
      ],
      [
        "Hvorfor må jeg bekrefte meg med Vipps?",
        "Alle som legger ut kort eller sender meldinger, logger inn med Vipps, så kjøper og selger vet hvem de handler med. Fornavnet vises på annonsen, hele navnet i chatten.",
      ],
    ],
  },
  {
    title: "Annonseløft",
    Icon: ZapIcon,
    items: [
      [
        "Hva er annonseløft?",
        "Annonseløft gir annonsen mer synlighet. Du kan velge Topp av listen (3 dager), Fremhevet (7 dager) eller Toppannonse (30 dager). Fremhevede annonser vises på forsiden i 7 dager, og toppannonser vises først på forsiden i 30 dager. Priser finner du på siden for annonseløft.",
      ],
      ["Hvordan kjøper jeg annonseløft?", "Velg annonse og pakke på siden for annonseløft, kryss av for angrerett og betal med Vipps. Topp av listen koster 39 kr (3 dager), Fremhevet 79 kr (7 dager) og Toppannonse 199 kr (30 dager)."],
      [
        "Hvordan fungerer forsiden?",
        "Raden øverst på forsiden viser toppannonser først, deretter fremhevede annonser, deretter kort vi selv har valgt. Finnes ingen av disse, vises de nyeste annonsene. Kort vi velger selv er ikke betalt for.",
      ],
      [
        "Kan jeg angre et annonseløft?",
        "Ja, innen 14 dager. Trykk «Angre avtalen» på kvitteringen under Min side. Du betaler for dagene som er brukt og får resten tilbake innen 14 dager.",
      ],
    ],
  },
  {
    title: "Trygg handel",
    Icon: ShieldCheckIcon,
    items: [
      [
        "Hvordan handler jeg trygt?",
        "Be om bilder eller video av kortet, gjerne med en lapp med dagens dato ved siden av. Sjekk at mottakeren i Vipps eller banken har samme navn som selgeren i chatten, og møt selgeren hvis dere bor i nærheten. Vurder frakt med sporing for best mulig trygghet, og vær ekstra varsom hvis prisen er langt under markedet.",
      ],
      [
        "Hvem har ansvaret hvis noe går galt?",
        "Kjøper og selger. HOBBYSTRADA er en annonseplass og ikke part i handelen. Vi har derfor ikke ansvar for kortet, betalingen eller frakten. Uenighet løses mellom dere, og ved svindel bør du kontakte politiet. Vi fjerner annonser og stenger kontoer som bryter vilkårene.",
      ],
      ["Kan jeg sende bilder i chatten?", "Ja. Trykk på bildeknappen i chatten for å sende et bilde, for eksempel av baksiden eller et hjørne av kortet."],
      ["Jeg ser en mistenkelig annonse. Hva gjør jeg?", "Trykk «Rapporter» på annonsen, eller kontakt oss med lenken til annonsen."],
      [
        "Hvordan får jeg beskjed om nye kort?",
        "Filtrer i markedet og trykk «Varsle meg om nye kort», så får du e-post og et varsel når et nytt kort passer. Søkene finner du under Min side.",
      ],
      [
        "Hvordan sletter jeg kontoen?",
        "Gå til Min side, Konto, og trykk «Slett kontoen min». Konto, annonser, bilder, varsler og lagrede søk slettes. Meldinger du har sendt blir stående hos mottakeren som «Slettet bruker», og kvitteringer for annonseløft beholdes etter bokføringsloven.",
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
