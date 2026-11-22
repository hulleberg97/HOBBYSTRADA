const { chromium, devices } = require("playwright"); const fs=require("fs");
const sv=(d,s=14)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="flex:none">${d}</svg>`;
const I={ pin:'<path d="M20 10c0 5-8 12-8 12s-8-7-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>', penn:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>', hake:'<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z"/><path d="m9 12 2 2 4-4"/>', skjold:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.500-1-8-4-8-9V6z"/>', pil:'<path d="M5 12h14M13 6l6 6-6 6"/>', lag:'<path d="M12 2 2 7l10 5 10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>' };
const pilknapp=`<i aria-hidden="true">${sv(I.pil,16)}</i>`;
const rad='display:flex;align-items:center;gap:5px';
const gra='color:#475569';
const brikke='display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 8px;border-radius:999px;background:#f1f3f7;font-size:12px;font-weight:600;color:#0b1426;white-space:nowrap';
const V=[
 ["0","Slik den er i utkastet","Sett, navn, pris og sted som ren tekst.",null],
 ["1","Ikoner","Nål foran stedet, og en linje med korttype og opplag.",
  `<small>Topps Los Blancos</small><b>Zinedine Zidane</b><strong>9 999 kr</strong>
   <span style="${rad};margin-top:8px;font-size:12.5px;font-weight:600;color:#0b1426">${sv(I.penn,13)}Autograf<span style="${gra};font-weight:500">· 02/10</span></span>
   <span class="fk-bunn"><em style="${rad}">${sv(I.pin,13)}Kongsberg</em>${pilknapp}</span>`],
 ["2","Brikker","Korttype og opplag som små brikker under navnet.",
  `<small>Topps Los Blancos</small><b>Zinedine Zidane</b>
   <span style="display:flex;gap:5px;margin-top:7px"><span style="${brikke}">${sv(I.penn,12)}Autograf</span><span style="${brikke}">02/10</span></span>
   <strong style="margin-top:9px">9 999 kr</strong>
   <span class="fk-bunn"><em style="${rad}">${sv(I.pin,13)}Kongsberg</em>${pilknapp}</span>`],
 ["3","Samme skrift som overskriften","Navnet i overskriftens skrift, settet som liten etikett.",
  `<small style="font-size:11.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase">Topps Los Blancos</small>
   <b style="font-family:var(--f-fraunces),serif;font-size:21px;letter-spacing:-.02em;line-height:1.08;margin-top:4px">Zinedine Zidane</b>
   <strong style="font-size:23px">9 999 kr</strong>
   <span class="fk-bunn"><em style="${rad}">${sv(I.pin,13)}Kongsberg</em>${pilknapp}</span>`],
 ["4","Prisen nederst","Navn og fakta øverst, stor pris ved siden av pilknappen.",
  `<b style="margin-top:0;font-size:18.5px">Zinedine Zidane</b><small style="margin-top:3px">Topps Los Blancos</small>
   <span style="${rad};margin-top:8px;font-size:12.5px;${gra}">${sv(I.penn,13)}Autograf · 02/10</span>
   <span style="${rad};margin-top:4px;font-size:12.5px;${gra}">${sv(I.pin,13)}Kongsberg</span>
   <span class="fk-bunn"><strong style="margin:0;font-size:25px">9 999 kr</strong>${pilknapp}</span>`],
 ["5","Faktalinjer","Små ledetekster foran fakta, som et datablad.",
  `<b style="margin-top:0;font-size:18.5px">Zinedine Zidane</b><strong style="margin-top:4px;font-size:23px">9 999 kr</strong>
   <span style="display:grid;grid-template-columns:auto 1fr;gap:3px 10px;margin-top:9px;font-size:12.5px;color:#0b1426"><span style="${gra}">Sett</span><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Topps Los Blancos</span><span style="${gra}">Type</span><span>Autograf · 02/10</span></span>
   <span class="fk-bunn"><em style="${rad}">${sv(I.pin,13)}Kongsberg</em>${pilknapp}</span>`],
 ["6","Klubb og opplag fremhevet","Klubben med ikon over navnet, type og opplag i mørk brikke under prisen.",
  `<small style="${rad};color:#0b1426;font-weight:600">${sv(I.skjold,13)}Real Madrid</small>
   <b style="margin-top:4px">Zinedine Zidane</b><small style="margin-top:2px">Topps Los Blancos</small>
   <strong style="margin-top:6px">9 999 kr</strong><span style="display:flex;margin-top:6px"><span style="display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:6px;background:#0b1426;color:#fff;font-size:12px;font-weight:700;letter-spacing:.02em">Autograf 02/10</span></span>
   <span class="fk-bunn"><em style="${rad}">${sv(I.pin,13)}Kongsberg</em>${pilknapp}</span>`],
];
(async()=>{const b=await chromium.launch();
 const c=await b.newContext({...devices["iPhone 13"],viewport:{width:390,height:780},deviceScaleFactor:3,locale:"nb-NO"}); const p=await c.newPage();
 await p.addInitScript(()=>{ const ekte=window.setInterval; window.setInterval=(f,ms,...a)=>ms===3400?0:ekte(f,ms,...a); });
 await p.goto("http://localhost:3718/",{waitUntil:"networkidle"}); const k=p.getByRole("button",{name:"Bare nødvendige"}).first(); if (await k.count()) await k.click(); await p.waitForTimeout(1500); await p.evaluate(()=>document.fonts.ready);
 const bb=await p.locator(".fk-flis").first().boundingBox(); const ut=[];
 for (const [nr,navn,om,html] of V) {
  if (html) { const info=await p.evaluate((html)=>{ const t=document.querySelector(".fk-flis .fk-tekst"); t.innerHTML=html; return {over:t.scrollHeight>t.clientHeight+1, bred:[...t.querySelectorAll("*")].some(e=>e.getBoundingClientRect().right>t.getBoundingClientRect().right+1)}; },html); console.log(nr,navn,"| for høy:",info.over,"| for bred:",info.bred); }
  await p.waitForTimeout(200); await p.screenshot({path:`t${nr}.png`,clip:{x:0,y:bb.y-14,width:366,height:bb.height+30}}); ut.push([nr,navn,om]); }
 await b.close();
 fs.writeFileSync("ark.html",`<!doctype html><meta charset="utf-8"><style>@import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@500;700&display=swap');
body{margin:0;padding:30px 34px 34px;background:#f3f4f6;font-family:"Schibsted Grotesk",sans-serif;color:#0b1426;display:grid;grid-template-columns:repeat(2,440px);gap:26px 30px;width:max-content}
figure{margin:0}img{display:block;width:440px;border-radius:18px;background:#fff;box-shadow:0 0 0 1px rgb(11 20 38/.08)}
b{display:block;margin:0 0 3px 4px;font-size:19px}span{display:block;margin:0 0 10px 4px;font-size:14.5px;color:#475569}</style>${ut.slice(1).map(([nr,n,o])=>`<figure><b>${nr} – ${n}</b><span>${o}</span><img src="t${nr}.png"></figure>`).join("")}`);
 const b2=await chromium.launch({proxy:{server:process.env.HTTPS_PROXY}}); const q=await b2.newPage({viewport:{width:1100,height:700},deviceScaleFactor:2}); await q.goto("file://"+process.cwd()+"/ark.html",{waitUntil:"networkidle"}); await q.evaluate(()=>document.fonts.ready); await q.screenshot({path:"flis-tekst.png",fullPage:true}); await b2.close();})().catch(e=>{console.log("FEIL",e.message.split("\n").slice(0,3).join(" | "));process.exit(1)});
