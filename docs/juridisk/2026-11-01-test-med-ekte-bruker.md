# HOBBYSTRADA – test med ekte bruker, 1. november 2026

Skjermbildene er tatt av eieren og testbrukeren på ekte telefoner mot den publiserte nettsiden. Alt er ekte: Vipps-innlogging, Vipps-betaling på 39 kr, e-poster og kvittering. Dette dekker punktene Låvli ba om å få testet med testbrukeren.

## Innlogging (K4)

- `K4-innlogging.jpg` – innloggingssiden med boksen «Jeg bekrefter at jeg er minst 18 år og godtar vilkårene. Jeg har lest personvernerklæringen.» Bildet er tatt etter at testbrukeren krysset av. Boksen er tom når siden åpnes, og knappen virker ikke før avkrysning.

## Avvist annonse (E3)

- `E3-ikke-godkjent-topp.jpg` og `E3-ikke-godkjent-bunn.jpg` – e-posten «Ikke godkjent: [tittel]» slik testbrukeren mottok den: vilkår som er brutt, begrunnelse i egen boks, klageadgang innen 30 dager, svar innen én måned, og «Avgjørelsen er tatt av et menneske». Administrator måtte velge vilkår og skrive begrunnelse for å kunne avvise.

## Kjøp av annonseløft (K1, Vipps, A7, E1)

- `K1-kassen.jpg` – kassen med begge boksene, oppsummeringen «Du bestiller / Varighet / Totalpris» og knappen «Bestill og betal 39 kr med Vipps».
- `V1-vipps-betalingsskjerm.jpg` – betalingsskjermen i Vipps: mottaker HOBBYSTRADA ULLEBERG, 39 kr, beskrivelse «Topp av listen: [tittel]».
- `V2-vipps-betaling-gjennomfort.jpg` – betalingen i Vipps-appen etterpå, merket «Betalt».
- `A7-hurra-etter-betaling.jpg` – siden kunden kommer tilbake til: «Topp av listen er aktivert».
- `E1-kvittering-epost-topp.jpg` og `E1-kvittering-epost-angrerett.jpg` – e-posten «Kvittering for annonseløft – Topp av listen» med salgsdokumentnummer, selgeropplysninger, pakke, periode 1. til 4. november, pris uten mva, og angreretten med dato: «Du kan derfor angre til og med 4. november 2026». Angreskjema og salgsvilkår lå ved som PDF.

## Kvitteringen under Min side (K2) og angring (K3, E2)

- `K2-kvittering-min-side-topp.jpg` og `K2-kvittering-min-side-angreboks.jpg` – kvitteringen med salgsdokument nr. 1002, kjøper, dato, ytelse, beløp og angreboksen «Du kan angre til og med 4. november 2026» med knappen «Angre avtalen».
- `K3-dialog-angre-avtalen.jpg` – dialogen: «Angre avtalen? Løftet stoppes nå, og du får tilbake 39 kr for den delen av perioden som ikke er brukt.» (angret samme time som kjøpet, så 0 timer er brukt).
- `E2-bekreftelse-angring.jpg` – e-posten «Bekreftelse: vi har mottatt angringen din», mottatt med en gang: salgsdokumentnummer, tidspunkt, «Det har vært aktivt i 0 av 72 timer. Vi betaler tilbake 39 kr til samme betalingsmåte senest 14 dager etter denne meldingen.»

## Funnet og rettet under testen

- Første kjøp ble ikke aktivert automatisk, fordi databasen manglet en rettighet til å dele ut salgsdokumentnummer. Rettet samme formiddag. Nå aktiveres løftet og sendes kvitteringen i samme øyeblikk Vipps bekrefter betalingen, uten at noen gjør noe manuelt. Vipps varsler nettsiden direkte.
- Utskrift av kvitteringen tok med topplinje og bunntekst. Rettet, utskriften viser nå bare kvitteringen.

Gjenstår i testen: e-posten «Fjernet» ved fjerning av publisert annonse, e-posten «Kontoen din er stengt» og gjenåpning, samt at testbrukerens to betalinger på 39 kr refunderes.
