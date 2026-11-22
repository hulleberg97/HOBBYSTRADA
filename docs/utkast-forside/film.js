// Tar opp en prototype bilde for bilde: animasjonene styres til nøyaktig tid, og siden rulles etter en fast plan.
const { chromium, devices } = require("playwright"); const path=require("path"); const fs=require("fs");
(async()=>{ const b=await chromium.launch({proxy:{server:process.env.HTTPS_PROXY}});
 for (const v of (process.argv[2]||"A,B,C").split(",")) {
  const c=await b.newContext({...devices["iPhone 13"],viewport:{width:390,height:780},deviceScaleFactor:2,locale:"nb-NO"}); const p=await c.newPage();
  await p.goto("file://"+path.resolve(v+".html"),{waitUntil:"networkidle"}); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(500);
  const dir="f-"+v; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir);
  const FPS=30, SEK=9, N=FPS*SEK, RULL=Number(process.argv[3]||520);
  for (let i=0;i<N;i++){ const t=i/FPS;
    const y = t<4.6 ? 0 : t<7.4 ? RULL*(0.5-0.5*Math.cos(Math.PI*(t-4.6)/2.8)) : RULL;
    await p.evaluate(([t,y])=>{ window.scrollTo(0,y); for (const a of document.getAnimations()) { if (a.timeline!==document.timeline) continue; a.pause(); a.currentTime=t*1000; } },[t,y]);
    await p.screenshot({path:`${dir}/${String(i).padStart(4,"0")}.png`}); }
  await c.close(); console.log("ok",v); }
 await b.close();})().catch(e=>{console.log("FEIL",e.message.split("\n").slice(0,2).join(" | "));process.exit(1)});
