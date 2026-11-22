// Tegner seks skriftforslag oppå telefonforsiden (utkastet med holderen) i en testnettleser og lager to sammenligningsark.
const { chromium, devices } = require("playwright"); const fs=require("fs");
const alt=f=>`.kun-mobil{--font-body:"${f}",system-ui,sans-serif;--font-heading:var(--font-body);--font-mono:var(--font-body);font-family:var(--font-body)}.kun-mobil :is(input,button){font-family:inherit}.bunnmeny{font-family:"${f}",system-ui,sans-serif}`;
const V=[
 ["1","Plus Jakarta Sans","Vennlig og moderne, som mange store apper. På all tekst.","Plus+Jakarta+Sans:wght@400;500;600;700;800",
  alt("Plus Jakarta Sans")+`.fb-h1{font-weight:800;letter-spacing:-.045em;line-height:1}`],
 ["2","Bricolage Grotesque","Særpreget og moderne overskrift. Resten som nå.","Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800",
  `.fb-h1{font-family:"Bricolage Grotesque",sans-serif;font-weight:800;letter-spacing:-.04em;line-height:.98;font-size:clamp(38px,11.4vw,48px)}`],
 ["3","Space Grotesk","Teknologisk og stram. På all tekst.","Space+Grotesk:wght@400;500;600;700",
  alt("Space Grotesk")+`.fb-h1{font-weight:700;letter-spacing:-.05em;line-height:1}`],
 ["4","Barlow Condensed","Sporty, som draktnavn og TV-grafikk. Overskrift med store bokstaver.","Barlow+Condensed:ital,wght@0,700;0,800;1,800",
  `.fb-h1{font-family:"Barlow Condensed",sans-serif;font-style:italic;font-weight:800;text-transform:uppercase;letter-spacing:-.005em;line-height:.9;font-size:clamp(46px,14.6vw,62px)}`],
 ["5","Archivo","Kraftig og bred, som et sportsmagasin. Overskriften.","Archivo:wdth,wght@100..125,800;100..125,900",
  `.fb-h1{font-family:"Archivo",sans-serif;font-weight:900;font-stretch:112%;letter-spacing:-.04em;line-height:.98;font-size:clamp(34px,10vw,42px)}`],
 ["6","Instrument Serif","Elegant og eksklusiv, som et galleri. Overskriften, med «neste» i kursiv.","Instrument+Serif:ital@0;1",
  `.fb-h1{font-family:"Instrument Serif",serif;font-weight:400;letter-spacing:-.02em;line-height:.95;font-size:clamp(46px,14vw,58px)}.fb-h1 .kursiv{font-style:italic}`],
];
(async()=>{const b=await chromium.launch({proxy:{server:process.env.HTTPS_PROXY,bypass:"localhost,127.0.0.1"}});
 const c=await b.newContext({...devices["iPhone 13"],viewport:{width:390,height:780},deviceScaleFactor:2,locale:"nb-NO",ignoreHTTPSErrors:true}); const p=await c.newPage();
 await p.addInitScript(()=>{ const ekte=window.setInterval; window.setInterval=(f,ms,...a)=>ms===3800?0:ekte(f,ms,...a); });
 await p.goto("http://localhost:3718/",{waitUntil:"networkidle"}); const k=p.getByRole("button",{name:"Bare nødvendige"}).first(); if (await k.count()) await k.click(); await p.waitForTimeout(800);
 await p.evaluate(()=>{ document.querySelector(".kun-mobil").removeAttribute("data-tekst"); for (const s of document.querySelectorAll(".fb-h1 span")) if (s.textContent.trim()==="neste") s.classList.add("kursiv"); });
 const ut=[];
 for (const [nr,navn,om,fam,css] of V) {
  await p.evaluate(([fam,css])=>{ document.getElementById("prove-lenke")?.remove(); document.getElementById("prove-stil")?.remove(); const l=document.createElement("link"); l.id="prove-lenke"; l.rel="stylesheet"; l.href="https://fonts.googleapis.com/css2?family="+fam+"&display=swap"; document.head.append(l); const s=document.createElement("style"); s.id="prove-stil"; s.textContent=css; document.head.append(s); },[fam,css]);
  await p.waitForLoadState("networkidle"); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(900);
  const info=await p.evaluate((navn)=>({lastet:[...document.fonts].some(f=>f.status==="loaded"&&f.family.replace(/"/g,"")===navn), h1:getComputedStyle(document.querySelector(".fb-h1")).fontFamily.split(",")[0], linjer:Math.round(document.querySelector(".fb-h1").getBoundingClientRect().height/parseFloat(getComputedStyle(document.querySelector(".fb-h1")).lineHeight)), rull:document.documentElement.scrollWidth>document.documentElement.clientWidth, kutt:[...document.querySelectorAll(".fs-hoved b,.fb-to a")].filter(e=>e.scrollWidth>e.clientWidth+1).length}),navn);
  console.log(nr,navn.padEnd(20),JSON.stringify(info));
  await p.screenshot({path:`v${nr}.png`,clip:{x:0,y:0,width:390,height:640}}); ut.push([nr,navn,om]); }
 await b.close();
 const kort=([nr,navn,om])=>`<figure><b>${nr} – ${navn}</b><span>${om}</span><img src="v${nr}.png"></figure>`;
 for (const [fil,del] of [["ark1",ut.slice(0,3)],["ark2",ut.slice(3)]]) fs.writeFileSync(fil+".html",`<!doctype html><meta charset="utf-8"><style>@import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@500;700&display=swap');
body{margin:0;padding:32px 34px 36px;background:#f3f4f6;font-family:"Schibsted Grotesk",sans-serif;color:#0b1426;display:flex;gap:28px;width:max-content}
figure{margin:0;width:390px}img{display:block;width:390px;border-radius:24px;box-shadow:0 30px 50px -30px rgb(11 20 38/.5),0 0 0 1px rgb(11 20 38/.08)}
b{display:block;margin:0 0 4px 6px;font-size:19px}span{display:block;margin:0 0 14px 6px;font-size:14.5px;color:#475569;min-height:38px}</style>${del.map(kort).join("")}`);
 const b2=await chromium.launch({proxy:{server:process.env.HTTPS_PROXY}}); const q=await b2.newPage({viewport:{width:1400,height:800},deviceScaleFactor:1.5});
 for (const f of ["ark1","ark2"]) { await q.goto("file://"+process.cwd()+"/"+f+".html",{waitUntil:"networkidle"}); await q.evaluate(()=>document.fonts.ready); await q.screenshot({path:"skrifter-"+f.slice(3)+".png",fullPage:true}); }
 await b2.close();})().catch(e=>{console.log("FEIL",e.message.split("\n").slice(0,3).join(" | "));process.exit(1)});
