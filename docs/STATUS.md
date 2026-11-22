# HOBBYSTRADA – status og arbeidsmåte (oppdatert 15. november 2026)

Les denne først i en ny sesjon. Den oppsummerer hvor prosjektet står, hvordan eieren vil jobbe, og hva som gjenstår.

## Hvem og hva

- Eier: Halvor Ulleberg, HOBBYSTRADA ULLEBERG (ENK, org.nr. 938 698 929, Stalsbergs gate 4, 3612 Kongsberg, post@hobbystrada.no, 40 10 57 42). Ikke-teknisk. **Svar alltid på norsk.**
- Nettsiden: www.hobbystrada.no. Markedsplass for fotballkort mellom private samlere. Vipps-innlogging, chat med bud, betaling direkte mellom partene (qr.vipps.no-lenke med selgerens nummer), annonseløft (39/79/199 kr) er eneste inntekt.
- Låvli = eierens juridiske rådgiver (KI-verktøy). Eieren limer inn Låvlis meldinger; de skal gjennomføres, med avvik flagget tilbake.
- Elise = testbruker (Hotmail-adresse). Testkontoen beholdes til lansering.

## Arbeidsmåte eieren vil ha

- **Visuelle endringer vises som utkast med skjermbilde før de går live.** Legg utkast på egen gren (`utkast-*`), vis bilde, vent på «live»/«sett live»/«kjør live». Eieren har reagert når noe gikk live uten godkjenning.
- Tekst- og juridiske endringer fra Låvli legges rett inn og deployes.
- Aldri be om eller lime inn hemmelige nøkler i chatten. Supabase-SQL kjører eieren selv i SQL Editor (gi ham SQL å lime inn). Vipps-nøkler ligger i Vercel.
- Deploy: `npm run build`, commit, `git push -u origin main`, poll Vercel til READY. Commit-trailer: `Co-Authored-By` + `Claude-Session` (se system-reminder i sesjonen).
- Passord på siden: miljøvariabel `SITE_PASSWORD` i Vercel (eieren oppgir verdien). «passord av/på» = sett tom/verdi + tom commit for ny utrulling. Gjestelenker er fjernet.
- «lanser» = sett `SKJUL_FOR_SOKEMOTORER` av, fjern passord, send inn sitemap, slett testkontoen, slett eksempelannonsene når ekte annonser kommer.
- Lokal testing: `PORT=3718 npx next start -p 3718`; stopp med `for p in $(pgrep -f "next-serve[r]|next star[t]"); do kill $p; done`. Lokalt bygg bruker seed-data (ingen Supabase). Midlertidige testsider lages under `src/app/lavli-test/` og slettes før commit. Playwright headless_shell ligger i `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.

## Juridisk (ferdig, Låvli har godkjent)

- Vilkår, personvernerklæring, salgsvilkår, angreskjema, FAQ og korte tekster er Låvlis reviderte versjoner (30. okt 2026), ordrett. Arkiv i `docs/juridisk/` (hentes fra live med scratchpad-skriptet `juridisk/hent.js`).
- Refusjonssiden er slått sammen med salgsvilkårene (`/refusjon` → `/salgsvilkar#angrerett`). Bunntekst: «Angrerett».
- Refusjon ved angring regnes i hele timer, påbegynt time teller ikke, rundes opp i kundens favør (`src/lib/angrerett.ts`). Angrefrist vises med klokkeslett.
- Kassen: boks 1 «ber om oppstart», boks 2 «forstår at angreretten går tapt», linje over knappen «Ved å trykke … godtar du salgsvilkårene».
- Vipps-knappen i chatten er nøytral («Åpne Vipps og betal selgeren»), ingen Vipps-logo/farge.
- Visningstelleren teller bare på serveren (ingen lagring i nettleseren).
- Eksempelannonser (eierens 28 kort): merket «Eksempelannonse», ikke til salgs, vises etter ekte annonser, men ser ellers ut som vanlige annonser (tid, Vipps-merke, visninger).
- Avviste annonser slettes etter 35 dager, ikke under klage. Utestengelse: begrunnelse obligatorisk, klage innen 30 dager, «Avgjørelsen er tatt av et menneske».
- Protokoll etter art. 30 ligger som Claude-dokument: https://claude.ai/artifact/GP7xWXKJsBuR5kLStU2n9x (tre åpne punkter eieren skal krysse av).
- Test med ekte bruker 1. nov er dokumentert: `docs/juridisk/2026-11-01-test-med-ekte-bruker.pdf` og `2026-11-01-kassen-angreskjema-beregning.pdf`.
- Setningen om domstolene i vedtaks-e-poster er bevisst utelatt (eierens valg); legges inn når DSA gjelder i Norge.

## Teknisk status

- Annonseløft aktiveres automatisk: Vipps-webhook (`/api/vipps/webhook`, slått på fra adminpanelet, hemmelighet i `site_settings`), pluss sjekk ved retur/Min side/admin/cron. Ingen manuell godkjenning.
- SQL-filer i `supabase/` er alle kjørt per 1. nov (inkl. 012 med grant på `boost_invoice_seq`, 013, 021, 022).
- Forsideraden kan sveipes på mobil (`src/components/MagRull.tsx`), glir videre straks fingeren slipper.
- Annonsekort: tittel reservert til to linjer, visninger ved prisen.
- Tid «lagt ut for … siden» regnes i nettleseren (`TidSiden`), så mellomlagring ikke viser gammel tid.
- E-post via SMTP hos Domene AS. SPF, DKIM og DMARC (p=none) er på plass i DNS per 6. nov. Hotmail kan forsinke e-post.
- Siden er åpen (ingen passord) og indekserbar siden 5. nov («myk åpning»). Google Search Console: TXT-bekreftelse lagt i DNS 6. nov (cPanel Zone Editor hos Domene AS); eieren sender inn sitemap selv.
- Teknisk gjennomgang 15. nov: Next.js 16.4.6 og nodemailer 10.5.0 (lukker kritiske sikkerhetsvarsler, `npm audit` viser 0), ubrukt `three` fjernet. Eksempelannonser gir ikke lenger pris/«på lager» til Google (ingen `offers` i JSON-LD, søketekst «Eksempelannonse. Kortet tilhører HOBBYSTRADA og er ikke til salgs.»). Forsiden forteller Google navn og logo (WebSite/Organization, uten person- eller adresseopplysninger). Innloggingssidene er `noindex`. Fart målt: forside 94, marked 92, annonse 95 (mobil, median av tre). Ingen fartsendringer trengtes; to forsøk ble målt og forkastet.
- 15. nov (2), etter «sett begge live»: eksempelannonser er `noindex` og tatt ut av sitemap (bare ekte annonser og faste sider ligger der). «Verifisert med Vipps»-merket har litt mørkere tekst (#b43a0a) for kontrastkravet.
- 15. nov (3): annonsekortene har typemerket på én linje («Autograf + Patch +1»), grå plassholder mens bildet lastes, og hjertet flyttes ned under merkeraden på smale telefoner (under 360 px, på kort som har et merke). Merket «Eksempelannonse» er én felles komponent (`ExampleBadge`) for kort, forsiderad og annonseside,. Eieren valgte «diskré flik» 15. nov: liten mørk flik med gullstrek, helt oppe i hjørnet av kortet. De andre utkastene er fjernet fra koden.
- 15. nov (4): alle offentlige sider har egen tittel og beskrivelse til søkemotorene (står i `metadata` øverst i hver `page.tsx`; forsidens ligger i `layout.tsx`). Tekstene sier hva siden er og holder seg til det som stemmer: norsk markedsplass for fotballkort, direkte mellom samlere, Vipps-innlogging, gratis å legge ut. Eieren ba 15. nov om at uttrykket «ingen provisjon» fjernes: det er tatt ut av tekstene til søkemotorene og av markedsføringstekstene i `docs/markedsforing/`. Det står fortsatt én setning i vilkårene punkt 2 («Vi tar ingen provisjon og holder ingen penger.»), som er Låvlis tekst og venter på eierens avklaring med Låvli. Instagram-bildene N-02/F-02, Q-03, S-02, K-06, K-19 og M-12 (og videoene Q-03 og S-02) har uttrykket i selve bildet og må bygges på nytt før bruk. Visningstelleren teller ikke roboter: kjente roboter filtreres på nettlesernavn i `/api/visning`, og automatisk styrte nettlesere hoppes over i `TellVisning`. Ingenting lagres om besøkende.
- 15. nov (5): «Legg ut kort» har fått en veiledning under innloggingen («Slik selger du fotballkort på HOBBYSTRADA», `SellGuide.tsx`): fire steg og tre spørsmål (pris, verdi, hvilke kort). Vises bare til den som ikke er klar til å legge ut. Laget for synlighet på søket «selge fotballkort», der ingen markedsplass ligger på førstesiden. Innholdet følger spørsmål og svar og vilkårene; prisene hentes fra `BOOSTS`. Neste mulige steg for synlighet: egne sider per korttype når det finnes ekte annonser.
- IndexNow (Bing, Yandex, Seznam, Naver m.fl.): nøkkelfilen `public/518aa9f2f243d38010313fe88327d2a8.txt` (ikke hemmelig, skal ligge offentlig). Nye eller endrede adresser meldes med en POST til `https://api.indexnow.org/indexnow` med `host`, `key` og `urlList`. Første innmelding 15. nov med alle adressene i nettstedskartet.
- 15. nov (6), feil meldt av tester: «Legg ut kort» stoppet uten forklaring på siste steg. Årsak: «Neste» sjekket ikke påkrevde felt (et `fieldset` melder alltid at det er gyldig), så man kunne nå siste steg med tomme felt, og nettleseren nektet da å sende inn uten å vise noe. Rettet i `SellForm.tsx`: feltene sjekkes ett for ett i hvert steg, og mangler noe ved innsending, åpnes steget der det mangler, med beskjed. Skjemaet har `noValidate`, så all kontroll går gjennom `firstInvalid`.
- LIVE SOM TEST (22. nov, eieren ba om «teste live a4b1»): ny forside for telefon og nettbrett. Den vises bare på berøringsskjermer under 1024 px (`pointer: coarse` i `globals.css`); eieren vil beholde originalen på PC, så mus og pekeplate får alltid den opprinnelige forsiden, også i smalt vindu. Øverst: overskrift (gullmerket «Norsk markedsplass for fotballkort» og den svarte streken under buen ble fjernet samme dag etter ønske fra eieren), en bue med sju kort som glir forbi (utkast A4b-1, hvit ramme rundt kortene), søkefelt og knappene «Se alle annonser» og «Legg ut kort». Under: faner (Alle, Autograf, Patch …) og annonsene (`MobilForside.tsx`, `ForsideFaner.tsx`, stiler `.fb-*` nederst i `globals.css`). Fast bunnmeny på telefon (`BunnMeny.tsx`: Hjem, Søk, Selg, Meldinger, Min side; ikke på annonseside, samtale, innlogging, betaling, kvittering, admin). PC er uendret. Buen bruker bare HOBBYSTRADAs egne kort (eksempelannonsene, i forsiderekkefølgen fra admin), uten merke, navn og pris. Eieren ba samme dag om at kortene skulle være trykkbare og interaktive: et trykk åpner annonsen (som er merket «Eksempelannonse» på annonsesiden), og buen kan dras sidelengs med fingeren (`KortBue.tsx`, styrer CSS-animasjonene med Web Animations). Merket vises ikke på kortene i buen; det er ikke avklart med Låvli. Har vi færre enn tre egne kort med bilde, vises ikke buen: ved «lanser» (eksemplene slettes) må buen få en ny kilde, eller forsvinner den. Eieren har også sett varianter med grå undertekst og med navn og pris (A4b1b, A4b1n1–n4), men har ikke valgt dem. Kildene til alle prototypene ligger i `docs/utkast-forside/`. Samme dag etter tilbakemeldinger fra eieren på telefon: tekstfelt med egen ramme får ikke lenger den felles fokusrammen inni (`:focus-visible`-unntaket i `globals.css`), og på Meldinger er «Min side» og fanene skjult på telefon (`kun-pc`), fordi siden åpnes fra bunnmenyen. Samtalelisten viser forbokstaver når annonsebildet er borte (`ListingThumb`). Bunnmenyen skjules mens skjermtastaturet er oppe (`useSkriver` i `BunnMeny.tsx`), ellers legger iPhone den midt på skjermen over tastaturet. Fokusregelen i `globals.css` står i `:where()` så egne feltregler (som `.fb-sok input`) alltid vinner; uten det kom den doble rammen tilbake på forsidens søkefelt. UTKAST som venter på eieren (ikke live): grenen `utkast-holder` viser kortene i buen i holderen med navneplate og «Eksempelannonse» (samme `Slab` som kortraden på PC), valgfritt med speiling (`data-speil` på `.fb-bue`). Eieren har fått tre filmer (uten speiling, med speiling, og med den gamle hvite rammen på annonsene) og åtte forslag til ny overskrift (`docs/utkast-forside/overskrifter.js`), men har ikke valgt. Angre: `git revert` av flettingen fra `utkast-buen`. Ikke testet innlogget: ulest-merket i bunnmenyen.
- Designsystem «HOBBYSTRADA» finnes som Claude-artefakt (synket fra koden): https://claude.ai/artifact/2Q8CY4WFoM6Vs6rvtvvN3w. Et forside-testlerret ble laget 3. nov og slettet igjen på eierens ønske.

## Gjenstår (eieren selv)

1. Test angring etter ett døgn med Elise (skal vise 24 av 72 timer og 26 kr), send bilder til Låvli. Refunder Elises to testbetalinger i Vipps-portalen.
2. Databehandleravtale hos Domene AS (personvernerklæringen sier avtalen finnes). DKIM er gjort.
3. Melding til skattekontoret om oppbevaring i Stockholm (utkast gitt i samtalen 1. nov).
4. Regnskapsfører: kreditnota ved refusjon.
5. Lese protokollen og krysse av åpne punkter.
6. Si «lanser».

## Markedsføring (klart i `docs/markedsforing/`)

- Facebook-innlegg og melding til gruppeadministratorer.
- Instagram-melding til breakere (uformell).
- Instagram-karuseller ligger i scratchpad/zip fra tidligere («HOBBYSTRADA - Instagram …»); eieren har ikke valgt chat-variant E/F/G ennå.
- Tilbakemelding fra kontakt («Ed»): sveip på forsiden (gjort), skrivefeil (venter på skjermbilder), vurdere løftet visuell identitet. Tre retninger (A Samleren, B Stadion, C Chrome) ble vist som bilder 2. nov; eieren har ikke valgt.
