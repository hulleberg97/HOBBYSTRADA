# Utkast til forside på telefon med effekter (22. november 2026)

Tre animerte prototyper, vist til eieren som korte filmer. Ingen av dem er bygget inn i siden.

- **A – Kortstokken:** stor overskrift som toner inn ord for ord, tre kort i en stokk som blar seg selv, holo-glans over kortene, søk og to knapper under.
- **B – Flisene:** flislagt oppsett: stor flis med to svevende kort, mørk «Selg kortene dine»-flis, «Nyeste» med bilder som ruller, og et bånd med fordeler.
- **C – Glasset:** rader med kort som driver sakte på skrå, og et frostet glasspanel med overskrift, søk og knapper oppå.

Felles: lys bakgrunn, fast bunnmeny, faner og rene annonsekort som glir inn når de rulles frem (fra utkastet `utkast-mobil-torget`).

`bygg.py` lager A.html, B.html og C.html. Den trenger `kort.json` og bildene i `img/`, som hentes fra den offentlige markedssiden (se STATUS.md). `film.js` tar opp hver prototype bilde for bilde med Playwright; filmene settes sammen med ffmpeg.
