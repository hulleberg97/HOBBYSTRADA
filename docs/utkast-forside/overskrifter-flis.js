const { chromium, devices } = require("playwright"); const fs=require("fs");
const sans='font-family:inherit;font-weight:800;letter-spacing:-.045em;color:#0b1426;margin:0';
const gra='color:#5b6472';
const V=[
 ["1","Finn ditt neste kort","Én linje med forklaring under. Tar minst plass.",
  `<h1 style="${sans};font-size:33px;line-height:1.02">Finn ditt neste kort</h1><p style="margin:6px 0 0;font-size:15px;${gra}">Kjøp og selg fotballkort direkte.</p>`],
 ["2","Kjøp og selg fotballkort","Sier rett ut hva siden er. Stor, over to linjer.",
  `<h1 style="${sans};font-size:42px;line-height:.98">Kjøp og selg<br>fotballkort</h1>`],
 ["3","Fotballkort fra samler til samler","To toner: det viktigste ordet mørkt, resten grått.",
  `<h1 style="${sans};font-size:44px;line-height:.98">Fotballkort<br><span style="font-size:30px;letter-spacing:-.04em;color:#9aa3b2">fra samler til samler</span></h1>`],
 ["4","Finn ditt neste kort","Liten grå linje over: «Markedsplass for fotballkort».",
  `<p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;${gra}">Markedsplass for fotballkort</p><h1 style="${sans};font-size:33px;line-height:1.02;margin-top:8px">Finn ditt neste kort</h1>`],
 ["5","Finn ditt neste kort","Skriften fra PC-forsiden, med «neste» i kursiv.",
  `<h1 style="font-family:var(--f-fraunces),serif;font-weight:700;font-size:35px;letter-spacing:-.03em;line-height:1.05;color:#0b1426;margin:0">Finn ditt <em style="font-style:italic">neste</em> kort</h1><p style="margin:6px 0 0;font-size:15px;${gra}">Markedsplass for kjøp og salg av fotballkort.</p>`],
 ["6","Fotballkort til salgs","Som en hylle hos de store markedsplassene, med «Se alle» til høyre.",
  `<div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px"><h1 style="${sans};font-size:30px;line-height:1.05">Fotballkort til salgs</h1><span style="flex:none;font-size:14.5px;font-weight:600;color:#0b1426">Se alle →</span></div>`],
 ["7","Norsk markedsplass for fotballkort","To toner over to linjer, middels stor.",
  `<h1 style="${sans};font-size:34px;line-height:1.02">Norsk markedsplass<br><span style="color:#9aa3b2">for fotballkort</span></h1>`],
 ["8","Kortet du mangler finnes her","Mer personlig. Første linje grå, andre mørk.",
  `<h1 style="${sans};font-size:36px;line-height:1.02"><span style="color:#9aa3b2">Kortet du mangler</span><br>finnes her</h1>`],
];
(async()=>{const b=await chromium.launch();
 const c=await b.newContext({...devices["iPhone 13"],viewport:{width:390,height:780},deviceScaleFactor:2,locale:"nb-NO"}); const p=await c.newPage();
 await p.addInitScript(()=>{ const ekte=window.setInterval; window.setInterval=(f,ms,...a)=>ms===3400?0:ekte(f,ms,...a); });
 await p.goto("http://localhost:3718/",{waitUntil:"networkidle"}); const k=p.getByRole("button",{name:"Bare nødvendige"}).first(); if (await k.count()) await k.click(); await p.waitForTimeout(1500); await p.evaluate(()=>document.fonts.ready);
 const ut=[];
 for (const [nr,tekst,om,html] of V) {
  const info=await p.evaluate((html)=>{ const t=document.querySelector(".fb-topp"); t.style.textAlign="left"; t.innerHTML=html; const h=t.querySelector("h1"); return {bred:t.scrollWidth>t.clientWidth+1, linjer:Math.round(h.getBoundingClientRect().height), topp:Math.round(document.querySelector(".fk").getBoundingClientRect().top)}; },html);
  await p.waitForTimeout(250); await p.screenshot({path:`v${nr}.png`,clip:{x:0,y:0,width:390,height:470}}); ut.push([nr,tekst,om]); console.log(nr,tekst,"| for bred:",info.bred,"| h1-høyde",info.linjer,"| flisen starter på",info.topp); }
 await b.close();
 const kort=([nr,tekst,om])=>`<figure><b>${nr} – «${tekst}»</b><span>${om}</span><img src="v${nr}.png"></figure>`;
 for (const [fil,del] of [["ark1",ut.slice(0,4)],["ark2",ut.slice(4)]]) fs.writeFileSync(fil+".html",`<!doctype html><meta charset="utf-8"><style>@import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@500;700&display=swap');
body{margin:0;padding:34px 34px 38px;background:#f3f4f6;font-family:"Schibsted Grotesk",sans-serif;color:#0b1426;display:flex;gap:26px;width:max-content}
figure{margin:0;width:390px}img{display:block;width:390px;border-radius:24px;box-shadow:0 30px 50px -30px rgb(11 20 38/.5),0 0 0 1px rgb(11 20 38/.08)}
b{display:block;margin:0 0 4px 6px;font-size:18px}span{display:block;margin:0 0 14px 6px;font-size:14.5px;color:#475569;min-height:38px}</style>${del.map(kort).join("")}`);
 const b2=await chromium.launch({proxy:{server:process.env.HTTPS_PROXY}}); const q=await b2.newPage({viewport:{width:1800,height:700},deviceScaleFactor:1.5});
 for (const f of ["ark1","ark2"]) { await q.goto("file://"+process.cwd()+"/"+f+".html",{waitUntil:"networkidle"}); await q.evaluate(()=>document.fonts.ready); await q.screenshot({path:"flis-overskrifter-"+f.slice(3)+".png",fullPage:true}); }
 await b2.close();})().catch(e=>{console.log("FEIL",e.message.split("\n").slice(0,3).join(" | "));process.exit(1)});
