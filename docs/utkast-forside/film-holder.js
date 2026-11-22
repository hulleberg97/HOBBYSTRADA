// Filmer utkastet bilde for bilde: animasjonene settes til nøyaktig tid, og siden rulles etter en fast plan.
const { chromium, devices } = require("playwright"); const fs=require("fs");
const V={ A:{speil:false,gammel:false,rull:430}, B:{speil:true,gammel:false,rull:430}, C:{speil:false,gammel:true,rull:760} };
(async()=>{ const b=await chromium.launch();
 for (const v of (process.argv[2]||"A,B,C").split(",")) { const o=V[v];
  const c=await b.newContext({...devices["iPhone 13"],viewport:{width:390,height:780},deviceScaleFactor:2,locale:"nb-NO"}); const p=await c.newPage();
  await p.goto("http://localhost:3718/",{waitUntil:"networkidle"}); const k=p.getByRole("button",{name:"Bare nødvendige"}).first(); if (await k.count()) await k.click();
  await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(800);
  if (o.speil) await p.evaluate(()=>{document.querySelector(".fb-bue").dataset.speil="true"});
  if (o.gammel) await p.evaluate(()=>{ for (const ss of document.styleSheets) { let rs; try{rs=ss.cssRules}catch{continue} for (const r of rs) { if (!(r instanceof CSSMediaRule) || !/pointer:\s*coarse/.test(r.conditionText)) continue; for (let i=r.cssRules.length-1;i>=0;i--) if (/card-(frame|info|pris|title)/.test(r.cssRules[i].selectorText||"")) r.deleteRule(i); } } });
  // Bildene lenger ned hentes før filmingen
  const H=await p.evaluate(()=>document.documentElement.scrollHeight); for (let y=0;y<Math.min(H,2400);y+=350){ await p.evaluate(y=>window.scrollTo(0,y),y); await p.waitForTimeout(150);} await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(400);
  const dir="f-"+v; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir);
  const FPS=30, SEK=9, N=FPS*SEK;
  for (let i=0;i<N;i++){ const t=i/FPS;
    const y = t<4.4 ? 0 : t<7.6 ? o.rull*(0.5-0.5*Math.cos(Math.PI*(t-4.4)/3.2)) : o.rull;
    await p.evaluate(([t,y])=>{ window.scrollTo(0,y); for (const a of document.getAnimations()) { if (a.timeline!==document.timeline) continue; a.pause(); a.currentTime=t*1000; } },[t,y]);
    await p.screenshot({path:`${dir}/${String(i).padStart(4,"0")}.png`}); }
  await c.close(); console.log("ok",v); }
 await b.close();})().catch(e=>{console.log("FEIL",e.message.split("\n").slice(0,2).join(" | "));process.exit(1)});
