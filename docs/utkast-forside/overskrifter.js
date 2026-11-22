const { chromium, devices } = require("playwright"); const fs=require("fs");
const sans='font-family:inherit;font-weight:800;letter-spacing:-.045em;line-height:.98;color:#0b1426;margin:0';
const V=[
 ["1","Kjøp og selg fotballkort","Sier rett ut hva siden er. Samme stil som nå.",
  `<h1 style="${sans};font-size:44px">Kjøp og selg<br>fotballkort</h1>`,"center"],
 ["2","Finn ditt neste kort","Samme tekst som nå, med skriften fra PC-forsiden.",
  `<h1 style="font-family:var(--f-fraunces),serif;font-weight:700;font-size:46px;letter-spacing:-.03em;line-height:1;color:#0b1426;margin:0">Finn ditt<br><em style="font-style:italic">neste</em> kort</h1>`,"center"],
 ["3","Fra samler til samler","Venstrestilt og stor, med en forklarende linje under.",
  `<h1 style="${sans};font-size:50px">Fra samler<br>til samler</h1><p style="margin:12px 0 0;font-size:16px;color:#5b6472">Kjøp og selg fotballkort direkte.</p>`,"left"],
 ["4","Markedsplassen for fotballkort","Det viktigste ordet får en blå fargeovergang.",
  `<h1 style="${sans};font-size:37px;line-height:1.02">Markedsplassen for<br><span style="font-size:52px;line-height:1;background:linear-gradient(95deg,#0b1426 10%,#2c55b8 95%);-webkit-background-clip:text;background-clip:text;color:transparent">fotballkort</span></h1>`,"center"],
 ["5","Kortet du mangler finnes her","To toner: første linje grå, andre linje mørk.",
  `<h1 style="${sans};font-size:39px;line-height:1.03"><span style="color:#a6aebb">Kortet du mangler</span><br>finnes her</h1>`,"center"],
 ["6","Finn ditt neste kort","Én linje, med en liten grå linje over. Gir mest plass til kortene.",
  `<p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#5b6472">Fra samler til samler</p><h1 style="${sans};font-size:36px;margin-top:10px">Finn ditt neste kort</h1>`,"center"],
 ["7","Jakten på neste kort starter her","Rolig og klassisk, med skriften fra PC-forsiden.",
  `<h1 style="font-family:var(--f-fraunces),serif;font-weight:700;font-size:36px;letter-spacing:-.025em;line-height:1.06;color:#0b1426;margin:0">Jakten på neste kort<br><em style="font-style:italic">starter her</em></h1>`,"center"],
 ["8","Norsk markedsplass for fotballkort","Bred og kraftig skrift, med en forklarende linje under.",
  `<h1 style="font-family:var(--t-sora),sans-serif;font-weight:800;font-size:30px;letter-spacing:-.04em;line-height:1.08;color:#0b1426;margin:0">Norsk markedsplass<br>for fotballkort</h1><p style="margin:10px 0 0;font-size:15px;color:#5b6472">Kjøp og selg direkte med andre samlere.</p>`,"center"],
];
(async()=>{const b=await chromium.launch({proxy:{server:process.env.HTTPS_PROXY}});
 const c=await b.newContext({...devices["iPhone 13"],viewport:{width:390,height:780},deviceScaleFactor:2,locale:"nb-NO",ignoreHTTPSErrors:true}); const p=await c.newPage();
 await p.goto("https://www.hobbystrada.no/",{waitUntil:"networkidle"}); const k=p.getByRole("button",{name:"Bare nødvendige"}).first(); if (await k.count()) await k.click(); await p.waitForTimeout(1500); await p.evaluate(()=>document.fonts.ready);
 // Buen fryses på samme sted i alle bildene
 await p.evaluate(()=>{ for (const a of document.querySelector(".fb-bue").getAnimations({subtree:true})) { if (!/fb-(bue|str)/.test(a.animationName)) continue; a.pause(); a.currentTime=0; } });
 const ut=[];
 for (const [nr,tekst,om,html,side] of V) {
  const info=await p.evaluate(([html,side])=>{ const t=document.querySelector(".fb-topp"); t.style.textAlign=side; t.style.padding=side==="left"?"26px 20px 0":"30px 16px 0"; t.innerHTML=html; const h=t.querySelector("h1"); return {bred:h.scrollWidth>t.clientWidth-(side==="left"?40:32)+1, skrift:getComputedStyle(h).fontFamily.slice(0,40), h:Math.round(t.getBoundingClientRect().height)}; },[html,side]);
  await p.waitForTimeout(250); await p.screenshot({path:`v${nr}.png`,clip:{x:0,y:0,width:390,height:500}}); ut.push([nr,tekst,om]); console.log(nr,tekst,"| for bred:",info.bred,"| høyde",info.h,"|",info.skrift); }
 await b.close();
 const kort=([nr,tekst,om])=>`<figure><b>${nr} – «${tekst}»</b><span>${om}</span><img src="v${nr}.png"></figure>`;
 for (const [fil,del] of [["ark1",ut.slice(0,4)],["ark2",ut.slice(4)]]) fs.writeFileSync(fil+".html",`<!doctype html><meta charset="utf-8"><style>@import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@500;700&display=swap');
body{margin:0;padding:34px 34px 38px;background:#f3f4f6;font-family:"Schibsted Grotesk",sans-serif;color:#0b1426;display:flex;gap:26px;width:max-content}
figure{margin:0;width:390px}img{display:block;width:390px;border-radius:24px;box-shadow:0 30px 50px -30px rgb(11 20 38/.5),0 0 0 1px rgb(11 20 38/.08)}
b{display:block;margin:0 0 4px 6px;font-size:19px}span{display:block;margin:0 0 14px 6px;font-size:14.5px;color:#475569;min-height:38px}</style>${del.map(kort).join("")}`);
 const b2=await chromium.launch({proxy:{server:process.env.HTTPS_PROXY}}); const q=await b2.newPage({viewport:{width:1800,height:700},deviceScaleFactor:1.5});
 for (const f of ["ark1","ark2"]) { await q.goto("file://"+process.cwd()+"/"+f+".html",{waitUntil:"networkidle"}); await q.evaluate(()=>document.fonts.ready); await q.screenshot({path:"overskrifter-"+f.slice(3)+".png",fullPage:true}); }
 await b2.close();})().catch(e=>{console.log("FEIL",e.message.split("\n").slice(0,3).join(" | "));process.exit(1)});
