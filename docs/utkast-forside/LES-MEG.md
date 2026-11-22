# Utkast til forside på telefon med effekter (22. november 2026)

Tre animerte prototyper, vist til eieren som korte filmer. Ingen av dem er bygget inn i siden.

- **A – Kortstokken:** stor overskrift som toner inn ord for ord, tre kort i en stokk som blar seg selv, holo-glans over kortene, søk og to knapper under.
- **B – Flisene:** flislagt oppsett: stor flis med to svevende kort, mørk «Selg kortene dine»-flis, «Nyeste» med bilder som ruller, og et bånd med fordeler.
- **C – Glasset:** rader med kort som driver sakte på skrå, og et frostet glasspanel med overskrift, søk og knapper oppå.

Felles: lys bakgrunn, fast bunnmeny, faner og rene annonsekort som glir inn når de rulles frem (fra utkastet `utkast-mobil-torget`).

`bygg.py` lager A.html, B.html og C.html. Den trenger `kort.json` og bildene i `img/`, som hentes fra den offentlige markedssiden (se STATUS.md). `film.js` tar opp hver prototype bilde for bilde med Playwright; filmene settes sammen med ffmpeg.

## Runde 2 (22. november): flere varianter av A og C

Eieren ba om flere utkast av A og C. B (Flisene) er lagt til side.

- **A2 – Viften:** fem kort folder seg ut som en vifte øverst og vugger rolig. Overskrift og søk under.
- **A3 – Ett kort:** ett stort kort som dreier sakte i 3D med holo-glans. Kortet og navnet under byttes hvert tredje sekund. Venstrestilt overskrift.
- **A4 – Karusellen:** midtkortet står frem, nabokortene titter inn fra sidene, og raden flytter seg ett kort om gangen. Prikker under viser hvor man er.
- **C2 – Glassark:** to skarpe rader med kort øverst, og et glassark som glir opp nedenfra med overskrift, søk og knapper.
- **C3 – Søylene:** overskrift på hvit bunn, tre søyler med kort som går opp og ned, og bare søkefeltet i frostet glass oppå.
- **C4 – Dis:** kortene er helt uskarpe og fungerer som fargebakgrunn, glasspanelet er rolig å lese, og ett skarpt kort titter frem øverst til høyre.

## Runde 3 (22. november): flere varianter av A4 (Karusellen)

Eieren ba om flere forslag for A4.

- **A4a – Dybden:** sju kort, naboene står vinklet innover i dybden, og kortene speiler seg svakt i «gulvet». Prikker under.
- **A4b – Buen:** kortene glir jevnt langs en slak bue uten å stoppe. Kortet i midten er størst.
- **A4c – Annonsekortene:** store hvite fliser med kortbilde, navn, sett, sted og pris. Naboflisene titter inn fra kantene, og en strek under viser fremdriften. Viser både ekte annonser og eksempelannonser (med merket).
- **A4d – Scenen:** karusellen ligger først, i et avrundet panel som skifter farge etter kortet. Navn og sett står under, og miniatyrer viser hvilket kort som er fremme. Overskriften står venstrestilt under panelet.

## Runde 4 (22. november): A4b med tydeligere rammer

Eieren ba om A4b (Buen) med litt tydeligere rammer.

- **A4b-1 – Kortrammer:** hvit ramme og tynn mørk strek rundt hvert kort.
- **A4b-2 – Innrammet felt:** samme kortrammer, og hele karusellen ligger i et avrundet felt med egen kant.

## Runde 5 (22. november): flere varianter av A4c (Annonsekortene)

Eieren ba om flere optimaliserte design for A4c.

- **A4c-1 – Skarp flis:** bildefeltet har en svak farge som passer kortet, navn og sett står på egne linjer uten avkutting, prisen er større, og naboflisene er tydelige i stedet for utvisket.
- **A4c-2 – Hylla:** overskrift og søk først, deretter en hylle «Utvalgte kort» med to kort i bredden som flytter seg ett kort om gangen. Ingen knapper under, så kategoriene og de første annonsene synes på første skjermbilde.
- **A4c-3 – Liggende flis:** lav, bred flis med kortet til venstre og sett, navn, stor pris, sted og pilknapp til høyre. Tar minst høyde av flisvariantene.
- **A4c-4 – Glassflis:** kortets egne farger ligger uskarpt som bakgrunn i flisen, og navn og pris står på et felt i frostet glass nederst.

## Runde 6 (22. november): A4b-1 uten gullmerket

Eieren ba om A4b-1 uten «Norsk markedsplass for fotballkort» i gull.

- **A4b1a – Uten merket:** gullmerket er fjernet helt. Overskriften står alene.
- **A4b1b – Grå tekst under:** samme tekst står som en rolig grå linje under overskriften.

## Runde 7 (22. november): A4b-1 med navn og pris

Eieren spurte om buen kan vise navn og pris. Begge er uten gullmerket.

- **A4b1n – Felt under buen:** et innrammet felt under buen viser navn, sett og pris for kortet som er i midten, og bytter når neste kort kommer. «Eksempelannonse» står som flik på feltet.
- **A4b1p – Under hvert kort:** navn og pris står under hvert kort og følger med langs buen. «Eksempelannonse» står som flik på kortene.

I utkastene er alle kortene eksempelkort. Når dette bygges på ordentlig, hentes kortene fra annonsene, og fliken vises bare på eksempelannonser.

## Runde 8 (22. november): flere varianter av A4b1n (buen med felt for navn og pris)

Eieren ba om flere varianter av A4b1n. I alle ruller teksten opp når neste kort kommer, så feltet aldri står tomt.

- **A4b1n1 – Glassfelt:** feltet er i frostet glass og ligger delvis over midtkortet.
- **A4b1n2 – Uten ramme:** ingen ramme. Navn og stor pris står midtstilt under buen, med «Eksempelannonse» som liten brikke over.
- **A4b1n3 – Mørkt felt:** mørk blå med gullstrek nederst, hvit tekst og hvit pilknapp.
- **A4b1n4 – Søket først:** overskrift på én linje, grå undertekst og søk øverst. Buen ligger under søket, og feltet har pilknapp. Ingen knapper under, så kategoriene og de første annonsene synes.

## Overskrifter til telefonforsiden (22. november)

Eieren ba om flere overskrifter og utforminger. `overskrifter.js` tegner åtte forslag oppå den ekte telefonforsiden i en testnettleser og lager to sammenligningsark. Ingenting av dette er live.

1. «Kjøp og selg fotballkort», samme stil som nå.
2. «Finn ditt neste kort» med Fraunces (skriften fra PC-forsiden), «neste» i kursiv.
3. «Fra samler til samler», venstrestilt og stor, med linjen «Kjøp og selg fotballkort direkte.» under.
4. «Markedsplassen for fotballkort», der «fotballkort» har blå fargeovergang.
5. «Kortet du mangler finnes her», første linje grå og andre mørk.
6. «Finn ditt neste kort» på én linje med liten grå linje «Fra samler til samler» over.
7. «Jakten på neste kort starter her» med Fraunces, andre linje i kursiv.
8. «Norsk markedsplass for fotballkort» med Sora, og linjen «Kjøp og selg direkte med andre samlere.» under.

## Runde 9 (22. november): flere varianter av A4c4 (Glassflisen)

Eieren ba om flere varianter av A4c4. Alle er uten gullmerket over overskriften.

- **A4c4a – Bred glassflis:** flisen går nesten i full bredde med større kort. Glassfeltet har navn og pris på første linje, og sett og «Se annonsen» på andre.
- **A4c4b – Lys og luftig:** sterkere hvitt slør så fargene blir pastell, hvit ramme rundt kortet, hvitt felt med kant i stedet for glass, og nabofliser som ikke er utvisket.
- **A4c4c – Vippet kort:** kortet står litt på skrå med en glans som glir over. Prisen ligger i en egen glassbrikke på kortet, og glassfeltet nederst har navn, sett og pilknapp.
- **A4c4d – Liggende glassflis:** lav og bred. Kortet står til venstre, og et glassfelt til høyre har sett, navn, stor pris, sted og pilknapp. Tar minst høyde, så fanene og de første annonsene synes.

## Runde 10 (22. november): flere varianter av A4c4d (liggende glassflis)

Eieren ba om flere av A4c4d, med tilpasset overskrift og færre forskjellige farger i bakgrunnen.

- **A4c4d1 – Rolig grå:** alle flisene har samme lyse gråblå flate, og tekstfeltet er hvitt. Overskriften står venstrestilt på én linje, på linje med flisen, med «Kjøp og selg fotballkort direkte.» under.
- **A4c4d2 – Dempet kortfarge:** kortets farger ligger bak som et svakt, nesten grått skjær. Overskriften er midtstilt og litt mindre.
- **A4c4d3 – Hvit flis med kant:** ingen farge bak. Hvit flis med tynn mørk kant og kortet på et lysegrått felt. Stor venstrestilt overskrift over to linjer.
- **A4c4d4 – Varm lys flate:** alle flisene har samme lyse kremfarge. Overskriften har Fraunces (skriften fra PC-forsiden) med «neste» i kursiv.

## Overskrifter til utkastet med flis-karusell (22. november)

Eieren ba om flere typer overskrifter som passer til utkastet på grenen `utkast-flis`. `overskrifter-flis.js` tegner åtte venstrestilte forslag oppå utkastet (kjørt lokalt) og lager to ark. Ingenting av dette er live.

1. «Finn ditt neste kort» på én linje, med «Kjøp og selg fotballkort direkte.» under.
2. «Kjøp og selg fotballkort», stor over to linjer.
3. «Fotballkort» stort og mørkt, «fra samler til samler» grått under.
4. «Finn ditt neste kort» på én linje, med liten grå linje «Markedsplass for fotballkort» over.
5. «Finn ditt neste kort» med Fraunces og «neste» i kursiv, med «Markedsplass for kjøp og salg av fotballkort.» under.
6. «Fotballkort til salgs» som hylleoverskrift, med «Se alle» til høyre.
7. «Norsk markedsplass» mørkt og «for fotballkort» grått, over to linjer.
8. «Kortet du mangler» grått og «finnes her» mørkt.

## Teksten inne i flisen (22. november)

Eieren spurte om tekstdesignet i annonseboksen på forsiden kan endres (skrifttype eller ikoner). `flis-tekst.js` tegner seks forslag oppå første flis i utkastet `utkast-flis` (kjørt lokalt). Ingenting av dette er live.

1. Ikoner: nål foran stedet, og en linje med penn-ikon, korttype og opplag under prisen.
2. Brikker: korttype og opplag som små grå brikker mellom navn og pris.
3. Samme skrift som overskriften: navnet i Fraunces, settet som liten etikett med store bokstaver.
4. Prisen nederst: navn, sett, type og sted øverst, stor pris ved siden av pilknappen.
5. Faktalinjer: ledetekstene «Sett» og «Type» foran fakta.
6. Klubb og opplag fremhevet: klubb med skjold-ikon over navnet, type og opplag i mørk brikke under prisen.

## Scenen: kombinasjon av dagens versjon og A4d (22. november)

Eieren ba om et utkast som kombinerer dagens live-versjon (flis-karusellen) med A4d (Scenen), laget så grundig som mulig. Det ligger på grenen `utkast-scene` (`KortScene.tsx`, stiler `.fs*`, bryteren `TOPP = "scene"` i `MobilForside.tsx`). Ikke live.

- Fra dagens versjon: serif-overskriften med linjen under, og annonseinformasjonen (sett, navn, pris, korttype med ikon og opplag, sted med nål), merket «Eksempelannonse» og «Annonseløft».
- Fra A4d: kortene står på rekke i et panel med kortet i midten størst, panelet tar farge etter kortet som er fremme, og miniatyrer viser hvor man er.
- Bruk: raden kan dras sidelengs og går rundt uten ende, et trykk på et sidekort henter det frem, et trykk på kortet i midten eller på feltet åpner annonsen, miniatyrene hopper til et kort. Går av seg selv hvert 3,8 s til noen tar på den.

Kvalitetssikring: `test-scene.js` (12 funksjonstester med simulert berøring, tastatur, «mindre bevegelse» og bredder 320–768), axe-core (0 brudd), Lighthouse lokalt (tilgjengelighet 100, fart 87–92), og en uavhengig designgjennomgang som ga ti funn. Ni er rettet: lysere og renere fargeskjær, lavere panel, samme venstrekant som overskrift og søk, lys pil i feltet, jevn radavstand, større miniatyrer, hele nabokort, undertekst på smale telefoner og bredere oppsett på nettbrett. Forslaget om å flytte søkefeltet over scenen er ikke fulgt, fordi søk alltid ligger i bunnmenyen. `film-scene.js` filmer utkastet med styrt klokke.

Oppdatert samme kveld: eieren ba om å fjerne raden med småbilder (miniatyrene) under kortene. Den er tatt bort fra `KortScene.tsx`, stilene og testene.

Oppdatert senere samme kveld: eieren ba om litt større kortbilder og litt mindre infofelt. Kortet i midten er nå 172 px bredt på en vanlig telefon (før 150), nabokortene står litt lenger inn bak det, og feltet er 82 px høyt (før 98) med litt mindre skrift og pil.

## Annonsene først (22. november, sent): nytt oppsett for telefonforsiden

Eieren ba om at søk og ekte annonser kommer raskere frem på telefon. Utkastet ligger på grenen `utkast-annonser-forst` (bygger på `utkast-scene`). Ikke live.

Bryteren `OPPSETT` øverst i `MobilForside.tsx` velger rekkefølgen: «annonser» (nytt) eller «karusell» (som før). `TOPP` velger fortsatt hvilken karusell som brukes.

Nytt oppsett, «annonser»:
1. Overskrift og undertekst med mindre luft over, og søkefeltet rett under.
2. Knappene «Se alle annonser» og «Legg ut kort» er borte fra toppen. «Se alle …» står fortsatt under annonsene, og «Legg ut kort» i selg-feltet og bunnmenyen.
3. Fanene rett under søkefeltet, og annonsene rett under fanene. På en iPhone 13 i Safari (390 × 664) synes hele første rad med bilde, sett, navn og pris.
4. Karusellen er flyttet ned som seksjonen «Utvalgte kort» etter de fire første annonsene (`FORST`), og henter bildene sine først når den nærmer seg skjermen (`lat`). Ekte annonser står alltid først og eksempler sist; eksemplene forsvinner når det er minst åtte ekte annonser (`PER_FANE`). Eksempler som står i karusellen vises ikke en gang til i rutenettet.
5. Annonsekortene på telefonforsiden (`ListingCard` med `rent`): settet i liten dempet tekst, spillernavnet i fet tekst som brytes og aldri kuttes, så prisen. Visningstallet er borte. Markedet, søk og PC bruker kortet som før.

Kvalitetssikring: `test-annonser-forst.js` (13 tester med simulert berøring og bredder 320–768), axe-core (0 brudd), Lighthouse lokalt (tilgjengelighet 100, fart 84–88, på linje med de andre variantene lokalt). `film-annonser-forst.js` filmer utkastet.

## Kino og galleri (22. november, natt): kinematisk drakt på telefonforsiden

Eieren ba om et stilrent, moderne og kinematisk redesign (mørk «stadium spotlight»-stemning, skandinavisk minimalisme) oppå «annonsene først». Utkastet ligger på grenen `utkast-kino-galleri`. Ikke live. Eieren avviste en helmørk variant tidligere samme dag, så dette er alternativet med mørk topp som går over i et lyst galleri.

Bryteren `OPPSETT = "kino"` i `MobilForside.tsx`. «annonser» og «karusell» virker som før.

- **Mørk topp** (`.kino-hero`): flate #0a0b0e med svak lyskjegle ovenfra og kjølig skjær fra høyre. Overskriften er stram grotesk (800, tett sperring) med «neste» i kursiv Fraunces. Søkefeltet er en glassbar med mykt lys ved fokus. Ingen knapper i toppen.
- **Lyst galleri på ark** (`.kino-ark`, `ForsideFaner` med `ark`): fanene og de fire første annonsene ligger på et hvitt ark med avrundede hjørner over den mørke flaten. Resten av annonsene, «Se alle» og selg-feltet ligger på et nytt ark.
- **Annonsekortet** (`ListingCard` med `studio`): bildet på en nøytral flate i 3:4 med 16 px avrunding og hjerte i glass. Under: sett (små versaler), spillernavn (fet, brytes, kuttes aldri), pris og bare stedsnavn. Visningstall, annonsealder og Vipps-haken vises ikke i galleriet. Merkene «Eksempelannonse» og «Annonseløft» er med.
- **«Utvalgte kort» som mørkt bånd** (`.kino-band`, `KortScene` med `kino`): lyskjegle bak kortene, nabokort dreid 18 grader, dramatisk skygge og en glans som glir over kortet i midten. Infofeltet er mørkt glass med hårlinje.
- **Topplinje og bunnmeny** (`KinoSoner.tsx` + regler nederst i `globals.css`): glass med hårlinjer. De er mørke mens en mørk sone ligger bak dem og lyse ellers, og topplinjen blir lys når menyen åpnes. Gjelder bare forsiden på telefon og nettbrett.
- **Bevegelse**: kortene kommer inn ett og ett, og rammen krymper litt ved trykk. Alt er ren CSS, og «mindre bevegelse» slår det av.

Kvalitetssikring: `test-kino.js` (17 kontroller med simulert berøring, bredder 320–768, PC og «mindre bevegelse»), axe-core (0 brudd på forsiden, topplinjen og bunnmenyen), Lighthouse lokalt (tilgjengelighet 100, fart 85–91), typesjekk, lint og bygg uten feil. `film-kino.js` filmer utkastet.

## Original forside med scenen (22. november, kveld)

Eieren sendte filmen av scenen uten småbilder og ba om «denne type karusell med den versjonen som var til i dag». Tolket som: forsiden slik den var på telefon før 22. november, med scenen i stedet for den rullende kortraden. Utkastet ligger på grenen `utkast-original-scene` (bygger på scenen uten småbilder, med kort på 150 px). Ikke live.

- Bryteren `MOBIL_FORSIDE` i `src/lib/forside.ts`: «original» viser de samme seksjonene som PC på telefon (overskrift, knappene «Se alle annonser» og «Legg ut kort», kategoriraden, «Nyeste annonser» og resten), med `KortScene` der kortraden sto. «ny» viser `MobilForside` som før.
- `page.tsx`: `kun-pc` tas av seksjonene i «original», kortraden får `kun-pc`, og scenen står i en `kun-mobil`-boks. PC er uendret og viser kortraden.
- `globals.css`: på telefon fyller toppen ikke lenger hele skjermen i «original», så scenen med infofeltet synes på første skjermbilde.
- Kortene til karusellen lages nå ett sted (`karusellKort` i `src/lib/forside.ts`), og brukes av både `page.tsx` og `MobilForside`.
- Bunnmenyen og dagens kortstil på telefon (flat ramme, prisen først) er beholdt.

Kvalitetssikring: `test-original-scene.js` (16 kontroller: scenen med simulert berøring, tastatur og «mindre bevegelse», original forside på telefon, PC i bredt og smalt vindu, bredder 320–768), axe-core (0 brudd), Lighthouse lokalt (tilgjengelighet 100, fart 88–89).
