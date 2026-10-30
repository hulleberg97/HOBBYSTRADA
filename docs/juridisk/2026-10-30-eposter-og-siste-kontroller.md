# HOBBYSTRADA – forarbeid til de siste kontrollene (30. oktober 2026)

Låvli ba om at E1, E2, E3, E5 og F4 testes med testbrukeren. Her er e-postene slik koden lager dem, med eksempelverdier, og en gjennomgang av koden for F4 og F6. Alle skjermbildene er tatt fra en lokal kopi av nettsiden, fordi e-postene ellers bare sendes ved ekte kjøp og vedtak. Teksten er hentet fra samme kode som sender e-postene live. Eieren tester deretter de ekte flytene med testbrukeren, så det blir dokumentert at e-postene faktisk kommer frem.

## E1 – ordrebekreftelse for annonseløft

`E1-ordrebekreftelse.png` – emne «Kvittering for annonseløft – Fremhevet». Angredatoen står i e-posten. Eksempel: betalt 28. oktober 2026, Fremhevet i 7 dager, så teksten lyder «Du kan derfor angre til og med 4. november 2026». Datoen regnes som det tidligste av perioden slutt og 14 dager etter betaling. Angreskjema og salgsvilkår ligger ved som PDF.

## E2 – bekreftelse på angring

`E2-bekreftelse-angring.png` – emne «Bekreftelse: vi har mottatt angringen din». Eksempel: Fremhevet 79 kr, angret 50 timer og 20 minutter etter betaling. Teksten lyder ordrett:

> Løftet stoppes. Det har vært aktivt i 50 av 168 timer. Vi betaler tilbake 56 kr til samme betalingsmåte senest 14 dager etter denne meldingen.

Regnestykket: 79 kr × (168 − 50) / 168 = 55,5, rundet opp til 56 kr. Timene rundes ned (50 timer og 20 minutter blir 50 timer), så avrundingen går i kundens favør begge veier. Samme tall som i dialogen «Angre avtalen?» på kvitteringen.

## E3 – avvist annonse

`E3-avvist-annonse.png` – emne «Ikke godkjent: [tittel]». E-posten har vilkåret som er brutt, begrunnelsen i egen boks, klageadgang innen 30 dager med svar innen én måned, og «Avgjørelsen er tatt av et menneske».

Feltene er obligatoriske for administrator, på to nivåer:

- `E3a-admin-avvis-skjema.png` – skjemaet som åpnes når administrator trykker «Avvis». Vilkår velges fra en fast liste, og begrunnelsen er merket obligatorisk.
- `E3b-admin-avvis-uten-begrunnelse.png` – trykker administrator «Bekreft avvisning» uten begrunnelse, stoppes det med «Skriv en konkret begrunnelse.» og ingenting sendes.
- Serveren kontrollerer det samme uavhengig av skjemaet: en avvisning uten vilkår og begrunnelse avvises med feilen «Oppgi hvilket vilkår som er brutt, og en konkret begrunnelse.» (kode i `src/app/api/listings/[id]/route.ts`).

## E5 – stengt konto

`E5-stengt-konto.png` – emne «Kontoen din er stengt». E-posten har vilkåret, «Begrunnelse: …» og «Avgjørelsen er tatt av et menneske» i boksen, og klageadgang innen 30 dager.

`E5a-admin-steng-ute-uten-begrunnelse.png` – skjemaet «Steng ute selger» krever vilkår fra fast liste og begrunnelse. Uten begrunnelse stoppes det med «Skriv en konkret begrunnelse først.». Serveren avviser også forespørsler uten begrunnelse («Skriv en konkret begrunnelse: hva brukeren har gjort, og hvilken annonse eller samtale det gjelder.»).

## F4 – avviste annonser slettes ikke under klage

Kontrollert i koden for den daglige oppryddingen (`src/app/api/cron/cleanup/route.ts`). Avviste annonser slettes etter 30 dager, men bare hvis det ikke er registrert en klage, eller klagen er avgjort. Filteret er ordrett: `complaint_at.is.null,complaint_resolved_at.not.is.null`. Administrator registrerer «Klage mottatt» og «Klage avgjort» på annonsen i adminpanelet. Så lenge en klage er mottatt og ikke avgjort, hopper oppryddingen over annonsen, uansett hvor gammel den er.

Dette kan eieren teste slik: avvis en annonse fra testbrukeren, trykk «Klage mottatt» i adminpanelet, og se at annonsen fortsatt vises under avviste etter at oppryddingen har kjørt. (I praksis må den da være eldre enn 30 dager for å bli slettet uansett, så kodegjennomgangen over er det som dokumenterer dette nå.)

## F6 – ved lansering

Passordet er allerede fjernet (SITE_PASSWORD er tom), så ingen får kapselen hs_tilgang nå. Det som gjenstår ved lansering, er å slå av skjulingen for søkemotorer og slette testkontoen. Kapselen hs_tilgang settes bare når passord er på, så den forsvinner av seg selv.

## Eieren tester med testbrukeren

1. Kjøp et annonseløft på en testannonse og se at e-posten E1 kommer med angredato.
2. Trykk «Angre avtalen» på kvitteringen og se at e-posten E2 kommer med timer og beløp.
3. Legg ut en annonse fra testbrukeren, avvis den som administrator med vilkår og begrunnelse, og se at e-posten E3 kommer.
4. Steng ute testbrukeren med begrunnelse, og se at e-posten E5 kommer. (Gjør dette sist. Kontoen kan åpnes igjen fra adminpanelet.)
