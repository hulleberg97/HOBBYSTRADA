# Protokoll over behandlingsaktiviteter

Personvernforordningen artikkel 30. Gjelder hobbystrada.no.

**Behandlingsansvarlig:** HOBBYSTRADA ULLEBERG, org.nr. 938 698 929, Stalsbergs gate 4, 3612 Kongsberg, post@hobbystrada.no. Ingen personvernombud.

**Sist oppdatert:** oktober 2026. Oppdateres når nettsiden får nye funksjoner som behandler personopplysninger.

## Felles for alle behandlingene

- **Databehandlere:** Supabase (database og lagring av bilder, Stockholm), Vercel (drift, Frankfurt, globalt CDN), Domene AS (e-post, Norge).
- **Overføring til tredjeland:** Supabase og Vercel er amerikanske. Grunnlag: Vercel er sertifisert under EU–US Data Privacy Framework. Supabase bruker EUs standardpersonvernbestemmelser (2021/914) i databehandleravtalen.
- **Sikkerhet (art. 32):** All trafikk kryptert (HTTPS). Databasen er bare tilgjengelig via serveren med tjenestenøkkel, ikke direkte fra nettleseren. Bilder i chatten ligger i privat lagring med lenker som varer ett døgn. Bare driftsansvarlig har tilgang til databasen og leverandørpanelene, beskyttet med sterke passord og tofaktor. Daglig automatisk sletting av utdaterte data.

## Behandlingene

| Nr | Behandling | Formål | Kategorier av registrerte | Opplysninger | Grunnlag | Mottakere | Lagringstid |
|---|---|---|---|---|---|---|---|
| 1 | Konto og innlogging | Gi brukeren en konto, logge inn med Vipps, vise «Verifisert med Vipps» | Brukere | Navn, e-post, Vipps-ID, tidspunkt for egenerklæring om 18 år, tidspunkt for siste innlogging | Avtale (art. 6 nr. 1 b) | Supabase, Vipps | Til kontoen slettes. Automatisk sletting etter 24 måneder uten innlogging, med varsel etter 23 |
| 2 | Annonser | Vise annonser i markedet, manuell godkjenning | Brukere (selgere) | Annonseinnhold, bilder, fornavn, sted | Avtale (art. 6 nr. 1 b) | Alle besøkende (uten e-post), Supabase | Til brukeren sletter annonsen eller kontoen. Avviste slettes etter 30 dager |
| 2b | Prisarkivet «Solgte kort» | Vise hva kort er solgt for | Brukere (selgere) | Kortdata, pris, salgsdato, bilder (uten fornavn og sted) | Berettiget interesse (art. 6 nr. 1 f) | Alle besøkende, Supabase | 12 måneder etter salget, eller til annonsen/kontoen slettes |
| 3 | Meldinger mellom brukere | Formidle meldinger mellom kjøper og selger, varsle på e-post | Brukere | Meldinger, bilder, navn, e-post (til varsling) | Avtale (art. 6 nr. 1 b). Berettiget interesse (f) når samtalen beholdes etter at én part har slettet kontoen | Den andre parten, Supabase, Domene AS | 12 måneder etter siste melding |
| 4 | Gjennomgang av meldinger | Undersøke rapporter og mistanke om svindel | Brukere | Meldinger og bilder i de aktuelle samtalene | Berettiget interesse (art. 6 nr. 1 f) | Ingen eksterne | Ingen egne kopier |
| 5 | Annonseløft og betaling | Ta betalt via Vipps, aktivere løftet | Brukere (kjøpere av løft) | Pakke, beløp, tidspunkt, annonsens tittel, navn, e-post | Avtale (b) og bokføringsloven (c) | Vipps, Supabase | 5 år etter regnskapsårets slutt. Salgsdokumentet oppbevares uendret, også etter at kontoen er slettet |
| 6 | Lagrede søk | Varsle når nye kort passer et søk | Brukere | Søket, e-post | Avtale (art. 6 nr. 1 b) | Supabase, Domene AS | Til søket eller kontoen slettes |
| 7 | Varsler på nettsiden | Beskjed om godkjenning, avvisning, løft og søketreff | Brukere | Hendelse, annonsens tittel, tidspunkt | Avtale (art. 6 nr. 1 b) | Supabase | 90 dager |
| 8 | Henvendelser og rapporter | Svare på kontaktskjema, behandle rapporter om annonser | Alle som kontakter oss, selgere som rapporteres | Navn, e-post, innhold, hvilken annonse | Berettiget interesse (art. 6 nr. 1 f) | Supabase, Domene AS | 12 måneder (rapporter: etter behandling) |
| 9 | Utestengelse | Håndheve vilkårene, hindre ny konto | Utestengte brukere | Vipps-ID, konto-ID, tidspunkt, hvilket vilkår som er brutt, skjulte annonser (til kontoen slettes etter 30 dager eller etter klage) | Berettiget interesse (art. 6 nr. 1 f) | Supabase | Sperreliste 2 år, kontoen 30 dager |
| 10 | Sikkerhet, svindel og spam | Stoppe spam og misbruk | Alle besøkende | IP-adresse, tekniske logger | Berettiget interesse (art. 6 nr. 1 f) | Supabase, Vercel | IP ved skjema: ett døgn. Logger: inntil 7 dager |
| 11 | Informasjonskapsler | Holde brukeren innlogget, sikre Vipps-innlogging | Brukere | Innloggingskapsel, Vipps-kapsel | Nødvendig for tjenesten (ekomloven § 3-15) | Ingen | Innlogging: 90 dager etter siste besøk. Vipps: 10 minutter |

## Rutiner

- **Innsyn, retting, sletting, begrensning, dataportabilitet, protest:** henvendelser til post@hobbystrada.no besvares uten ugrunnet opphold og senest innen én måned. Identitet bekreftes ved innlogging.
- **Sletting av konto:** brukeren sletter selv på Min side. Annonser, bilder, varsler, lagrede søk og Vipps-kobling slettes umiddelbart. Betalinger beholdes uendret (bokføringsloven § 10). I samtaler vises «Slettet bruker».
- **Avvik og brudd (art. 33–34):** oppdages et brudd på personopplysningssikkerheten, vurderes risiko samme dag. Datatilsynet varsles innen 72 timer hvis bruddet kan medføre risiko. Berørte brukere varsles på e-post hvis risikoen er høy.
- **Mindreårige:** egenerklæring om 18 år ved kontoopprettelse. Ved rapport «Brukeren virker å være under 18 år», chatmeldinger eller andre tydelige tegn på at en bruker er mindreårig, stenges kontoen (vilkår: uriktige opplysninger om alder) med vanlig begrunnelse og klageadgang. Markedsføring av annonseløft skal ikke inneholde direkte kjøpsoppfordringer rettet mot barn.
- **Angrerett på annonseløft:** kunden angrer via knappen på kvitteringen, angreskjemaet eller e-post. Ved knappen sendes bekreftelse automatisk. Ved e-post svares det samme dag med bekreftelse på at meldingen er mottatt, og ubrukte dager refunderes i Vipps-portalen innen 14 dager.
- **Databehandleravtaler (art. 28):** Supabase: databehandleravtalen (DPA) med EUs standardpersonvernbestemmelser inngår i Supabases vilkår for alle kunder (supabase.com/legal/customer-resources/data-processing-addendum, kopi lagret 28. oktober 2026, Pro-plan). Vercel: DPA inngår i Vercels vilkår. Domene AS: standard databehandleravtale.
