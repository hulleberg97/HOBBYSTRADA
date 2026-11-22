// Filmer utkastet bilde for bilde i full oppløsning. Karusellen styres etter en fast plan som følger den ekte oppførselen:
// neste flis hvert 3,4 sekund, så et sveip, så rulles siden ned.
const { chromium, devices } = require("playwright"); const fs=require("fs");
(async()=>{const b=await chromium.launch(); const L="http://localhost:3718";
 const c=await b.newContext({...devices["iPhone 13"],viewport:{width:390,height:780},deviceScaleFactor:2,locale:"nb-NO"}); const p=await c.newPage();
 await p.addInitScript(()=>{ const ekte=window.setInterval; window.setInterval=(f,ms,...a)=>ms===3400?0:ekte(f,ms,...a); });
 await p.goto(L+"/",{waitUntil:"networkidle"}); const k=p.getByRole("button",{name:"Bare nødvendige"}).first(); if (await k.count()) await k.click();
 await p.evaluate(()=>document.fonts.ready); await p.addStyleTag({content:".fk{scroll-snap-type:none!important}"});
 const H=await p.evaluate(()=>document.documentElement.scrollHeight); for (let y=0;y<Math.min(H,2000);y+=350){ await p.evaluate(y=>window.scrollTo(0,y),y); await p.waitForTimeout(150);} await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(500);
 const steg=await p.$eval(".fk-flis",e=>e.offsetWidth+12);
 const glid=(t,t0,d)=>t<=t0?0:t>=t0+d?1:0.5-0.5*Math.cos(Math.PI*(t-t0)/d);
 fs.rmSync("ff",{recursive:true,force:true}); fs.mkdirSync("ff");
 const FPS=30, SEK=12.5, N=Math.round(FPS*SEK);
 for (let i=0;i<N;i++){ const t=i/FPS;
  const x=steg*(glid(t,3.4,0.55)+glid(t,6.8,0.55)+glid(t,8.5,0.4));
  const y=520*glid(t,9.6,2.2);
  await p.evaluate(([t,x,y])=>{ window.scrollTo(0,y); document.querySelector(".fk").scrollLeft=x; window.__t0=window.__t0||new WeakMap();
   for (const a of document.getAnimations()) { if (a.timeline!==document.timeline) continue; a.pause();
    if (a instanceof CSSTransition) { if(!window.__t0.has(a)) window.__t0.set(a,t); a.currentTime=(t-window.__t0.get(a))*1000; } else a.currentTime=t*1000; } },[t,x,y]);
  await p.waitForTimeout(25);
  await p.evaluate((t)=>{ for (const a of document.getAnimations()) { if (!(a instanceof CSSTransition)) continue; a.pause(); if(!window.__t0.has(a)) window.__t0.set(a,t); a.currentTime=(t-window.__t0.get(a))*1000; } },t);
  await p.screenshot({path:`ff/${String(i).padStart(4,"0")}.png`}); }
 await b.close(); console.log("ok",N);})().catch(e=>{console.log("FEIL",e.message.split("\n").slice(0,3).join(" | "));process.exit(1)});
