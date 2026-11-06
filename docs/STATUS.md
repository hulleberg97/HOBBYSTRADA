# HOBBYSTRADA – status og arbeidsmåte (oppdatert 3. november 2026)

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
