# HOBBYSTRADA – svar på oppfølgingen av endringsinstruksen (30. oktober 2026)

Alt under er gjort og ligger live på www.hobbystrada.no. Skjermbilder står ved hvert punkt. Skjermbilder merket «lokal» er tatt fra en kopi av nettsiden med eksempeldata, fordi disse skjermene krever innlogging med Vipps; utseende og tekster er de samme som live.

## 1. P1 – personvern, innlogging

Bekreftet: alternativ C. Innloggingen lagres i en informasjonskapsel som varer i 90 dager, og fristen fornyes hver gang kapselen settes på nytt ved et besøk. Dette er slik koden faktisk fungerer (`COOKIE_DAYS = 90` i `src/lib/supabase.ts`, brukt både på serveren og i mellomvaren som fornyer kapselen). Teksten i personvernerklæringen er derfor ikke endret.

## 2. Eksempelannonser

**2a.** Avsnittet «Eksempelannonser.» under «Handel mellom brukere» i vilkårene er fjernet.

**2b.** Setningen i avsnittet om sortering er byttet ut. Den lyder nå ordrett:

> Bortsett fra annonseløft påvirker betaling ikke rekkefølgen. Eksempelannonser er merket «Eksempelannonse» og vises etter ekte annonser.

Og det er gjennomført i koden: eksempelannonser vises alltid etter alle ekte annonser i markedet, i søkeresultatene, i forsideraden og i listen «Nyeste» på forsiden. Det gjelder uansett sortering, også når brukeren sorterer etter pris (lav–høy, høy–lav) eller navn. Rekkefølgen innenfor de ekte annonsene og innenfor eksempelannonsene er den valgte sorteringen. Kontrollert med en test der ekte og eksempelannonser ble blandet:

> marked (nyeste): ekte-billig › ekte-dyr › ekte-a › eks-topp › eks-billig
> pris lav→høy: ekte-billig › ekte-a › ekte-dyr › eks-billig › eks-topp
> pris høy→lav: ekte-dyr › ekte-a › ekte-billig › eks-topp › eks-billig
> navn: ekte-a › ekte-billig › ekte-dyr › eks-billig › eks-topp
> forsideraden: ekte-a › eks-billig

Live finnes det foreløpig bare eksempelannonser (28 stykker, alle lagt ut av HOBBYSTRADA), så der vises de i vanlig rekkefølge seg imellom. `07-marked-pris-lav-eksempler-sist.png` viser markedet sortert etter pris lav–høy.

**2c.** Spørsmålet «Hva betyr «Eksempelannonse»?» er fjernet fra Spørsmål og svar.

**2d.** Beholdt uendret: merket «Eksempelannonse» på kortene, «Ikke til salgs – eksempelannonse» i kontaktboksen, eksempelboksen på annonsesiden og telleren «0 annonser + 28 eksempler» i markedet.

**Avvik fra F5 som Låvli bør vite om:** Etter eierens eget ønske vises Vipps-merket «Verifisert» og antall visninger også på eksempelannonsene. Begrunnelsen hans er at kontoen faktisk er verifisert med Vipps, og at visningstallet er ekte. Tidsangivelsen «Lagt ut» er fortsatt skjult på eksempelannonser. Si fra hvis dette må reverseres.

## 3. Punktlister på /vilkar og /salgsvilkar

Kontrollert live: alle listene vises som punktlister med kulepunkt.

- `03f-salgsvilkar-prisliste.png` – prislisten på /salgsvilkar: Topp av listen 3 dager 39 kr, Fremhevet 7 dager 79 kr, Toppannonse 30 dager 199 kr.
- `03b-vilkar-regler-for-annonser.png` – listen under «Regler for annonser» på /vilkar (7 punkter).
- `03c-vilkar-fjerning-utestengelse.png` – de to punktene under «Fjerning og utestengelse».
- `03d-vilkar-ansvar.png` – listen under «Ansvar».
- `03a-vilkar-hele.png` og `03e-salgsvilkar-hele.png` – hele sidene.

## 4. Kontroll og skjermbilder

Søk i hele koden etter utgåtte formuleringer gir null treff: «Forbrukerrådet», «dagene som er brukt», «ubrukte dager», «Det er en avtale mellom deg og kjøperen», «48 timer», «Hva betyr «Eksempelannonse»», «påvirker ikke plasseringen», «Valgt av HOBBYSTRADA».

- `01-kassen-boks-2.png` (lokal) – boks 2 i kassen. Ordrett: «Jeg forstår at angreretten går tapt når perioden er over eller angrefristen på 14 dager er ute, det som kommer først. Angrer jeg før det, betaler jeg for den delen av perioden som er brukt.» Etterfulgt av lenkene «Salgsvilkår · Angreskjema». Begge bokser er tomme når siden åpnes (testet). `01b-kassen-hele.png` viser hele kassen.
- `02-kvittering-angreboks.png` (lokal) – angreboksen på kvitteringen. Ordrett: «Angrerett. Du kan angre til og med 4. november 2026. Angrer du før det, får du tilbake den delen av perioden som ikke er brukt.» Knapp: «Angre avtalen». (Eksempel: Fremhevet 79 kr betalt 50 timer og 20 minutter før, så fristen er 7 dager etter betalingen, som er før 14-dagersfristen.)
- Dialogen «Angre avtalen?» (tekst fra knappen, ordrett): «Angre avtalen? Løftet stoppes nå, og du får tilbake 56 kr for den delen av perioden som ikke er brukt.» Beløpet regnes slik: 79 kr × (168 − 50 brukte timer) / 168 timer = 55,5, rundet opp til 56 kr.
- `04-epost-fjernet.png` (lokal) – e-posten med emne «Fjernet: [tittel]», her med advarsel og refusjon av løft. Teksten ordrett:

> Annonsen din er fjernet
> Vi har fjernet «[tittel]» fra markedet fordi den bryter vilkårene: [regel].
> Begrunnelse: [begrunnelse].
> Dette er en advarsel. Gjentatte brudd kan føre til at kontoen stenges. (bare når admin krysser av for advarsel)
> Annonsen hadde aktivt annonseløft. Du får tilbake [beløp] kr for den delen av perioden som ikke er brukt. (bare ved aktivt løft; uten refusjon står det i stedet «Løftet refunderes ikke, fordi bruddet er alvorlig eller gjentatt.»)
> Mener du at dette er feil, kan du klage innen 30 dager ved å svare på denne e-posten eller skrive til post@hobbystrada.no. Vi svarer innen én måned. Får du medhold, legger vi ut annonsen igjen.
> Avgjørelsen er tatt av et menneske.
> Bunntekst: Du får denne e-posten fordi en annonse du har lagt ut på HOBBYSTRADA, er fjernet.

- `05-innlogging.png` (live) – innloggingssiden. Boksen er tom når siden åpnes (testet). Ordrett: «Jeg bekrefter at jeg er minst 18 år og godtar vilkårene. Jeg har lest personvernerklæringen.» Vilkårene og personvernerklæringen er lenker. Setningen «Ved å fortsette godtar du vilkårene» er borte.
- `06a-budfelt-tekst.png` (lokal, mobil) – teksten under budfeltet, ordrett: «Budet er et uforpliktende prisforslag. Dere er ikke bundet før du har betalt.»
- `06b-selger-godta-avsla.png` (lokal, mobil) – selgerens knapper «Godta budet» og «Avslå». Dialogen når selgeren trykker «Godta budet» (ordrett): «Godta budet? Kjøperen får en Vipps-knapp for å betale 400 kr. Dere er ikke bundet før kjøperen har betalt.»

## Annet

- De arkiverte tekstene i `docs/juridisk/2026-10-30-*.md` er hentet på nytt fra live etter endringene.
- Databehandleravtale med Domene AS: eieren bekrefter dette selv.
- Som før: Vipps-skjermbildene (punkt 6 og 17 i forrige underlag) tas av eieren på telefon, og flytene bud/avvis/fjern/steng testes av eieren sammen med en testbruker.
