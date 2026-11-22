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
