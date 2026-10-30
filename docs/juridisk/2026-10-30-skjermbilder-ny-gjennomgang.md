# HOBBYSTRADA – skjermbilder og svar til ny gjennomgang (30. oktober 2026)

Skjermbildene står under hvert punkt, nummerert etter listen fra Låvli. Skjermbilder som krever innlogging med Vipps, er tatt fra en lokal kopi av nettsiden med eksempeldata. Utseende og tekster er de samme som live. Forutsetningen stemmer: HOBBYSTRADA selger ikke kort selv, og de 28 annonsene som ligger ute nå, er eksempelannonser merket «Eksempelannonse» og «Ikke til salgs».

## 1. Annonseløft og kassen

- `01b-kassen-for-valg.png` – kassen slik den åpnes, med de tre pakkene (Topp av listen 39 kr, Fremhevet 79 kr, Toppannonse 199 kr) og priser uten mva.
- `01a-kassen-pakke-valgt.png` – annonse og Fremhevet valgt. Oppsummeringen «Du bestiller / Pris / Varighet» står rett før betalingsknappen.
- `01c-kassen-avkrysningsbokser.png` – de to boksene, tomme når siden åpnes. Ordrett: Boks 1 «Jeg ber om at annonseløftet starter med en gang betalingen er gjennomført, før angrefristen på 14 dager er ute.» Boks 2 «Jeg forstår at angreretten går tapt når perioden er over eller angrefristen på 14 dager er ute, det som kommer først. Angrer jeg før det, betaler jeg for den delen av perioden som er brukt.» Deretter lenkene «Salgsvilkår · Angreskjema».
- `01d-betalingsknapp.png` – knappen «Bestill og betal 79 kr med Vipps». Den er sperret til begge boksene er krysset av, og serveren avviser bestillinger uten avkrysning.

## 2. Etter kjøpet

- `02a-kvittering-min-side.png` – kvitteringen under Min side, med angreboksen «Du kan angre til og med [dato]» og knappen «Angre avtalen».
- `02b-epost-bekreftelse.png` – e-posten «Kvittering for annonseløft – Fremhevet» med salgsdokumentnummer, selgeropplysninger, pakke, periode, pris, angrerett med dato og lenke til kvitteringen. Angreskjema og salgsvilkår ligger ved som PDF.

## 3. Første innlogging med Vipps

- `03-innlogging-vipps-18-aar.png` – innloggingssiden. Boksen er tom når siden åpnes. Ordrett: «Jeg bekrefter at jeg er minst 18 år og godtar vilkårene. Jeg har lest personvernerklæringen.» Vilkårene og personvernerklæringen er lenker. Knappen «Logg inn med Vipps» virker ikke før boksen er krysset av. Tidspunktet for bekreftelsen lagres på kontoen.

## 4. «Legg ut kort»-skjemaet

- `04-legg-ut-kort-hele-skjemaet.png` – hele skjemaet med alle steg synlige samtidig (vanligvis vises ett steg om gangen). Nederst står den obligatoriske boksen, ordrett: «Jeg selger som privatperson og ikke som ledd i næringsvirksomhet.» Tidspunktet lagres på annonsen. Annonsen kan ikke sendes inn uten avkrysning.

## 5. Kjøpersiden

- `05a-annonseside.png` – en annonseside (live, eksempelannonse). På en ekte annonse står knappene «Send melding» og «Gi bud» der det nå står «Ikke til salgs – eksempelannonse», og teksten «Privat selger. Forbrukerkjøpsloven og angrerett gjelder ikke. Les mer».
- `05b-chat-gi-bud.png` – kjøperen gir bud. Under budfeltet: «Budet er et uforpliktende prisforslag. Dere er ikke bundet før du har betalt.»
- `05c-chat-selger-godta.png` – selgeren ser budet med knappene «Godta budet» og «Avslå». Ved «Godta budet» vises dialogen: «Godta budet? Kjøperen får en Vipps-knapp for å betale 400 kr. Dere er ikke bundet før kjøperen har betalt.»
- `05d-chat-betal-med-vipps.png` – kjøperen etter godtatt bud, med knappen «Betal 400 kr med Vipps». Teksten over, ordrett: «Spør selgeren om kortet fortsatt er ledig før du betaler. Betal selgeren direkte med Vipps, og avtal frakt her i chatten. HOBBYSTRADA er ikke part i handelen.» Knappen åpner Vipps-appen med selgerens telefonnummer forhåndsvalgt (en vanlig Vipps-lenke av typen qr.vipps.no). Beløpet må kjøperen skrive inn selv. Pengene går rett fra kjøper til selger. HOBBYSTRADA mottar, holder eller formidler ingen penger.

## 6. Bunnteksten

- `06a-bunntekst.png` – bunnen av en vanlig side (live), med lenkene Vilkår, Salgsvilkår, Personvern, Refusjon og knappen «Om informasjonskapsler».
- `06b-om-informasjonskapsler.png` – boksen som åpnes ved trykk på knappen: «Vi bruker bare informasjonskapsler som trengs for at siden skal virke, som innlogging. Vi bruker ikke sporing, analyse eller annonser, og har derfor ingen innstillinger å velge. Les mer».

## 7. Ferdige e-poster

- `07a-epost-avvist-annonse.png` – «Ikke godkjent: [tittel]». Vilkår, begrunnelse, klageadgang innen 30 dager, «Avgjørelsen er tatt av et menneske».
- `07b-epost-stengt-konto.png` – «Kontoen din er stengt». Vilkår, begrunnelse, sletting etter 30 dager eller når klagen er avgjort, klageadgang.
- `07c-epost-fjernet-annonse.png` – «Fjernet: [tittel]», når en publisert annonse fjernes. Med eventuell advarsel og refusjon av annonseløft.

## Svar på spørsmålene

Svarene under er utkast fra utvikleren ut fra hvordan nettsiden er bygget. Eieren bekrefter eller retter dem før de sendes.

**Vipps.** Nettsiden bruker to Vipps-produkter, begge på HOBBYSTRADA ULLEBERGs bedriftsavtale med Vipps MobilePay: «Logg inn med Vipps» til innlogging, og Vipps ePayment til betaling av annonseløft. Knappen i chatten er ingen Vipps-integrasjon. Den er en vanlig betalingslenke (qr.vipps.no) med selgerens telefonnummer, av samme type som når en privatperson deler Vipps-nummeret sitt. Betalingen skjer mellom to privatpersoner i Vipps-appen, utenfor HOBBYSTRADAs avtale. [Eieren bekrefter: hvilke Vipps-produkter som er aktivert i portalen, og om Vipps er informert om bruken av lenken i chatten.]

**Andre planer.** Nettsiden tar ingen provisjon, holder ingen penger og formidler ingen betaling for kort. Det er ingen reklame fra tredjeparter, ingen sporing og ingen nyhetsbrev. Det finnes ingen samtykkeboks for markedsføring, og e-post sendes bare om hendelser brukeren selv har utløst (meldinger, bud, annonseløft, lagrede søk, vedtak). [Eieren bekrefter om dette også gjelder planene framover.]

**Omsetning.** [Eieren svarer: anslag for salg av annonseløft de første 12 månedene.] Til orientering: prisene er 39, 79 og 199 kr, så grensen på 50 000 kr tilsvarer rundt 250 til 1 280 solgte løft i året.

**Eksempelannonsene.** [Eieren svarer.] Teknisk er begge deler enkelt: annonsene kan slettes samlet, eller bli liggende merket «Eksempelannonse» og vises etter alle ekte annonser.
