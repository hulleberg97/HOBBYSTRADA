// Filmer scenen bilde for bilde i full oppløsning. Klokken i nettleseren styres, så bevegelsen blir helt jevn:
// JavaScript-animasjonene går på den styrte klokken, og CSS-animasjonene settes til nøyaktig tid for hvert bilde.
const { chromium, devices } = require("playwright"); const fs=require("fs");
(async()=>{const b=await chromium.launch(); const L="http://localhost:3718";
 const c0=await b.newContext({...devices["iPhone 13"],locale:"nb-NO"}); const p0=await c0.newPage(); await p0.goto(L+"/",{waitUntil:"networkidle"}); const k=p0.getByRole("button",{name:"Bare nødvendige"}).first(); if (await k.count()) await k.click(); await p0.waitForTimeout(300); const lager=await c0.storageState(); await c0.close();
 const c=await b.newContext({...devices["iPhone 13"],viewport:{width:390,height:780},deviceScaleFactor:2,locale:"nb-NO",storageState:lager}); const p=await c.newPage();
 const T0=new Date("2026-11-22T18:00:00Z"); await p.clock.install({time:T0}); await p.clock.pauseAt(new Date(T0.getTime()+1));
 await p.goto(L+"/",{waitUntil:"networkidle"}); await p.evaluate(()=>document.fonts.ready);
 // Bildene lenger ned hentes før filmingen
 for (let y=0;y<=2600;y+=350){ await p.evaluate(y=>window.scrollTo(0,y),y); await new Promise(r=>setTimeout(r,250)); } await p.evaluate(()=>window.scrollTo(0,0));
 const glid=(t,t0,d)=>t<=t0?0:t>=t0+d?1:0.5-0.5*Math.cos(Math.PI*(t-t0)/d);
 const SEK=Number(process.argv[2]||13), FPS=30, N=Math.round(SEK*FPS), RULL=Number(process.argv[3]||470); const dir=process.argv[4]||"ff";
 fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir);
 await p.evaluate(()=>{ window.__t0=new WeakMap(); window.__start=null; });
 for (let i=0;i<N;i++){ const t=i/FPS;
  await p.clock.runFor(1000/FPS);
  await p.evaluate(([t,y])=>{ window.scrollTo(0,y);
   for (const a of document.getAnimations()) { if (a.timeline!==document.timeline) continue; a.pause(); if(!window.__t0.has(a)) window.__t0.set(a, a instanceof CSSTransition || /fs-inn/.test(a.animationName||"") ? t : 0); a.currentTime=(t-window.__t0.get(a))*1000; } },[t, 330*glid(t,2.2,1.6)+(820-330)*glid(t,4.4,2.2)+(RULL-820)*glid(t,11.0,2.2)]);
  await p.screenshot({path:`${dir}/${String(i).padStart(4,"0")}.png`}); }
 await b.close(); console.log("ok",N);})().catch(e=>{console.log("FEIL",e.message.split("\n").slice(0,3).join(" | "));process.exit(1)});
