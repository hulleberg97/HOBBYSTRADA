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
