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
