# HOBBYSTRADA – underlag til juridisk gjennomgang (30. oktober 2026)

Skjermbildene ligger i samme mappe, navngitt etter punktnummer. Tekster som er limt inn under, er hentet ordrett fra koden slik den er live. Skjermbilder merket «lokal» er tatt fra en kopi av nettsiden med eksempeldata, fordi disse skjermene krever innlogging med Vipps; utseende og tekster er de samme som live.

## A. Kjøp av annonseløft (kassen)

1. `A01-kassen-for-valg.png` – kassen før noe er valgt (lokal).
2. `A02-kassen-pakke-valgt-klar-til-betaling.png` – annonse valgt, Fremhevet valgt, begge bokser avkrysset, rett før betaling. Hele siden.
3. `A03-avkrysningsbokser-tomme.png` – boksene slik de står når siden åpnes. Begge er tomme (testet: forhåndsavkrysset = nei, nei). Teksten ordrett:
   - Boks 1: «Jeg ber om at annonseløftet starter med en gang betalingen er gjennomført, før angrefristen på 14 dager er ute.»
   - Boks 2: «Jeg forstår at angreretten går tapt når perioden er over, og at jeg betaler for dagene som er brukt hvis jeg angrer før det.» Etterfulgt av lenkene «Salgsvilkår · Angreskjema».
   - Over boksene: «Du har 14 dagers angrerett. For at løftet skal starte før fristen er ute, må du be om det og bekrefte at du vet hva det betyr.»
   - Oppsummering: «Du bestiller: Fremhevet i 7 dager for annonsen «…». Pris: 79 kr. Prisen er uten merverdiavgift fordi foretaket ikke er merverdiavgiftsregistrert. Det kommer ingen andre gebyrer i tillegg. Varighet: Engangskjøp som ikke fornyes automatisk.»
4. `A04-knapp-sperret-uten-avkrysning.png` – uten avkrysning er betalingsknappen deaktivert (grå, kan ikke trykkes). Sendes bestillingen likevel direkte til serveren uten avkrysning, svarer den med feilen «Kryss av for begge punktene om angrerett.» og ingenting lagres.
5. `A05-betalingsknapp.png` – knappetekst ordrett: «Bestill og betal 79 kr med Vipps» (beløpet følger pakken: 39, 79 eller 199 kr). Før pakke er valgt: «Bestill og betal med Vipps».
6. Første skjermbilde i Vipps: kan ikke tas fra testmiljøet. Halvor tar dette på telefonen. Beløpet som sendes til Vipps er pakkeprisen, mottaker er HOBBYSTRADA ULLEBERG.
7. `A07-bekreftelse-etter-betaling.png` – siden etter gjennomført betaling (lokal, eksempel med Fremhevet). Tekst: «Fremhevet er aktivert og varer til [dato]. Annonsen har nå gullmerke og gullramme, vises på forsiden, og ligger foran annonser med Topp av listen og vanlige annonser.»

## B. E-poster som sendes ut

Alle e-poster sendes som tekst og som formatert versjon med samme innhold. Nederst i alle står: «Du får denne e-posten fordi du har en konto på HOBBYSTRADA.» (eller egen begrunnelse der det er angitt).

### 8. Ordrebekreftelse for annonseløft
Emne: «Kvittering for annonseløft – Fremhevet»
Vedlegg: `angreskjema.pdf` og `salgsvilkar.pdf` (vilkårene slik de var ved kjøpet).
Tekst (eksempelverdier i klammer):

> Kvittering for annonseløft
> Salgsdokument nr. [12] · [30. oktober 2026 kl. 14.05]
> Selger: HOBBYSTRADA ULLEBERG, org.nr. 938 698 929, Stalsbergs gate 4, 3612 Kongsberg, post@hobbystrada.no, telefon 40 10 57 42
>
> Pakke: Fremhevet, 7 dager, for annonsen «[tittel]»
> Periode: [30. oktober 2026] til [6. november 2026]
> Pris: 79 kr, uten merverdiavgift fordi foretaket ikke er merverdiavgiftsregistrert. Betalt med Vipps.
>
> Angrerett: Du har 14 dagers angrerett fra i dag. Du ba om at løftet skulle starte med en gang, og bekreftet at angreretten går tapt når perioden er over. Angrer du før det, betaler du for dagene som er brukt, og du får resten tilbake innen 14 dager. Du angrer med knappen «Angre avtalen» på kvitteringen under Min side, med angreskjemaet, som ligger vedlagt, eller med en e-post til post@hobbystrada.no.
>
> Vilkårene som gjaldt da du kjøpte, ligger vedlagt.
>
> Kvittering under Min side: https://www.hobbystrada.no/kvittering/[id]

I den formaterte versjonen er «Kvittering under Min side» en knapp («Se kvitteringen under Min side»), og avslutningen lyder: «Vilkårene som gjaldt da du kjøpte, ligger vedlagt. Ta vare på denne e-posten, den er bekreftelsen på avtalen.» Alt innhold står i selve e-posten; lenken går bare til den samme kvitteringen på nettsiden.

### 9. Bekreftelse når angreretten brukes
Sendes straks etter «Angre avtalen» på kvitteringen. Emne: «Bekreftelse: vi har mottatt angringen din»

> Vi har mottatt meldingen din om at du bruker angreretten på Fremhevet for «[tittel]» (salgsdokument nr. [12]), [30. oktober 2026 kl. 14.10].
>
> Løftet stoppes, og du har brukt [3] av [7] dager. Vi betaler tilbake [45] kr til samme betalingsmåte senest 14 dager etter denne meldingen. Spørsmål? Svar på denne e-posten eller skriv til post@hobbystrada.no.

Samtidig får administrator en intern e-post: «Angrerett: refunder [45] kr (nr. [12])» med beskjed om å refundere i Vipps-portalen innen 14 dager og stoppe løftet. Angring per e-post til post@hobbystrada.no håndteres manuelt.

### 10. Annonse avvist, annonse fjernet, konto stengt
Annonse ikke godkjent. Emne: «Ikke godkjent: [tittel]»

> Annonsen din ble ikke godkjent
>
> «[tittel]» ble ikke publisert. Grunn: [begrunnelse fra administrator]. Du kan legge ut kortet på nytt med riktige opplysninger.
>
> Knapp: «Legg ut kort». Avslutning: «Lurer du på noe, kan du kontakte oss via kontaktskjemaet på nettsiden.»

Annonse godkjent (til sammenligning). Emne: «Publisert: [tittel]»: «Annonsen din er publisert. «[tittel]» er godkjent og ligger nå i markedet.» Knapp «Se annonsen». Avslutning: «Du får beskjed når noen sender deg en melding om kortet.»

Konto stengt. Emne: «Kontoen din er stengt»

> Kontoen din på HOBBYSTRADA er stengt fordi den bryter brukervilkårene: [hvilket vilkår]. Annonsene dine er skjult, og du kan ikke logge inn. Kontoen og annonsene slettes om 30 dager, eller når en klage er avgjort. Du kan ikke lage ny konto før det har gått to år.
>
> Mener du dette er feil, kan du klage innen 30 dager ved å svare på denne e-posten eller skrive til post@hobbystrada.no. Vi svarer innen én måned. Får du medhold, åpner vi kontoen igjen.
>
> Begrunnelse nederst: «Du får denne e-posten fordi kontoen din på HOBBYSTRADA er stengt.»

Når en enkelt annonse fjernes av administrator etter publisering (skjules), sendes det i dag ingen egen e-post; selgeren ser statusen under Min side. Si fra om dere ønsker en e-post også der.

### 11. Varsel før sletting etter 23 måneder uten innlogging
Emne: «Kontoen din slettes om 30 dager»

> Du har ikke logget inn på HOBBYSTRADA på nesten to år. Kontoen din slettes om 30 dager, sammen med annonsene dine. Vil du beholde den, er det nok å logge inn.
>
> Knapp: «Logg inn og behold kontoen». Avslutning: «Gjør du ingenting, slettes kontoen automatisk. Betalinger beholder vi uendret så lenge bokføringsloven krever.»

## C. Min side

12. `C12-angre-avtalen-pa-kvitteringen.png` – angrerettboksen på kvitteringen (lokal). Tekst: «Du har 14 dagers angrerett fra kjøpet. Angrer du før perioden er over, får du tilbake ubrukte dager.» Knapp: «Angre avtalen». Knappen vises til angrefristen på 14 dager er ute. Kvitteringssiden viser ellers: «Kvittering», «Salgsdokument nr. [12]», «Dato for betaling og levering», «Betalt med Vipps. Levert på hobbystrada.no.», «Totalt betalt», og kan skrives ut eller lagres som PDF.
13. Ved trykk på «Angre avtalen» vises en bekreftelsesdialog i nettleseren med beregnet refusjon, ordrett (eksempel 2 dager brukt av 7, 79 kr): «Angre avtalen? Løftet stoppes nå, og du får tilbake 45 kr (4 av 7 dager er ubrukt).» Er perioden over: «Angre avtalen? Perioden er over, så løftet er levert fullt ut. Vi svarer deg på e-post.» Etter bekreftelse: «Mottatt. Du får en bekreftelse på e-post, og 45 kr betales tilbake senest innen 14 dager.» Refusjonen regnes som pris × ubrukte dager / dager i pakken, avrundet til hele kroner.
14. `C14-slett-konto-bekreftelse.png` (lokal). Tekst: «Slett konto. Kontoen, annonsene, bildene, varslene og de lagrede søkene dine slettes for godt. Meldinger du har sendt, blir stående hos den du har skrevet med, merket «Slettet bruker», til samtalen slettes etter 12 måneder. Kvitteringer for annonseløft beholdes så lenge bokføringsloven krever.» Knapp «Slett kontoen min», deretter «Er du sikker? Dette kan ikke angres.» med bekreft/avbryt.

## D. Innlogging og konto

15–16. `D15-D16-innlogging-og-ny-konto.png` (live). Innlogging og ny konto er samme skjerm; kontoen opprettes automatisk første gang man logger inn med Vipps. Tekst ordrett:
   - «Alle kjøpere og selgere på HOBBYSTRADA bekrefter seg med Vipps. Det tar bare noen sekunder.»
   - Avkrysningsboks (tom ved åpning, testet): «Jeg bekrefter at jeg er minst 18 år, og godtar vilkårene og personvernerklæringen.» (lenker til /vilkar og /personvern). Vipps-knappen er deaktivert til boksen er krysset av. Uten avkrysning: «Du må bekrefte at du er minst 18 år for å lage konto på HOBBYSTRADA.»
   - Knapp: «Logg inn med Vipps» (offisiell Vipps-knapp).
   - Under: «Vi får navnet, e-posten og telefonnummeret ditt fra Vipps. Adressen din hentes ikke. Ved å fortsette godtar du vilkårene.»
   - «Ny her? Kontoen lages automatisk første gang du logger inn med Vipps.»
   - Tidspunktet for 18-årsbekreftelsen lagres på kontoen.
17. Samtykkeskjermen i Vipps: må tas på telefon av Halvor. Det nettsiden ber om fra Vipps Login er disse opplysningene: openid (fast ID), name (navn), email (e-post), phoneNumber (telefonnummer). Ingen adresse, fødselsnummer eller fødselsdato.

## E. Legge ut annonse

18. `E18a-legg-ut-steg1.png` (steg 1 slik brukeren ser det) og `E18b-legg-ut-hele-skjemaet.png` (alle fire steg vist samtidig), lokal. Erklæring finnes, i steg 4 før «Send inn annonsen»: «Jeg selger som privatperson og ikke som ledd i næringsvirksomhet.» Boksen er obligatorisk (annonsen kan ikke sendes inn uten) og tom ved åpning. Tidspunktet lagres i feltet `private_seller_at` på annonsen. I tillegg: «Jeg eier kortet, opplysningene stemmer, og jeg godtar at kjøpere kan sende meg meldinger om annonsen via HOBBYSTRADA. Jeg forstår at handelen skjer direkte mellom meg og kjøperen. Jeg godtar vilkårene.» Administratorens egne annonser (eksempelannonser) viser ikke privat-boksen.
19. `E19a-annonse-privat-selger.png` (lokal, vanlig annonse) og `E19b-annonse-eksempelannonse.png` (live). Om selgeren på en vanlig annonse: fornavn fra Vipps, «Verifisert med Vipps», sted, «Lagt ut for … siden», og teksten «Privat selger. Forbrukerkjøpsloven og angrerett gjelder ikke. Les mer» (lenke til vilkårene). Knapper: «Logg inn for å kontakte selgeren» / «Send melding til selger». Boksen «Handle trygt»: «Du avtaler betaling og frakt direkte med selgeren. HOBBYSTRADA er ikke part i handelen, så ta noen enkle forholdsregler: Be om bilder før du betaler · Sjekk navnet før du betaler · Vurder frakt med sporing · Hold samtalen i chatten.» På eksempelannonser erstattes dette med «Ikke til salgs – eksempelannonse» og boksen «Dette er en eksempelannonse».

## F. Chat og bud (lokal, telefonvisning)

20. `F20-chat-for-bud.png` – chatten før bud. Øverst i alle samtaler: «Dere avtaler betaling og frakt direkte. HOBBYSTRADA er ikke part i handelen. Del aldri BankID, passord eller koder.»
21. `F21-gi-bud.png` – kjøperen trykker «Bud», og får feltet «Ditt bud … kr» over meldingsfeltet. Budet sendes som en vanlig melding merket «Bud: 1 400 kr».
22. `F22-selger-godta-avsla.png` – selgeren ser budet med knappene «Godta budet» og «Avslå». Ved «Godta budet» vises bekreftelsen: «Godta budet? Det er en avtale mellom deg og kjøperen.» Deretter sendes meldingen «Budet på 1 400 kr er godtatt.» til kjøperen, og kjøperen får varsel og e-post.
23. `F23-kjoper-etter-godtatt-bud.png` – kjøperen etter godtatt bud: «Budet ditt på 1 400 kr er godtatt. Betal selgeren direkte med Vipps, og avtal frakt her i chatten. HOBBYSTRADA er ikke part i handelen.» Knapp «Betal 1 400 kr med Vipps» (åpner Vipps med selgerens nummer valgt; beløpet må kjøperen taste selv). «Vipps åpnes med selgeren valgt. Sjekk at navnet i Vipps er [selgerens navn], og skriv inn beløpet.» Under: «Frakt. Send adressen din, så selgeren vet hvor pakken skal.» med knappen «Send adressen min» (adressen sendes som melding i chatten).

## G. Annet

24. `G24a-kontaktskjema.png` og `G24b-rapportskjema.png` (live). Felt: navn, e-post, emne (Spørsmål om annonse / Annonseløft og betaling / Rapporter annonse / annet), melding. Tekst: «Gjelder det en annonse? Lim inn lenken til annonsen, eller oppgi spiller og kortnummer.» Etter innsending: «Takk for meldingen. Vi svarer deg på e-post, vanligvis innen ett døgn.» Rapport fra annonsesiden: «Takk for at du sa fra. Vi ser på annonsen og fjerner den hvis den bryter vilkårene.»
25. `G25a-bunntekst.png` og `G25b-om-informasjonskapsler.png` (live). Dialogen: «Informasjonskapsler. Vi bruker bare informasjonskapsler som trengs for at siden skal virke, som innlogging. Vi bruker ikke sporing, analyse eller annonser, og har derfor ingen innstillinger å velge. Les mer» (lenke til /informasjonskapsler), knapp «Lukk».
26. `G26-sokesiden.png` (live). Lenken «Slik sorteres annonsene» er synlig på søkesiden.
27. `G27a-forsiden.png` og `G27b-markedet.png` (live, slik det er nå). Eksempelannonsene er ikke fjernet; de ligger i markedet og på forsiden merket «Eksempelannonse», slik oppgaven fra Låvli ba om. Ved lansering er planen at de blir liggende som eksempler til ekte annonser kommer, med samme merking. Skal de fjernes ved lansering, er det én operasjon (skjul alle eksempelannonser).

## H. Tekniske opplysninger

28. Informasjonskapsler og lokal lagring (målt med nettleseren live, uinnlogget, etter å ha besøkt forsiden, markedet, en annonse og lagret en favoritt):
   - Informasjonskapsler: ingen for uinnloggede besøkende.
   - localStorage: `favoritter` (liste over annonser brukeren har lagret med hjertet). Ingen annen lagring. sessionStorage: tom.
   - Ved innlogging settes Supabase sin innloggingskapsel (`sb-…-auth-token`, httpOnly, 1 år) og under Vipps-innloggingen en kortvarig kapsel `vipps_oidc` (10 minutter, bare på innloggingssiden). I lukket modus før lansering settes `hs_tilgang` (90 dager). Ingen tredjepartskapsler; det går ingen forespørsler til andre domener enn www.hobbystrada.no, bortsett fra bilder fra Supabase og Vipps ved innlogging og betaling.
29. Analyse: ingen. Verken Vercel Analytics, Speed Insights, Google Analytics eller annen sporing er installert eller slått på.
30. Databehandleravtaler: Supabase: ja, inngår i Supabase sine vilkår (EUs standardpersonvernbestemmelser 2021/914, data i Stockholm). Vercel: ja, inngår i Vercel sine vilkår (Data Processing Addendum, EU–US Data Privacy Framework; drift i Frankfurt). Domene AS (e-post): må bekreftes av Halvor – sjekk avtalevilkårene hos Domene AS eller be dem om databehandleravtale.
