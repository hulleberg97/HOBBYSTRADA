import json
K=json.load(open('kort.json',encoding='utf-8'))
def k(navn): return next(x for x in K if navn in x['spiller'])
kr=lambda n: f"{n:,}".replace(","," ")+" kr"
I={'sok':'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>','hjem':'<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>','pluss':'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>','chat':'<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/></svg>','meg':'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.200 18.500a6.500 6.500 0 0 1 11.600 0"/></svg>','hjerte':'<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.600A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/></svg>','meny':'<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>','pil':'<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>','skjold':'<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>'}
CSS='''
@import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0}html{scrollbar-width:none}body{overflow-x:clip;font-family:"Schibsted Grotesk",system-ui,sans-serif;color:#0b1426;background:#fff;-webkit-font-smoothing:antialiased;padding-bottom:84px}
svg{fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
header{position:sticky;top:0;z-index:20;display:flex;align-items:center;height:60px;padding:0 16px;background:rgb(255 255 255/.86);backdrop-filter:blur(14px) saturate(1.5);border-bottom:1px solid rgb(11 20 38/.06)}
header img{height:21px}header span{margin-left:auto;display:flex;gap:16px}header svg{width:22px;height:22px}
nav{position:fixed;left:0;right:0;bottom:0;z-index:30;display:grid;grid-template-columns:repeat(5,1fr);align-items:end;height:64px;padding:0 6px 9px;background:#fff;border-top:1px solid #e9eaee;font-size:11px;font-weight:600;color:#6b7280}
nav span{display:flex;flex-direction:column;align-items:center;gap:3px}nav span.on{color:#0b1426}nav svg{width:22px;height:22px}
nav em{display:flex;align-items:center;justify-content:center;width:48px;height:48px;margin-top:-22px;border-radius:50%;background:#0b1426;color:#fff;box-shadow:0 10px 20px -8px rgb(11 20 38/.6),0 0 0 4px #fff}
.sok{display:flex;align-items:center;gap:10px;height:52px;padding:0 6px 0 16px;border-radius:999px;background:#fff;box-shadow:0 12px 30px -14px rgb(11 20 38/.35),0 0 0 1px rgb(11 20 38/.08);color:#6b7280;font-size:15px}
.sok>svg{width:19px;height:19px;flex:none;color:#0b1426}.sok span{flex:1}.sok b{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:#0b1426;color:#fff}.sok b svg{width:17px;height:17px}
.chips{display:flex;gap:8px;padding:0 16px;overflow:hidden}.chips span{flex:none;height:38px;padding:0 15px;display:flex;align-items:center;border-radius:999px;font-size:14px;font-weight:600;box-shadow:inset 0 0 0 1px #e5e7eb;white-space:nowrap}.chips span.on{background:#0b1426;color:#fff;box-shadow:none}
h2{font-size:21px;font-weight:700;letter-spacing:-.03em;padding:0 16px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:26px 12px;padding:14px 16px 0}
.a .b{position:relative;aspect-ratio:5/6.2;border-radius:14px;background:#f4f4f5;display:flex;align-items:center;justify-content:center;overflow:hidden}
.a .b img{width:72%;aspect-ratio:5/7;object-fit:cover;border-radius:6px;box-shadow:0 16px 22px -14px rgb(11 20 38/.55)}
.a .b i{position:absolute;right:9px;top:9px;width:30px;height:30px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center}.a .b i svg{width:16px;height:16px}
.eks{position:absolute;left:0;top:0;height:20px;padding:0 7px 1px;display:flex;align-items:center;border-radius:14px 0 9px 0;background:#0b1426;box-shadow:inset 0 -1.5px 0 #cfa653;color:#f7f3ea;font-size:11px;font-weight:600}
.a strong{display:block;margin-top:9px;font-size:17px;font-weight:700;letter-spacing:-.02em}.a p{font-size:13.5px;line-height:1.35;color:#475569;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.a small{display:block;margin-top:3px;font-size:12px;color:#6b7280}
/* Annonsene glir inn når de rulles frem */
@supports (animation-timeline:view()){.a{animation:inn linear both;animation-timeline:view();animation-range:entry 0% entry 70%}}
@keyframes inn{from{opacity:0;transform:translateY(28px) scale(.96)}to{opacity:1;transform:none}}
.ord span{display:inline-block;animation:ord .75s cubic-bezier(.2,.7,.2,1) both}
@keyframes ord{from{opacity:0;transform:translateY(20px);filter:blur(9px)}to{opacity:1;transform:none;filter:none}}
.opp{animation:opp .7s cubic-bezier(.2,.7,.2,1) both}@keyframes opp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.holo{position:relative;overflow:hidden}.holo::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,rgb(255 120 200/.2) 40%,rgb(120 210 255/.24) 47%,rgb(255 255 255/.3) 50%,rgb(150 255 190/.22) 53%,rgb(255 235 150/.2) 60%,transparent 70%);background-size:260% 260%;mix-blend-mode:screen;animation:glans 3.4s ease-in-out infinite alternate;pointer-events:none}
@keyframes glans{from{background-position:100% 0}to{background-position:0 100%}}
'''
def ord_(tekst, start=0.05):
    ut=[]; i=0
    for linje in tekst.split('|'):
        for w in linje.split(' '):
            ut.append(f'<span style="animation-delay:{start+i*0.09:.2f}s">{w}</span>'); i+=1
        ut.append('<br>')
    return ' '.join(ut[:-1])
def grid():
    h=''
    for x in K[:6]:
        h+=f'<div class="a"><div class="b">{"<span class=eks>Eksempelannonse</span>" if x["eks"] else ""}<img src="{x["img"]}"><i>{I["hjerte"]}</i></div><strong>{kr(x["pris"])}</strong><p>{x["tittel"]}</p><small>{x["sted"]}</small></div>'
    return h
def skall(navn, css, topp):
    return f'''<!doctype html><html lang="nb"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>{CSS}{css}</style></head><body>
<header><img src="file:///home/user/hobbystrada/public/brand/logo.svg"><span>{I["hjerte"]}{I["meny"]}</span></header>
{topp}
<div class="chips" style="margin-top:26px"><span class="on">Alle</span><span>Autograf</span><span>Patch</span><span>Rookie</span><span>Nummerert</span></div>
<div class="grid">{grid()}</div>
<nav><span class="on">{I["hjem"]}Hjem</span><span>{I["sok"]}Søk</span><span><em>{I["pluss"]}</em>Selg</span><span>{I["chat"]}Meldinger</span><span>{I["meg"]}Min side</span></nav></body></html>'''
SOK=f'<div class="sok">{I["sok"]}<span>Søk spiller, sett eller kortnummer</span><b>{I["pil"]}</b></div>'

# ───── A: Kortstokken ─────
cssA='''
.t{padding:22px 16px 0;text-align:center}
.pille{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 13px;border-radius:999px;background:#f5f1e8;font-size:12.5px;font-weight:600;color:#6b5522}.pille i{width:7px;height:7px;border-radius:50%;background:#cfa653;animation:puls 2.2s ease-out infinite}
@keyframes puls{0%{box-shadow:0 0 0 0 rgb(207 166 83/.6)}80%,100%{box-shadow:0 0 0 8px rgb(207 166 83/0)}}
h1{margin-top:12px;font-size:42px;font-weight:800;letter-spacing:-.045em;line-height:.98}
.stokk{position:relative;height:330px;margin-top:18px;perspective:1000px;overflow-x:clip;overflow-y:visible}
.stokk::before{content:"";position:absolute;left:50%;top:50%;width:320px;height:320px;transform:translate(-50%,-50%);border-radius:50%;background:conic-gradient(from 0deg,#fde8c4,#d7e6ff,#f6d9ee,#d9f3e6,#fde8c4);filter:blur(46px);opacity:.75;animation:snurr 14s linear infinite}
@keyframes snurr{to{transform:translate(-50%,-50%) rotate(360deg)}}
.stokk div{position:absolute;left:50%;top:14px;width:206px;height:288px;margin-left:-103px;border-radius:12px;animation:kort 9s cubic-bezier(.6,0,.2,1) infinite;box-shadow:0 30px 44px -22px rgb(11 20 38/.55),0 0 0 1px rgb(255 255 255/.9)}
.stokk img{width:100%;height:100%;object-fit:cover;border-radius:12px;display:block}
@keyframes kort{0%,25%{transform:translate(0,0) rotate(0) scale(1);z-index:3}30%{transform:translate(-170px,-14px) rotate(-16deg) scale(1);z-index:3}33%{transform:translate(-170px,-14px) rotate(-16deg) scale(.9);z-index:1}39%,58%{transform:translate(-38px,12px) rotate(-8deg) scale(.9);z-index:1}66%,91%{transform:translate(38px,12px) rotate(8deg) scale(.9);z-index:2}100%{transform:translate(0,0) rotate(0) scale(1);z-index:3}}
.under{padding:6px 16px 0}
.to{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.to span{height:46px;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:999px;font-size:14.5px;font-weight:600;box-shadow:inset 0 0 0 1px #d6d9df}.to span:first-child{background:#0b1426;color:#fff;box-shadow:none}.to svg{width:17px;height:17px}
'''
stokk=''.join(f'<div class="holo" style="animation-delay:-{i*3}s"><img src="{k(n)["img"]}"></div>' for i,n in enumerate(['Haaland','Ronaldinho','Zidane']))
toppA=f'''<div class="t"><span class="pille opp"><i></i>Norsk markedsplass for fotballkort</span><h1 class="ord">{ord_("Finn ditt|neste kort",0.15)}</h1></div>
<div class="stokk opp" style="animation-delay:.45s">{stokk}</div>
<div class="under opp" style="animation-delay:.7s">{SOK}<div class="to"><span>Se alle annonser {I["pil"]}</span><span>{I["pluss"]} Legg ut kort</span></div></div>'''
open('A.html','w',encoding='utf-8').write(skall('A',cssA,toppA))

# ───── B: Flisene ─────
cssB='''
.t{padding:20px 16px 0}h1{font-size:34px;font-weight:800;letter-spacing:-.045em;line-height:1}.t p{margin-top:6px;font-size:15px;color:#5b6472}
.fl{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:16px 16px 0}
.fl>div{position:relative;overflow:hidden;border-radius:22px;animation:flis .7s cubic-bezier(.2,.8,.2,1) both}
@keyframes flis{from{opacity:0;transform:scale(.92) translateY(18px)}to{opacity:1;transform:none}}
.f1{grid-column:span 2;height:216px;padding:18px;background:linear-gradient(135deg,#eef3fb,#f7efe2)}
.f1 small{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#8a6a24}.f1 b{display:block;margin-top:6px;width:170px;font-size:23px;font-weight:700;letter-spacing:-.03em;line-height:1.08}
.f1 em{position:absolute;left:18px;bottom:18px;display:flex;align-items:center;gap:7px;height:38px;padding:0 15px;border-radius:999px;background:#0b1426;color:#fff;font-style:normal;font-size:13.5px;font-weight:600}.f1 em svg{width:15px;height:15px}
.f1 div{position:absolute;right:26px;top:22px;width:124px;height:174px;border-radius:9px;box-shadow:0 26px 34px -18px rgb(11 20 38/.6),0 0 0 1px #fff;animation:svev 5s ease-in-out infinite alternate}.f1 div+div{right:86px;top:40px;width:104px;height:146px;z-index:-1;animation-delay:-2.5s;opacity:.96}
.f1 img{width:100%;height:100%;object-fit:cover;border-radius:9px;display:block}
@keyframes svev{from{transform:rotate(7deg) translateY(-5px)}to{transform:rotate(4deg) translateY(6px)}}.f1 div+div{animation-name:svev2}@keyframes svev2{from{transform:rotate(-9deg) translateY(4px)}to{transform:rotate(-6deg) translateY(-5px)}}
.f2{height:150px;padding:16px;background:#0b1426;color:#fff}.f2 b{display:block;font-size:19px;font-weight:700;letter-spacing:-.02em;line-height:1.1}.f2 p{margin-top:4px;font-size:12.5px;line-height:1.3;color:rgb(255 255 255/.7)}
.f2 i{position:absolute;right:14px;bottom:14px;width:44px;height:44px;border-radius:50%;background:#cfa653;color:#0b1426;display:flex;align-items:center;justify-content:center;animation:ring 2.4s ease-out infinite}.f2 i svg{width:20px;height:20px;stroke-width:2.2}
@keyframes ring{0%{box-shadow:0 0 0 0 rgb(207 166 83/.55)}80%,100%{box-shadow:0 0 0 16px rgb(207 166 83/0)}}
.f3{height:150px;padding:16px;background:#f4f4f5}.f3 b{display:block;font-size:19px;font-weight:700;letter-spacing:-.02em}.f3 p{font-size:12.5px;color:#6b7280}
.f3 u{position:absolute;right:12px;top:0;bottom:0;width:62px;overflow:hidden;text-decoration:none;-webkit-mask-image:linear-gradient(transparent,#000 22%,#000 78%,transparent);mask-image:linear-gradient(transparent,#000 22%,#000 78%,transparent)}
.f3 u s{display:flex;flex-direction:column;gap:8px;animation:ned 12s linear infinite}.f3 img{width:62px;height:87px;object-fit:cover;border-radius:6px;display:block}@keyframes ned{to{transform:translateY(-50%)}}
.f4{grid-column:span 2;height:52px;background:#f5f1e8;display:flex;align-items:center}
.f4 s{display:flex;gap:26px;padding-left:26px;white-space:nowrap;text-decoration:none;font-size:13.5px;font-weight:600;color:#5b4a1e;animation:band 16s linear infinite}.f4 s span{display:flex;align-items:center;gap:8px}.f4 svg{width:16px;height:16px;color:#b8903f}@keyframes band{to{transform:translateX(-50%)}}
'''
mini=''.join(f'<img src="{x["img"]}">' for x in [K[0],K[1],k("Scholes"),k("Mukasa")])
band=''.join(f'<span>{I["skjold"]}{t}</span>' for t in ['Logg inn med Vipps','Avtal direkte i chatten','Frakt med sporing','Gratis å legge ut'])
toppB=f'''<div class="t"><h1 class="ord">{ord_("Finn ditt neste kort",0.05)}</h1><p class="opp" style="animation-delay:.3s">Markedsplass for kjøp og salg av fotballkort.</p><div class="opp" style="animation-delay:.4s;margin-top:14px">{SOK}</div></div>
<div class="fl">
<div class="f1" style="animation-delay:.5s"><small>Markedet</small><b>Autografer, patch og rookies</b><em>Se alle annonser {I["pil"]}</em><div class="holo"><img src="{k("Haaland")["img"]}"></div><div><img src="{k("Ronaldo")["img"]}"></div></div>
<div class="f2" style="animation-delay:.62s"><b>Selg kortene dine</b><p>Gratis å legge ut</p><i>{I["pluss"]}</i></div>
<div class="f3" style="animation-delay:.74s"><b>Nyeste</b><p>Sist lagt ut</p><u><s>{mini}{mini}</s></u></div>
<div class="f4" style="animation-delay:.86s"><s>{band}{band}</s></div>
</div>'''
open('B.html','w',encoding='utf-8').write(skall('B',cssB,toppB))

# ───── C: Glasset ─────
cssC='''
.scene{position:relative;height:500px;overflow:hidden;background:linear-gradient(180deg,#f3f5f9,#fff)}
.rader{position:absolute;left:-30%;right:-30%;top:-34px;transform:rotate(-8deg);display:flex;flex-direction:column;gap:12px}
.rader div{display:flex;gap:12px;width:max-content;animation:drift 46s linear infinite}.rader div:nth-child(2){animation-direction:reverse;animation-duration:58s}.rader div:nth-child(3){animation-duration:52s}
.rader img{width:112px;height:157px;object-fit:cover;border-radius:9px;box-shadow:0 14px 22px -14px rgb(11 20 38/.5)}@keyframes drift{to{transform:translateX(-50%)}}
.scene::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgb(255 255 255/.2) 0%,rgb(255 255 255/0) 30%,rgb(255 255 255/0) 68%,#fff 100%)}
.glass{position:absolute;left:16px;right:16px;top:104px;z-index:2;padding:22px 18px 18px;border-radius:26px;background:rgb(255 255 255/.66);-webkit-backdrop-filter:blur(18px) saturate(1.6);backdrop-filter:blur(18px) saturate(1.6);box-shadow:0 30px 60px -26px rgb(11 20 38/.45),inset 0 0 0 1px rgb(255 255 255/.85);text-align:center;animation:glassinn .9s cubic-bezier(.2,.8,.2,1) .15s both}
@keyframes glassinn{from{opacity:0;transform:translateY(26px) scale(.96)}to{opacity:1;transform:none}}
.glass .sok span{font-size:14.5px;text-align:left;white-space:nowrap}.glass h1{font-size:36px;font-weight:800;letter-spacing:-.045em;line-height:1}.glass p{margin:8px 0 16px;font-size:14.5px;color:#3f4856}
.to{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.to span{height:44px;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:999px;font-size:14px;font-weight:600;background:rgb(255 255 255/.7);box-shadow:inset 0 0 0 1px rgb(11 20 38/.14)}.to span:first-child{background:#0b1426;color:#fff;box-shadow:none}.to svg{width:16px;height:16px}
'''
def rad(start): 
    r=''.join(f'<img src="{K[(start+i)%len(K)]["img"]}">' for i in range(8)); return f'<div>{r}{r}</div>'
toppC=f'''<div class="scene"><div class="rader">{rad(2)}{rad(6)}{rad(10)}</div>
<div class="glass"><h1 class="ord">{ord_("Finn ditt|neste kort",0.4)}</h1><p>Markedsplass for kjøp og salg av fotballkort.</p>{SOK.replace("Søk spiller, sett eller kortnummer","Søk spiller, sett eller nummer")}<div class="to"><span>Se alle annonser {I["pil"]}</span><span>{I["pluss"]} Legg ut kort</span></div></div></div>'''
open('C.html','w',encoding='utf-8').write(skall('C',cssC,toppC).replace('<div class="chips" style="margin-top:26px">','<div class="chips" style="margin-top:6px">'))

EKS='<span class="eks">Eksempelannonse</span>'
TO=f'<div class="to"><span>Se alle annonser {I["pil"]}</span><span>{I["pluss"]} Legg ut kort</span></div>'
PILLE='<span class="pille opp"><i></i>Norsk markedsplass for fotballkort</span>'
fellesA=cssA.split(".stokk{")[0]+".under{padding:6px 16px 0}"+cssA.split(".under{padding:6px 16px 0}")[1]

# ───── A2: Viften ─────
cssA2=fellesA+"""
.vifte{position:relative;height:296px;margin-top:8px;overflow-x:clip;animation:vugg 5s ease-in-out infinite alternate;transform-origin:50% 150%}
@keyframes vugg{from{transform:rotate(-1.6deg)}to{transform:rotate(1.6deg)}}
.vifte::before{content:"";position:absolute;left:50%;top:44%;width:330px;height:250px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,#fdeccd,#dfeaff 60%,transparent);filter:blur(26px);opacity:.9}
.vifte div{position:absolute;left:50%;top:44px;width:150px;height:210px;margin-left:-75px;border-radius:10px;transform-origin:50% 150%;box-shadow:0 22px 30px -18px rgb(11 20 38/.6),0 0 0 1px rgb(255 255 255/.9);animation:vift 1.1s cubic-bezier(.2,.9,.25,1) both}
.vifte img{width:100%;height:100%;object-fit:cover;border-radius:10px;display:block}
@keyframes vift{from{transform:rotate(0) translateY(26px);opacity:0}30%{opacity:1}to{transform:rotate(var(--a)) translateY(var(--y));opacity:1}}
.t2{padding:6px 16px 0;text-align:center}.t2 h1{margin-top:10px}
"""
navn=['Scholes','Ronaldinho','Haaland','Zidane','Ronaldo']
vifte=''.join(f'<div class="{"holo" if i==2 else ""}" style="--a:{(i-2)*15}deg;--y:{abs(i-2)*-4}px;z-index:{5-abs(i-2)};animation-delay:{.25+abs(i-2)*.08:.2f}s"><img src="{k(n)["img"]}"></div>' for i,n in enumerate(navn))
toppA2=f"""<div class="vifte">{vifte}</div>
<div class="t2">{PILLE}<h1 class="ord">{ord_("Finn ditt|neste kort",0.7)}</h1></div>
<div class="under opp" style="animation-delay:1.1s;padding-top:16px">{SOK}{TO}</div>"""
open('A2.html','w',encoding='utf-8').write(skall('A2',cssA2,toppA2))

# ───── A3: Ett kort som dreier ─────
cssA3=fellesA+"""
.t{text-align:left;padding-top:20px}h1{font-size:44px}
.ett{position:relative;height:330px;margin-top:6px;perspective:900px}
.ett::before{content:"";position:absolute;left:50%;top:46%;width:300px;height:300px;transform:translate(-50%,-50%);border-radius:50%;background:conic-gradient(from 40deg,#fde8c4,#d7e6ff,#f6d9ee,#d9f3e6,#fde8c4);filter:blur(44px);opacity:.8;animation:snurr 16s linear infinite}
@keyframes snurr{to{transform:translate(-50%,-50%) rotate(360deg)}}
.ett::after{content:"";position:absolute;left:50%;bottom:6px;width:170px;height:22px;margin-left:-85px;border-radius:50%;background:rgb(11 20 38/.28);filter:blur(12px);animation:skygge 5s ease-in-out infinite alternate}
@keyframes skygge{from{transform:scaleX(.82)}50%{transform:scaleX(1.05)}to{transform:scaleX(.82)}}
.ett .k{position:absolute;left:50%;top:10px;width:204px;height:286px;margin-left:-102px;border-radius:12px;transform-style:preserve-3d;animation:drei 5s ease-in-out infinite alternate;box-shadow:0 0 0 1px rgb(255 255 255/.9)}
@keyframes drei{from{transform:rotateY(-24deg) rotateX(5deg)}to{transform:rotateY(24deg) rotateX(-3deg)}}
.ett .k img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:12px;animation:bytt 9s linear infinite}
@keyframes bytt{0%{opacity:0}5%,33%{opacity:1}38%,100%{opacity:0}}
.ett .eks{border-radius:12px 0 9px 0;z-index:3}
.navn{position:relative;height:44px;margin-top:2px;text-align:center}.navn p{position:absolute;inset:0;animation:bytt 9s linear infinite}.navn b{display:block;font-size:17px;font-weight:700;letter-spacing:-.02em}.navn small{font-size:12.5px;color:#6b7280}
"""
tre=[k('Haaland'),k('Ronaldinho'),k('Zidane')]
bilder=''.join(f'<img src="{x["img"]}" style="animation-delay:{i*3-9}s">' for i,x in enumerate(tre))
navner=''.join(f'<p style="animation-delay:{i*3-9}s"><b>{x["spiller"]}</b><small>{x["tittel"].split(" – ")[1]}</small></p>' for i,x in enumerate(tre))
toppA3=f"""<div class="t">{PILLE}<h1 class="ord">{ord_("Finn ditt|neste kort",0.15)}</h1></div>
<div class="ett opp" style="animation-delay:.45s"><div class="k holo">{bilder}{EKS}</div></div>
<div class="navn opp" style="animation-delay:.6s">{navner}</div>
<div class="under opp" style="animation-delay:.75s;padding-top:10px">{SOK}{TO}</div>"""
open('A3.html','w',encoding='utf-8').write(skall('A3',cssA3,toppA3))

# ───── A4: Karusellen ─────
cssA4=fellesA+"""
.kar{position:relative;height:306px;margin-top:16px;overflow-x:clip}
.kar::before{content:"";position:absolute;left:50%;top:46%;width:300px;height:260px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,#e4edff,#fdeed6 62%,transparent);filter:blur(30px)}
.kar div{position:absolute;left:50%;top:8px;width:196px;height:274px;margin-left:-98px;border-radius:12px;animation:kar 12.5s cubic-bezier(.65,0,.25,1) infinite;box-shadow:0 28px 38px -22px rgb(11 20 38/.6),0 0 0 1px rgb(255 255 255/.9)}
.kar img{width:100%;height:100%;object-fit:cover;border-radius:12px;display:block}
@keyframes kar{0%,14%{transform:translateX(0) scale(1);opacity:1;z-index:5;filter:none}20%,34%{transform:translateX(-158px) scale(.78);opacity:1;z-index:4;filter:brightness(.92) blur(.6px)}40%,56%{transform:translateX(-280px) scale(.6);opacity:0;z-index:3}57%,74%{transform:translateX(280px) scale(.6);opacity:0;z-index:3}80%,94%{transform:translateX(158px) scale(.78);opacity:1;z-index:4;filter:brightness(.92) blur(.6px)}100%{transform:translateX(0) scale(1);opacity:1;z-index:5;filter:none}}
.prik{display:flex;justify-content:center;gap:6px;margin-top:2px}.prik i{width:6px;height:6px;border-radius:99px;background:rgb(11 20 38/.18);animation:prik 12.5s linear infinite}
@keyframes prik{0%,18%{width:22px;background:#0b1426}20%,100%{width:6px;background:rgb(11 20 38/.18)}}
"""
kar=''.join(f'<div class="holo" style="animation-delay:-{i*2.5}s"><img src="{k(n)["img"]}"></div>' for i,n in enumerate(['Haaland','Zidane','Ronaldo','Scholes','Ronaldinho']))
prik=''.join(f'<i style="animation-delay:{i*2.5-12.5}s"></i>' for i in range(5))
toppA4=f"""<div class="t">{PILLE}<h1 class="ord">{ord_("Finn ditt|neste kort",0.15)}</h1></div>
<div class="kar opp" style="animation-delay:.45s">{kar}</div><div class="prik opp" style="animation-delay:.6s">{prik}</div>
<div class="under opp" style="animation-delay:.7s;padding-top:14px">{SOK}{TO}</div>"""
open('A4.html','w',encoding='utf-8').write(skall('A4',cssA4,toppA4))

# ───── C2: Glassark nederst ─────
GL="background:rgb(255 255 255/.7);-webkit-backdrop-filter:blur(20px) saturate(1.6);backdrop-filter:blur(20px) saturate(1.6);box-shadow:0 -18px 50px -24px rgb(11 20 38/.4),inset 0 0 0 1px rgb(255 255 255/.9)"
TOG=".to{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.to span{height:44px;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:999px;font-size:14px;font-weight:600;background:rgb(255 255 255/.75);box-shadow:inset 0 0 0 1px rgb(11 20 38/.14)}.to span:first-child{background:#0b1426;color:#fff;box-shadow:none}.to svg{width:16px;height:16px}"
def rekke(start,n=7,stil=''):
    r=''.join(f'<img src="{K[(start+i)%len(K)]["img"]}">' for i in range(n)); return f'<div style="{stil}">{r}{r}</div>'
cssC2=f"""
.scene{{position:relative;height:566px;overflow:hidden;background:linear-gradient(180deg,#f1f4f9,#fff)}}
.rr{{position:absolute;left:0;right:0;top:14px;display:flex;flex-direction:column;gap:12px}}
.rr div{{display:flex;gap:12px;width:max-content;animation:drift 50s linear infinite}}.rr div+div{{animation-direction:reverse;animation-duration:62s}}
.rr img{{width:132px;height:185px;object-fit:cover;border-radius:10px;box-shadow:0 16px 24px -16px rgb(11 20 38/.55)}}@keyframes drift{{to{{transform:translateX(-50%)}}}}
.ark{{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:22px 16px 20px;border-radius:30px 30px 0 0;{GL};animation:arkinn 1s cubic-bezier(.2,.8,.2,1) .2s both}}
.ark::before{{content:"";display:block;width:40px;height:4px;margin:-8px auto 14px;border-radius:9px;background:rgb(11 20 38/.16)}}
@keyframes arkinn{{from{{transform:translateY(60%);opacity:0}}to{{transform:none;opacity:1}}}}
.ark h1{{font-size:36px;font-weight:800;letter-spacing:-.045em;line-height:1}}.ark p{{margin:7px 0 14px;font-size:14.5px;color:#3f4856}}{TOG}
"""
toppC2=f"""<div class="scene"><div class="rr">{rekke(2)}{rekke(7)}</div>
<div class="ark"><h1 class="ord">{ord_("Finn ditt neste kort",0.55)}</h1><p>Markedsplass for kjøp og salg av fotballkort.</p>{SOK}{TO}</div></div>"""
open('C2.html','w',encoding='utf-8').write(skall('C2',cssC2,toppC2).replace('<div class="chips" style="margin-top:26px">','<div class="chips" style="margin-top:18px">'))

# ───── C3: Søylene med glass-søk ─────
cssC3=f"""
.t{{padding:20px 16px 0}}h1{{font-size:38px;font-weight:800;letter-spacing:-.045em;line-height:1}}.t p{{margin-top:6px;font-size:15px;color:#5b6472}}
.band{{position:relative;height:330px;margin-top:16px;overflow:hidden;-webkit-mask-image:linear-gradient(transparent,#000 14%,#000 86%,transparent);mask-image:linear-gradient(transparent,#000 14%,#000 86%,transparent)}}
.sl{{position:absolute;left:10px;right:10px;top:0;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}}
.sl div{{display:flex;flex-direction:column;gap:10px;animation:opp2 38s linear infinite}}.sl div:nth-child(2){{animation-direction:reverse;animation-duration:46s}}.sl div:nth-child(3){{animation-duration:42s}}
.sl img{{width:100%;aspect-ratio:5/7;object-fit:cover;border-radius:9px}}@keyframes opp2{{to{{transform:translateY(-50%)}}}}
.gs{{position:absolute;left:22px;right:22px;top:50%;z-index:2;margin-top:-34px;padding:8px;border-radius:999px;background:rgb(255 255 255/.5);-webkit-backdrop-filter:blur(16px) saturate(1.6);backdrop-filter:blur(16px) saturate(1.6);box-shadow:0 26px 50px -20px rgb(11 20 38/.55),inset 0 0 0 1px rgb(255 255 255/.85);animation:glassinn .9s cubic-bezier(.2,.8,.2,1) .5s both}}
@keyframes glassinn{{from{{opacity:0;transform:translateY(22px) scale(.95)}}to{{opacity:1;transform:none}}}}
.gs .sok span{{font-size:14.5px;white-space:nowrap}}
.under{{padding:4px 16px 0}}{TOG.replace("rgb(255 255 255/.75)","#fff")}
"""
def soyle(start):
    r=''.join(f'<img src="{K[(start+i)%len(K)]["img"]}">' for i in range(5)); return f'<div>{r}{r}</div>'
toppC3=f"""<div class="t"><h1 class="ord">{ord_("Finn ditt|neste kort",0.05)}</h1><p class="opp" style="animation-delay:.3s">Markedsplass for kjøp og salg av fotballkort.</p></div>
<div class="band opp" style="animation-delay:.35s"><div class="sl">{soyle(2)}{soyle(6)}{soyle(10)}</div><div class="gs">{SOK.replace("Søk spiller, sett eller kortnummer","Søk spiller, sett eller nummer")}</div></div>
<div class="under opp" style="animation-delay:.6s">{TO}</div>"""
open('C3.html','w',encoding='utf-8').write(skall('C3',cssC3,toppC3))

# ───── C4: Dis – uskarp fargebakgrunn og ett skarpt kort ─────
cssC4=f"""
.scene{{position:relative;height:540px;overflow:hidden;background:#f6f7fa}}
.rader{{position:absolute;left:-30%;right:-30%;top:-40px;transform:rotate(-8deg);display:flex;flex-direction:column;gap:12px;filter:blur(22px) saturate(1.5);opacity:.75}}
.rader div{{display:flex;gap:12px;width:max-content;animation:drift 40s linear infinite}}.rader div:nth-child(2){{animation-direction:reverse;animation-duration:50s}}.rader div:nth-child(3){{animation-duration:45s}}
.rader img{{width:130px;height:182px;object-fit:cover;border-radius:9px}}@keyframes drift{{to{{transform:translateX(-50%)}}}}
.scene::after{{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgb(255 255 255/.35),rgb(255 255 255/.1) 40%,#fff 100%)}}
.frem{{position:absolute;right:26px;top:26px;z-index:3;width:138px;height:193px;border-radius:10px;box-shadow:0 30px 40px -20px rgb(11 20 38/.6),0 0 0 1px #fff;animation:svev 5s ease-in-out infinite alternate}}
.frem img{{width:100%;height:100%;object-fit:cover;border-radius:10px;display:block}}@keyframes svev{{from{{transform:rotate(9deg) translateY(-6px)}}to{{transform:rotate(6deg) translateY(7px)}}}}
.glass{{position:absolute;left:16px;right:16px;top:168px;z-index:2;padding:24px 18px 18px;border-radius:28px;background:rgb(255 255 255/.72);-webkit-backdrop-filter:blur(22px) saturate(1.5);backdrop-filter:blur(22px) saturate(1.5);box-shadow:0 30px 60px -28px rgb(11 20 38/.4),inset 0 0 0 1px rgb(255 255 255/.9);animation:glassinn .9s cubic-bezier(.2,.8,.2,1) .15s both}}
@keyframes glassinn{{from{{opacity:0;transform:translateY(26px) scale(.96)}}to{{opacity:1;transform:none}}}}
.glass small{{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#8a6a24}}
.glass h1{{margin-top:8px;font-size:40px;font-weight:800;letter-spacing:-.045em;line-height:.98}}.glass p{{margin:8px 0 16px;font-size:14.5px;color:#3f4856}}.glass .sok span{{font-size:14.5px;white-space:nowrap}}{TOG}
"""
toppC4=f"""<div class="scene"><div class="rader">{rad(2)}{rad(6)}{rad(10)}</div>
<div class="frem holo opp" style="animation-delay:.5s"><img src="{k("Haaland")["img"]}"></div>
<div class="glass"><small>Norsk markedsplass</small><h1 class="ord">{ord_("Finn ditt|neste kort",0.4)}</h1><p>Kjøp og selg fotballkort direkte med andre samlere.</p>{SOK.replace("Søk spiller, sett eller kortnummer","Søk spiller, sett eller nummer")}{TO}</div></div>"""
open('C4.html','w',encoding='utf-8').write(skall('C4',cssC4,toppC4).replace('<div class="chips" style="margin-top:26px">','<div class="chips" style="margin-top:8px">'))
print('ok')

# ═════ Runde 3: flere varianter av A4 (karusellen) ═════
def steg(navn, pos, hold=.6):
    N=len(pos); s='@keyframes '+navn+'{'
    for i,p in enumerate(pos): s+=f'{i/N*100:.3f}%,{(i+hold)/N*100:.3f}%{{{p}}}'
    return s+f'100%{{{pos[0]}}}}}'
def blink(navn, N, pa, av, hold=.6, kant=.14):
    # På i første felt, av i resten. Ut og inn overlapper ikke.
    return f'@keyframes {navn}{{0%,{hold/N*100:.3f}%{{{pa}}}{(hold+kant)/N*100:.3f}%,{(N-kant)/N*100:.3f}%{{{av}}}100%{{{pa}}}}}'
S=2.4
def forsink(j,N): return f'{j*S-N*S:.2f}s'
sett=lambda x: x["tittel"].split(" – ")[1]

# ───── A4a: Dybden (kortene står vinklet innover, med speiling) ─────
n7=['Haaland','Zidane','Ronaldo','Scholes','Ronaldinho','Yamal','Lewandowski']
posA=['transform:translateX(0) translateZ(0) rotateY(0);opacity:1;z-index:7;filter:brightness(1)',
 'transform:translateX(-122px) translateZ(-150px) rotateY(50deg);opacity:1;z-index:6;filter:brightness(.94)',
 'transform:translateX(-196px) translateZ(-270px) rotateY(60deg);opacity:1;z-index:5;filter:brightness(.88)',
 'transform:translateX(-260px) translateZ(-380px) rotateY(64deg);opacity:0;z-index:4;filter:brightness(.88)',
 'transform:translateX(260px) translateZ(-380px) rotateY(-64deg);opacity:0;z-index:4;filter:brightness(.88)',
 'transform:translateX(196px) translateZ(-270px) rotateY(-60deg);opacity:1;z-index:5;filter:brightness(.88)',
 'transform:translateX(122px) translateZ(-150px) rotateY(-50deg);opacity:1;z-index:6;filter:brightness(.94)']
cssA4a=fellesA+f"""
.kar{{position:relative;height:334px;margin-top:14px;overflow-x:clip;perspective:1000px;perspective-origin:50% 42%}}
.kar::before{{content:"";position:absolute;left:50%;top:40%;width:330px;height:240px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,#e4edff,#fdeed6 62%,transparent);filter:blur(30px)}}
.kar div{{position:absolute;left:50%;top:6px;width:184px;height:258px;margin-left:-92px;border-radius:11px;animation:dyp {7*S}s cubic-bezier(.65,0,.25,1) infinite;box-shadow:0 0 0 1px rgb(255 255 255/.9);-webkit-box-reflect:below 6px linear-gradient(transparent 78%,rgb(255 255 255/.26))}}
.kar img{{width:100%;height:100%;object-fit:cover;border-radius:11px;display:block}}
{steg('dyp',posA)}
.prik{{display:flex;justify-content:center;gap:6px;margin-top:6px}}.prik i{{width:6px;height:6px;border-radius:99px;animation:prik7 {7*S}s linear infinite}}
{blink('prik7',7,'width:22px;background:#0b1426','width:6px;background:rgb(11 20 38/.18)')}
"""
karA=''.join(f'<div class="holo" style="animation-delay:{forsink(j,7)}"><img src="{k(n)["img"]}"></div>' for j,n in enumerate(n7))
prikA=''.join(f'<i style="animation-delay:{forsink(j,7)}"></i>' for j in range(7))
toppA4a=f"""<div class="t">{PILLE}<h1 class="ord">{ord_("Finn ditt|neste kort",0.15)}</h1></div>
<div class="kar opp" style="animation-delay:.45s">{karA}</div><div class="prik opp" style="animation-delay:.6s">{prikA}</div>
<div class="under opp" style="animation-delay:.7s;padding-top:14px">{SOK}{TO}</div>"""
open('A4a.html','w',encoding='utf-8').write(skall('A4a',cssA4a,toppA4a))

# ───── A4b: Buen (kortene glir jevnt langs en bue, uten stopp) ─────
cssA4b=fellesA+"""
.bue{position:relative;height:292px;margin-top:10px;overflow:clip}
.bue::before{content:"";position:absolute;left:50%;top:44%;width:340px;height:240px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,#fdeed6,#e4edff 62%,transparent);filter:blur(30px)}
.bue div{position:absolute;left:50%;top:30px;width:150px;height:210px;margin-left:-75px;transform-origin:50% 1505px;animation:bue 21s linear infinite}
.bue img{width:100%;height:100%;object-fit:cover;border-radius:10px;display:block;box-shadow:0 24px 30px -20px rgb(11 20 38/.6),0 0 0 1px rgb(255 255 255/.9);animation:buestr 21s ease-in-out infinite;animation-delay:inherit}
@keyframes bue{from{transform:rotate(25.9deg)}to{transform:rotate(-25.9deg)}}
@keyframes buestr{0%,30%{transform:scale(.86)}50%{transform:scale(1.16)}70%,100%{transform:scale(.86)}}
.spor{height:3px;margin:8px 96px 0;border-radius:9px;background:rgb(11 20 38/.1);overflow:hidden}.spor i{display:block;width:34%;height:100%;border-radius:9px;background:#0b1426;animation:spor 6s ease-in-out infinite alternate}
@keyframes spor{from{transform:translateX(0)}to{transform:translateX(194%)}}
"""
bue=''.join(f'<div style="animation-delay:{j*3-21-10.5:.1f}s"><img src="{k(n)["img"]}"></div>' for j,n in enumerate(n7))
toppA4b=f"""<div class="t">{PILLE}<h1 class="ord">{ord_("Finn ditt|neste kort",0.15)}</h1></div>
<div class="bue opp" style="animation-delay:.45s">{bue}</div><div class="spor opp" style="animation-delay:.6s"><i></i></div>
<div class="under opp" style="animation-delay:.7s;padding-top:18px">{SOK}{TO}</div>"""
open('A4b.html','w',encoding='utf-8').write(skall('A4b',cssA4b,toppA4b))

# ───── A4c: Annonsekortene (store fliser med pris, naboene titter inn) ─────
fem=[k('Haaland'),k('Karetsas'),k('Ronaldinho'),k('Williams'),k('Zidane')]
BR=294
cssA4c=fellesA+f"""
h1{{font-size:38px}}
.stripe{{margin-top:16px;padding:4px 0 30px;overflow:clip}}
.stripe s{{display:flex;gap:12px;width:max-content;padding-left:54px;text-decoration:none;animation:stripe {5*S}s cubic-bezier(.65,0,.25,1) infinite}}
{steg('stripe',[f'transform:translateX({-(5+i)*BR}px)' for i in range(5)]).replace('100%{transform:translateX(-1470px)}','100%{transform:translateX(-2940px)}')}
.fl{{width:282px;flex:none;padding:10px 10px 13px;border-radius:22px;background:#fff;box-shadow:0 24px 36px -26px rgb(11 20 38/.5),0 0 0 1px rgb(11 20 38/.07);animation:akt {5*S}s cubic-bezier(.65,0,.25,1) infinite}}
{steg('akt',['opacity:1;transform:scale(1)']+['opacity:.5;transform:scale(.94)']*4)}
.fl .b{{position:relative;height:226px;border-radius:14px;background:#f4f4f5;display:flex;align-items:center;justify-content:center;overflow:hidden}}
.fl .b img{{height:194px;aspect-ratio:5/7;object-fit:cover;border-radius:7px;box-shadow:0 18px 24px -14px rgb(11 20 38/.55)}}
.fl .b i{{position:absolute;right:9px;top:9px;width:32px;height:32px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center}}.fl .b i svg{{width:17px;height:17px}}
.fl .i{{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;padding:11px 5px 0}}.fl .i p{{min-width:0}}
.fl .i b{{display:block;font-size:15.5px;font-weight:700;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}.fl .i small{{display:block;font-size:12.5px;color:#6b7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.fl .i strong{{flex:none;font-size:18px;font-weight:800;letter-spacing:-.03em}}
.seg{{display:flex;gap:5px;padding:0 120px;margin-top:-14px}}.seg i{{position:relative;flex:1;height:3px;border-radius:9px;background:rgb(11 20 38/.12);overflow:hidden}}
.seg i::after{{content:"";position:absolute;inset:0;border-radius:9px;background:#0b1426;transform-origin:0 50%;animation:fyll {5*S}s linear infinite;animation-delay:inherit}}
@keyframes fyll{{0%{{transform:scaleX(0)}}20%{{transform:scaleX(1)}}20.01%,100%{{transform:scaleX(0)}}}}
"""
def flis(x,j): return f'<div class="fl" style="animation-delay:{forsink(j,5)}"><div class="b">{EKS if x["eks"] else ""}<img src="{x["img"]}"><i>{I["hjerte"]}</i></div><div class="i"><p><b>{x["spiller"]}</b><small>{sett(x).split(" (")[0]} · {x["sted"]}</small></p><strong>{kr(x["pris"])}</strong></div></div>'
stripe=''.join(flis(x,j) for j,x in enumerate(fem))*3
seg=''.join(f'<i style="animation-delay:{forsink(j,5)}"></i>' for j in range(5))
toppA4c=f"""<div class="t">{PILLE}<h1 class="ord">{ord_("Finn ditt|neste kort",0.15)}</h1></div>
<div class="stripe opp" style="animation-delay:.45s"><s>{stripe}</s></div><div class="seg opp" style="animation-delay:.6s">{seg}</div>
<div class="under opp" style="animation-delay:.7s;padding-top:16px">{SOK}{TO}</div>"""
open('A4c.html','w',encoding='utf-8').write(skall('A4c',cssA4c,toppA4c))

# ───── A4d: Scenen (karusellen først, i et panel som skifter farge etter kortet) ─────
n5=['Haaland','Zidane','Ronaldo','Scholes','Ronaldinho']
farge=['#d6e8ff','#fbeccb','#dfe0ff','#ffdcd9','#ffe2c6']
posD=['transform:translateX(0) scale(1);opacity:1;z-index:5;filter:brightness(1)',
 'transform:translateX(-146px) scale(.76);opacity:1;z-index:4;filter:brightness(.95)',
 'transform:translateX(-262px) scale(.6);opacity:0;z-index:3;filter:brightness(.95)',
 'transform:translateX(262px) scale(.6);opacity:0;z-index:3;filter:brightness(.95)',
 'transform:translateX(146px) scale(.76);opacity:1;z-index:4;filter:brightness(.95)']
cssA4d=fellesA+f"""
.scene{{position:relative;height:392px;margin:12px 12px 0;border-radius:28px;overflow:clip;background:#f3f5f9}}
.scene>u{{position:absolute;inset:0;animation:lys {5*S}s linear infinite}}
{steg('lys',['opacity:1']+['opacity:0']*4)}
.scene>em{{position:absolute;left:18px;top:16px;z-index:6;display:flex;align-items:center;gap:8px;font-style:normal;font-size:12.5px;font-weight:600;color:#3f4856}}.scene>em i{{width:7px;height:7px;border-radius:50%;background:#cfa653;animation:puls 2.2s ease-out infinite}}
.kar{{position:absolute;left:0;right:0;top:46px;height:270px}}
.kar div{{position:absolute;left:50%;top:0;width:180px;height:252px;margin-left:-90px;border-radius:11px;animation:scn {5*S}s cubic-bezier(.65,0,.25,1) infinite;box-shadow:0 26px 34px -22px rgb(11 20 38/.6),0 0 0 1px rgb(255 255 255/.9)}}
.kar img{{width:100%;height:100%;object-fit:cover;border-radius:11px;display:block}}
{steg('scn',posD)}
.fot{{position:absolute;left:18px;right:16px;bottom:14px;z-index:6;height:50px}}
.fot p{{position:absolute;left:0;top:7px;width:176px;animation:navn {5*S}s cubic-bezier(.3,.7,.2,1) infinite}}
{blink('navn',5,'opacity:1;transform:none','opacity:0;transform:translateY(8px)')}
.fot b{{display:block;font-size:15.5px;font-weight:700;letter-spacing:-.025em;white-space:nowrap}}.fot small{{display:block;font-size:12.5px;color:#4b5563;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.mini{{position:absolute;right:0;bottom:4px;display:flex;gap:5px}}.mini i{{width:26px;height:36px;border-radius:4px;overflow:hidden;animation:mini {5*S}s cubic-bezier(.3,.7,.2,1) infinite}}.mini img{{width:100%;height:100%;object-fit:cover;display:block}}
{steg('mini',['opacity:1;transform:translateY(-4px);box-shadow:0 0 0 2px #0b1426,0 8px 12px -6px rgb(11 20 38/.5)']+['opacity:.55;transform:none;box-shadow:0 0 0 0 #0b1426,0 0 0 0 rgb(11 20 38/0)']*4)}
.t{{text-align:left;padding-top:16px}}h1{{margin-top:0;font-size:33px;line-height:1.02}}.t p{{margin-top:6px;font-size:14.5px;color:#475569}}
"""
lag=''.join(f'<u style="background:linear-gradient(165deg,{c},#f6f7fa 88%);animation-delay:{forsink(j,5)}"></u>' for j,c in enumerate(farge))
karD=''.join(f'<div class="holo" style="animation-delay:{forsink(j,5)}"><img src="{k(n)["img"]}"></div>' for j,n in enumerate(n5))
navnD=''.join(f'<p style="animation-delay:{forsink(j,5)}"><b>{k(n)["spiller"]}</b><small>{sett(k(n))}</small></p>' for j,n in enumerate(n5))
miniD=''.join(f'<i style="animation-delay:{forsink(j,5)}"><img src="{k(n)["img"]}"></i>' for j,n in enumerate(n5))
toppA4d=f"""<div class="scene opp" style="animation-delay:.1s">{lag}<em><i></i>Norsk markedsplass for fotballkort</em>
<div class="kar">{karD}</div><div class="fot">{navnD}<div class="mini">{miniD}</div></div></div>
<div class="t"><h1 class="ord">{ord_("Finn ditt neste kort",0.35)}</h1><p class="opp" style="animation-delay:.6s">Kjøp og selg direkte med andre samlere.</p></div>
<div class="under opp" style="animation-delay:.75s;padding-top:14px">{SOK}{TO}</div>"""
open('A4d.html','w',encoding='utf-8').write(skall('A4d',cssA4d,toppA4d))

# ───── A4b med tydeligere rammer ─────
RAMME=".bue img{border:5px solid #fff;border-radius:14px;box-shadow:0 0 0 1.5px rgb(11 20 38/.2),0 26px 32px -20px rgb(11 20 38/.6)}"
# 1: hvit ramme og mørk strek rundt hvert kort
open('A4b1.html','w',encoding='utf-8').write(skall('A4b1',cssA4b+RAMME,toppA4b))
# 2: samme kortrammer, og hele karusellen ligger i et innrammet felt
FELT=""".bue{height:300px;margin:14px 12px 0;border-radius:26px;background:linear-gradient(180deg,#f7f8fb,#eef1f6);box-shadow:inset 0 0 0 1.5px #d9dee7}
.bue::before{opacity:.7}.bue div{top:36px}.spor{margin-top:12px}"""
open('A4b2.html','w',encoding='utf-8').write(skall('A4b2',cssA4b+RAMME+FELT,toppA4b))

# ═════ Runde 5: flere varianter av A4c (annonsekortene) ═════
TONE={'Haaland':'#dcebff','Karetsas':'#fbe9c6','Ronaldinho':'#ffe1c9','Williams':'#e7eaf2','Zidane':'#efe8d8'}
def tone(x): return next(v for n,v in TONE.items() if n in x['spiller'])
sett2=lambda x: sett(x).replace(' (',' · ').rstrip(')')
def stripecss(br,pad,n=5,navn='stripe'):
    return f".stripe s{{display:flex;gap:{br[1]}px;width:max-content;padding-left:{pad}px;text-decoration:none;animation:{navn} {n*S}s cubic-bezier(.65,0,.25,1) infinite}}"+steg(navn,[f'transform:translateX({-(n+i)*br[0]}px)' for i in range(n)]).replace(f'100%{{transform:translateX({-n*br[0]}px)}}',f'100%{{transform:translateX({-2*n*br[0]}px)}}')
SEG=f""".seg{{display:flex;gap:5px;padding:0 120px;margin-top:-14px}}.seg i{{position:relative;flex:1;height:3px;border-radius:9px;background:rgb(11 20 38/.12);overflow:hidden}}
.seg i::after{{content:"";position:absolute;inset:0;border-radius:9px;background:#0b1426;transform-origin:0 50%;animation:fyll {5*S}s linear infinite;animation-delay:inherit}}
@keyframes fyll{{0%{{transform:scaleX(0)}}20%{{transform:scaleX(1)}}20.01%,100%{{transform:scaleX(0)}}}}"""
HJ=f'<i class="hj">{I["hjerte"]}</i>'
HJCSS=".hj{position:absolute;right:9px;top:9px;z-index:3;width:32px;height:32px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px -4px rgb(11 20 38/.3)}.hj svg{width:17px;height:17px}"
def bygg_c(navn, css, flisfn, topp_fn, kopier=3):
    stripe=''.join(flisfn(x,j) for j,x in enumerate(fem))*kopier
    open(navn+'.html','w',encoding='utf-8').write(skall(navn,fellesA+css,topp_fn(stripe)))
def std_topp(stripe, h="Finn ditt|neste kort"):
    return f"""<div class="t">{PILLE}<h1 class="ord">{ord_(h,0.15)}</h1></div>
<div class="stripe opp" style="animation-delay:.45s"><s>{stripe}</s></div><div class="seg opp" style="animation-delay:.6s">{seg}</div>
<div class="under opp" style="animation-delay:.7s;padding-top:16px">{SOK}{TO}</div>"""

# ───── A4c1: Skarp flis (fargetonet bildefelt, ingen avkuttet tekst, tydelige naboer) ─────
css1=f"""h1{{font-size:38px}}.stripe{{margin-top:16px;padding:4px 0 30px;overflow:clip}}{stripecss((298,12),52)}
.fl{{width:286px;flex:none;padding:8px 8px 14px;border-radius:24px;background:#fff;box-shadow:0 26px 40px -28px rgb(11 20 38/.6),0 0 0 1px rgb(11 20 38/.09);animation:akt {5*S}s cubic-bezier(.65,0,.25,1) infinite}}
{steg('akt',['opacity:1;transform:scale(1)']+['opacity:.92;transform:scale(.95)']*4)}
.fl .b{{position:relative;height:226px;border-radius:17px;background:linear-gradient(170deg,var(--c),#f6f7fa 120%);display:flex;align-items:center;justify-content:center;overflow:hidden}}
.fl .b img{{height:196px;aspect-ratio:5/7;object-fit:cover;border-radius:7px;box-shadow:0 18px 24px -14px rgb(11 20 38/.6),0 0 0 1px rgb(255 255 255/.8)}}
.fl .eks{{border-radius:17px 0 9px 0}}{HJCSS}
.fl .i{{padding:12px 8px 0}}.fl .i b{{display:block;font-size:17px;font-weight:700;letter-spacing:-.025em;white-space:nowrap}}.fl .i small{{display:block;margin-top:1px;font-size:13px;color:#5b6472;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.fl .r{{display:flex;align-items:baseline;justify-content:space-between;margin-top:8px}}.fl .r strong{{font-size:22px;font-weight:800;letter-spacing:-.035em}}.fl .r em{{font-style:normal;font-size:13px;color:#5b6472}}
{SEG}"""
def flis1(x,j): return f'<div class="fl" style="--c:{tone(x)};animation-delay:{forsink(j,5)}"><div class="b">{EKS if x["eks"] else ""}<img src="{x["img"]}">{HJ}</div><div class="i"><b>{x["spiller"]}</b><small>{sett2(x)}</small><div class="r"><strong>{kr(x["pris"])}</strong><em>{x["sted"]}</em></div></div></div>'
bygg_c('A4c1',css1,flis1,std_topp)

# ───── A4c2: Hylla (søket først, så en hylle med to kort i bredden) ─────
css2=f""".t{{text-align:left;padding-top:18px}}h1{{margin-top:0;font-size:33px;line-height:1.02}}.t p{{margin-top:6px;font-size:14.5px;color:#475569}}
.hode{{display:flex;align-items:baseline;justify-content:space-between;padding:22px 16px 0}}.hode b{{font-size:19px;font-weight:700;letter-spacing:-.03em}}.hode span{{display:flex;align-items:center;gap:5px;font-size:14px;font-weight:600}}.hode svg{{width:15px;height:15px}}
.stripe{{margin-top:10px;padding:2px 0 4px;overflow:clip}}{stripecss((176,10),16)}
.fl{{width:166px;flex:none}}.fl .b{{position:relative;height:196px;border-radius:16px;background:#f4f4f5;display:flex;align-items:center;justify-content:center;overflow:hidden}}
.fl .b img{{height:164px;aspect-ratio:5/7;object-fit:cover;border-radius:6px;box-shadow:0 16px 22px -14px rgb(11 20 38/.55)}}
.fl .eks{{border-radius:16px 0 9px 0}}{HJCSS}.hj{{width:30px;height:30px}}
.fl strong{{display:block;margin-top:9px;font-size:17px;font-weight:700;letter-spacing:-.02em}}.fl p{{font-size:13.5px;color:#334155;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}.fl small{{display:block;font-size:12px;color:#6b7280}}"""
def flis2(x,j): return f'<div class="fl"><div class="b">{EKS if x["eks"] else ""}<img src="{x["img"]}">{HJ}</div><strong>{kr(x["pris"])}</strong><p>{x["spiller"]}</p><small>{x["sted"]}</small></div>'
def topp2(stripe): return f"""<div class="t"><h1 class="ord">{ord_("Finn ditt neste kort",0.15)}</h1><p class="opp" style="animation-delay:.4s">Kjøp og selg fotballkort direkte med andre samlere.</p></div>
<div class="under opp" style="animation-delay:.5s;padding-top:14px">{SOK}</div>
<div class="hode opp" style="animation-delay:.6s"><b>Utvalgte kort</b><span>Se alle {I["pil"]}</span></div>
<div class="stripe opp" style="animation-delay:.7s"><s>{stripe}</s></div>"""
bygg_c('A4c2',css2,flis2,topp2,kopier=4)

# ───── A4c3: Liggende flis (kortet til venstre, navn og stor pris til høyre) ─────
css3=f"""h1{{font-size:38px}}.stripe{{margin-top:18px;padding:4px 0 30px;overflow:clip}}{stripecss((340,10),16)}
.fl{{display:flex;width:330px;height:196px;flex:none;padding:8px;border-radius:24px;background:#fff;box-shadow:0 26px 40px -28px rgb(11 20 38/.6),0 0 0 1px rgb(11 20 38/.09);animation:akt {5*S}s cubic-bezier(.65,0,.25,1) infinite}}
{steg('akt',['opacity:1']+['opacity:.6']*4)}
.fl .b{{position:relative;flex:none;width:136px;border-radius:17px;background:linear-gradient(170deg,var(--c),#f6f7fa 130%);display:flex;align-items:center;justify-content:center;overflow:hidden}}
.fl .b img{{height:150px;aspect-ratio:5/7;object-fit:cover;border-radius:6px;box-shadow:0 16px 22px -14px rgb(11 20 38/.6),0 0 0 1px rgb(255 255 255/.8);transform:rotate(-3deg)}}
.fl .eks{{border-radius:17px 0 9px 0}}
.fl .i{{flex:1;min-width:0;display:flex;flex-direction:column;padding:8px 6px 4px 14px}}.fl .i small{{font-size:12.5px;color:#5b6472;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.fl .i b{{margin-top:3px;font-size:18px;font-weight:700;letter-spacing:-.03em;line-height:1.12}}.fl .i strong{{margin-top:8px;font-size:25px;font-weight:800;letter-spacing:-.04em}}
.fl .r{{margin-top:auto;display:flex;align-items:center;justify-content:space-between}}.fl .r em{{font-style:normal;font-size:13px;color:#5b6472}}.fl .r u{{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#0b1426;color:#fff;text-decoration:none}}.fl .r svg{{width:17px;height:17px}}
{SEG}"""
def flis3(x,j): return f'<div class="fl" style="--c:{tone(x)};animation-delay:{forsink(j,5)}"><div class="b">{EKS if x["eks"] else ""}<img src="{x["img"]}"></div><div class="i"><small>{sett(x).split(" (")[0]}</small><b>{x["spiller"]}</b><strong>{kr(x["pris"])}</strong><div class="r"><em>{x["sted"]}</em><u>{I["pil"]}</u></div></div></div>'
bygg_c('A4c3',css3,flis3,std_topp)

# ───── A4c4: Glassflis (kortets egne farger som bakgrunn, navn og pris på frostet glass) ─────
css4=f"""h1{{font-size:38px}}.stripe{{margin-top:16px;padding:4px 0 30px;overflow:clip}}{stripecss((302,12),50)}
.fl{{position:relative;width:290px;height:326px;flex:none;border-radius:26px;overflow:hidden;background:#eef1f6;box-shadow:0 26px 40px -28px rgb(11 20 38/.65),0 0 0 1px rgb(11 20 38/.09);animation:akt {5*S}s cubic-bezier(.65,0,.25,1) infinite}}
{steg('akt',['opacity:1;transform:scale(1)']+['opacity:.85;transform:scale(.94)']*4)}
.fl .bg{{position:absolute;inset:-30px;width:calc(100% + 60px);height:calc(100% + 60px);object-fit:cover;filter:blur(26px) saturate(1.5);opacity:.85}}
.fl::before{{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgb(255 255 255/.5),rgb(255 255 255/.28))}}
.fl .k{{position:absolute;left:50%;top:18px;z-index:2;height:216px;aspect-ratio:5/7;transform:translateX(-50%);object-fit:cover;border-radius:8px;box-shadow:0 22px 28px -16px rgb(11 20 38/.7),0 0 0 1px rgb(255 255 255/.85)}}
.fl .eks{{z-index:3;border-radius:26px 0 9px 0;height:22px;padding:0 9px 1px 12px}}{HJCSS}.hj{{right:11px;top:11px}}
.fl .gl{{position:absolute;left:9px;right:9px;bottom:9px;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 14px 12px;border-radius:18px;background:rgb(255 255 255/.76);-webkit-backdrop-filter:blur(16px) saturate(1.6);backdrop-filter:blur(16px) saturate(1.6);box-shadow:inset 0 0 0 1px rgb(255 255 255/.9),0 10px 20px -14px rgb(11 20 38/.5)}}
.fl .gl p{{min-width:0}}.fl .gl b{{display:block;font-size:15.5px;font-weight:700;letter-spacing:-.025em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}.fl .gl small{{display:block;font-size:12.5px;color:#475569;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.fl .gl strong{{flex:none;font-size:18.5px;font-weight:800;letter-spacing:-.035em}}
{SEG}"""
def flis4(x,j): return f'<div class="fl" style="animation-delay:{forsink(j,5)}"><img class="bg" src="{x["img"]}">{EKS if x["eks"] else ""}<img class="k" src="{x["img"]}">{HJ}<div class="gl"><p><b>{x["spiller"]}</b><small>{sett(x).split(" (")[0]}</small></p><strong>{kr(x["pris"])}</strong></div></div>'
bygg_c('A4c4',css4,flis4,std_topp)

# ───── A4b1 uten gullpillen ─────
assert PILLE in toppA4b
# a: pillen er fjernet helt
open('A4b1a.html','w',encoding='utf-8').write(skall('A4b1a',cssA4b+RAMME+".t{padding-top:30px}h1{margin-top:0}",toppA4b.replace(PILLE,'')))
# b: teksten står som en rolig grå linje under overskriften
UNDERT='<p class="ut opp" style="animation-delay:.4s">Norsk markedsplass for fotballkort</p>'
open('A4b1b.html','w',encoding='utf-8').write(skall('A4b1b',cssA4b+RAMME+".t{padding-top:28px}h1{margin-top:0}.ut{margin-top:10px;font-size:15px;color:#5b6472}",toppA4b.replace(PILLE,'').replace('</h1></div>','</h1>'+UNDERT+'</div>',1)))

# ───── A4b1 med navn og pris ─────
UTEN=".t{padding-top:30px}h1{margin-top:0}"
# n: et innrammet felt under buen viser navn, sett og pris for kortet som er i midten
cssN=cssA4b+RAMME+UTEN+"""
.bue{height:284px}.spor{display:none}
.lapp{position:relative;height:66px;margin:2px 16px 0;border-radius:18px;background:#fff;box-shadow:0 0 0 1.5px rgb(11 20 38/.2),0 18px 26px -22px rgb(11 20 38/.6);overflow:hidden}
.lapp .eks{border-radius:18px 0 9px 0;height:19px}
.lapp p{position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:15px 16px 0;animation:lapp 21s linear infinite}
.lapp b{display:block;font-size:16px;font-weight:700;letter-spacing:-.025em;white-space:nowrap}.lapp small{display:block;font-size:12.5px;color:#5b6472;white-space:nowrap}
.lapp strong{flex:none;font-size:21px;font-weight:800;letter-spacing:-.035em}
@keyframes lapp{0%,5.6%{opacity:1;transform:none}7.14%{opacity:0;transform:translateX(-14px)}7.15%,92.85%{opacity:0;transform:translateX(14px)}94.4%,100%{opacity:1;transform:none}}
"""
lapper=''.join(f'<p style="animation-delay:{3*j-21}s"><span><b>{k(n)["spiller"]}</b><small>{sett(k(n)).split(" (")[0]}</small></span><strong>{kr(k(n)["pris"])}</strong></p>' for j,n in enumerate(n7))
toppN=toppA4b.replace(PILLE,'').replace('<div class="spor opp" style="animation-delay:.6s"><i></i></div>',f'<div class="lapp opp" style="animation-delay:.6s">{EKS}{lapper}</div>')
assert 'lapp opp' in toppN
open('A4b1n.html','w',encoding='utf-8').write(skall('A4b1n',cssN,toppN.replace('padding-top:18px">','padding-top:14px">')))

# p: navn og pris står under hvert kort og følger med langs buen
cssP=cssA4b+RAMME+UTEN+"""
.bue{height:338px}.bue img{animation:none;height:210px}
.bue .k{position:relative;display:block;transform-origin:50% 105px;animation:buestr 21s ease-in-out infinite;animation-delay:inherit}
.bue .eks{z-index:2;border-radius:14px 0 9px 0}
.bue em{display:block;margin-top:9px;text-align:center;font-style:normal;white-space:nowrap}.bue em b{display:block;font-size:13.5px;font-weight:600;letter-spacing:-.02em;color:#334155}.bue em strong{display:block;font-size:16px;font-weight:800;letter-spacing:-.03em}
.spor{margin-top:2px}
"""
bueP=''.join(f'<div style="animation-delay:{j*3-21-10.5:.1f}s"><span class="k">{EKS}<img src="{k(n)["img"]}"><em><b>{k(n)["spiller"]}</b><strong>{kr(k(n)["pris"])}</strong></em></span></div>' for j,n in enumerate(n7))
toppP=toppA4b.replace(PILLE,'').replace(bue,bueP)
assert 'class="k"' in toppP
open('A4b1p.html','w',encoding='utf-8').write(skall('A4b1p',cssP,toppP.replace('padding-top:18px">','padding-top:14px">')))

# ═════ Runde 8: flere varianter av A4b1n (buen med navn og pris i et felt) ═════
LAPP=""".spor{display:none}.lapp{position:relative;overflow:hidden}
.lapp p{position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between;gap:12px;animation:rull 21s cubic-bezier(.5,0,.3,1) infinite}
.lapp b{display:block;font-size:16px;font-weight:700;letter-spacing:-.025em;white-space:nowrap}.lapp small{display:block;font-size:12.5px;color:#5b6472;white-space:nowrap}
.lapp strong{flex:none;font-size:21px;font-weight:800;letter-spacing:-.035em}
.lapp .h{display:flex;align-items:center;gap:12px}.lapp u{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:#0b1426;color:#fff;text-decoration:none}.lapp u svg{width:16px;height:16px}
@keyframes rull{0%,6.4%{transform:translateY(0)}7.9%{transform:translateY(-115%)}7.91%,92.09%{transform:translateY(115%)}93.6%,100%{transform:translateY(0)}}
"""
def ps(fn): return ''.join(f'<p style="animation-delay:{3*j-21}s">{fn(k(n))}</p>' for j,n in enumerate(n7))
p_std=lambda x: f'<span><b>{x["spiller"]}</b><small>{sett(x).split(" (")[0]}</small></span><strong>{kr(x["pris"])}</strong>'
p_pil=lambda x: f'<span><b>{x["spiller"]}</b><small>{sett(x).split(" (")[0]}</small></span><span class="h"><strong>{kr(x["pris"])}</strong><u>{I["pil"]}</u></span>'
BUE=f'<div class="bue opp" style="animation-delay:.45s">{bue}</div>'
H1=f'<div class="t"><h1 class="ord">{ord_("Finn ditt|neste kort",0.15)}</h1></div>'
def under(pt): return f'<div class="under opp" style="animation-delay:.7s;padding-top:{pt}px">{SOK}{TO}</div>'
def felt(inn): return f'<div class="lapp opp" style="animation-delay:.6s">{inn}</div>'
grunn=cssA4b+RAMME+UTEN+LAPP

# n1: Glassfelt som ligger delvis over midtkortet
css=grunn+""".bue{height:300px}
.lapp{z-index:5;height:60px;margin:-66px 34px 0;border-radius:20px;background:rgb(255 255 255/.76);-webkit-backdrop-filter:blur(16px) saturate(1.6);backdrop-filter:blur(16px) saturate(1.6);box-shadow:inset 0 0 0 1px rgb(255 255 255/.95),0 0 0 1px rgb(11 20 38/.13),0 20px 30px -18px rgb(11 20 38/.6)}
.lapp p{padding:14px 16px 0}.lapp .eks{z-index:2;border-radius:20px 0 9px 0;height:18px;padding-left:10px}.lapp b{font-size:15px}.lapp small{font-size:12px}.lapp strong{font-size:19px}"""
open('A4b1n1.html','w',encoding='utf-8').write(skall('A4b1n1',css,H1+BUE+felt(EKS+ps(p_std))+under(22)))

# n2: Uten ramme, midtstilt tekst med stor pris
css=grunn+""".bue{height:284px}
.lapp{overflow:visible;margin:0 16px;text-align:center}.lapp .eks{position:relative;display:inline-flex;border-radius:7px;height:20px;padding:0 8px 1px}
.lapp .r{position:relative;height:58px;margin-top:5px;overflow:hidden}.lapp p{display:block}
.lapp b{font-size:17px}.lapp strong{display:block;margin-top:1px;font-size:28px;line-height:1.1;letter-spacing:-.04em}"""
p_midt=lambda x: f'<b>{x["spiller"]}</b><strong>{kr(x["pris"])}</strong>'
open('A4b1n2.html','w',encoding='utf-8').write(skall('A4b1n2',css,H1+BUE+felt(EKS+f'<div class="r">{ps(p_midt)}</div>')+under(14)))

# n3: Mørkt felt med gullstrek og pilknapp
css=grunn+""".bue{height:284px}
.lapp{height:70px;margin:2px 16px 0;border-radius:18px;background:#0b1426;color:#fff;box-shadow:inset 0 -2px 0 #cfa653,0 20px 28px -20px rgb(11 20 38/.85)}
.lapp .eks{z-index:2;left:16px;top:10px;height:auto;padding:0;background:none;box-shadow:none;border-radius:0;color:#e3c47c;font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.lapp p{padding:21px 12px 0 16px}.lapp small{color:rgb(255 255 255/.62)}.lapp u{background:#fff;color:#0b1426}"""
open('A4b1n3.html','w',encoding='utf-8').write(skall('A4b1n3',css,H1+BUE+felt(EKS+ps(p_pil))+under(16)))

# n4: Søket først. Overskrift på én linje, buen under søket, innrammet felt med pilknapp
css=grunn+""".t{text-align:left;padding-top:18px}h1{font-size:33px;line-height:1.02}.ut{margin-top:6px;font-size:14.5px;color:#5b6472}
.bue{height:284px;margin-top:8px}
.lapp{height:66px;margin:2px 16px 0;border-radius:18px;background:#fff;box-shadow:0 0 0 1.5px rgb(11 20 38/.2),0 18px 26px -22px rgb(11 20 38/.6)}
.lapp .eks{z-index:2;border-radius:18px 0 9px 0;height:19px}.lapp p{padding:15px 12px 0 16px}"""
topp4=f'<div class="t"><h1 class="ord">{ord_("Finn ditt neste kort",0.15)}</h1><p class="ut opp" style="animation-delay:.4s">Norsk markedsplass for fotballkort</p></div><div class="under opp" style="animation-delay:.5s;padding-top:14px">{SOK}</div>'
open('A4b1n4.html','w',encoding='utf-8').write(skall('A4b1n4',css,topp4+BUE.replace('.45s','.6s')+felt(EKS+ps(p_pil)).replace('.6s','.7s')))

# ═════ Runde 9: flere varianter av A4c4 (glassflisen). Uten gullmerket over overskriften. ═════
GLASS="background:rgb(255 255 255/.78);-webkit-backdrop-filter:blur(16px) saturate(1.6);backdrop-filter:blur(16px) saturate(1.6);box-shadow:inset 0 0 0 1px rgb(255 255 255/.9),0 10px 20px -14px rgb(11 20 38/.5)"
def glasscss(W,H,pad,slor="rgb(255 255 255/.5),rgb(255 255 255/.28)",av="opacity:.85;transform:scale(.94)"):
    return UTEN+f"""h1{{font-size:38px}}.stripe{{margin-top:16px;padding:4px 0 30px;overflow:clip}}{stripecss((W+12,12),pad)}
.fl{{position:relative;width:{W}px;height:{H}px;flex:none;border-radius:26px;overflow:hidden;background:#eef1f6;box-shadow:0 26px 40px -28px rgb(11 20 38/.65),0 0 0 1px rgb(11 20 38/.09);animation:akt {5*S}s cubic-bezier(.65,0,.25,1) infinite}}
{steg('akt',['opacity:1;transform:scale(1)']+[av]*4)}
.fl .bg{{position:absolute;inset:-30px;width:calc(100% + 60px);height:calc(100% + 60px);object-fit:cover;filter:blur(26px) saturate(1.5);opacity:.85}}
.fl::before{{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,{slor})}}
.fl .eks{{z-index:4;border-radius:26px 0 9px 0;height:22px;padding:0 9px 1px 12px}}{HJCSS}.hj{{right:11px;top:11px;z-index:4}}
.fl b{{display:block;font-weight:700;letter-spacing:-.025em}}.fl small{{display:block;color:#475569}}.fl strong{{font-weight:800;letter-spacing:-.035em}}
.fl u{{flex:none;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:#0b1426;color:#fff;text-decoration:none}}.fl u svg{{width:16px;height:16px}}
{SEG}"""
def glasstopp(pt=16): return lambda stripe: H1+f'<div class="stripe opp" style="animation-delay:.45s"><s>{stripe}</s></div><div class="seg opp" style="animation-delay:.6s">{seg}</div>'+under(pt)
def bilder(x): return f'<img class="bg" src="{x["img"]}">{EKS if x["eks"] else ""}'
kort_sett=lambda x: sett(x).split(" (")[0]

# a: Bred glassflis. Nesten full bredde, større kort, navn og pris på første linje og sett og «Se annonsen» på andre.
cssa=glasscss(334,352,28)+f"""
.fl .k{{position:absolute;left:50%;top:18px;z-index:2;height:232px;aspect-ratio:5/7;transform:translateX(-50%);object-fit:cover;border-radius:9px;box-shadow:0 22px 28px -16px rgb(11 20 38/.7),0 0 0 1px rgb(255 255 255/.85)}}
.fl .gl{{position:absolute;left:10px;right:10px;bottom:10px;z-index:3;padding:11px 15px 12px;border-radius:19px;{GLASS}}}
.fl .gl div{{display:flex;align-items:baseline;justify-content:space-between;gap:12px}}.fl .gl b{{font-size:16.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}.fl .gl strong{{flex:none;font-size:19px}}
.fl .gl small{{font-size:12.5px;white-space:nowrap}}.fl .gl em{{display:flex;align-items:center;gap:5px;font-style:normal;font-size:12.5px;font-weight:600;color:#0b1426}}.fl .gl em svg{{width:13px;height:13px}}"""
def flisa(x,j): return f'<div class="fl" style="animation-delay:{forsink(j,5)}">{bilder(x)}<img class="k" src="{x["img"]}">{HJ}<div class="gl"><div><b>{x["spiller"]}</b><strong>{kr(x["pris"])}</strong></div><div style="margin-top:2px"><small>{kort_sett(x)}</small><em>Se annonsen {I["pil"]}</em></div></div></div>'
bygg_c('A4c4a',cssa,flisa,glasstopp(14))

# b: Lys og luftig. Sterkere hvitt slør så fargene blir pastell, hvit ramme rundt kortet, tydelige nabofliser.
cssb=glasscss(290,330,50,"rgb(255 255 255/.7),rgb(255 255 255/.52)","opacity:1;transform:scale(.94)")+f"""
.fl{{box-shadow:0 26px 40px -28px rgb(11 20 38/.5),0 0 0 1.5px rgb(11 20 38/.12)}}
.fl .k{{position:absolute;left:50%;top:20px;z-index:2;height:214px;aspect-ratio:5/7;transform:translateX(-50%);object-fit:cover;border:5px solid #fff;border-radius:13px;box-shadow:0 0 0 1.5px rgb(11 20 38/.18),0 22px 28px -18px rgb(11 20 38/.6)}}
.fl .gl{{position:absolute;left:9px;right:9px;bottom:9px;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 14px 12px;border-radius:18px;background:#fff;box-shadow:0 0 0 1.5px rgb(11 20 38/.12)}}
.fl .gl p{{min-width:0}}.fl .gl b{{font-size:15.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}.fl .gl small{{font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}.fl .gl strong{{flex:none;font-size:18.5px}}"""
def flisb(x,j): return f'<div class="fl" style="animation-delay:{forsink(j,5)}">{bilder(x)}<img class="k" src="{x["img"]}">{HJ}<div class="gl"><p><b>{x["spiller"]}</b><small>{kort_sett(x)}</small></p><strong>{kr(x["pris"])}</strong></div></div>'
bygg_c('A4c4b',cssb,flisb,glasstopp())

# c: Vippet kort med glans. Kortet står litt på skrå med en glans som glir over, og prisen ligger i en egen glassbrikke på kortet.
cssc=glasscss(290,330,50)+f"""
.fl .k{{position:absolute;left:50%;top:20px;z-index:2;height:214px;aspect-ratio:5/7;margin-left:-76px;transform:rotate(-4deg);border-radius:9px;box-shadow:0 26px 30px -16px rgb(11 20 38/.75),0 0 0 1px rgb(255 255 255/.85)}}
.fl .k img{{width:100%;height:100%;object-fit:cover;border-radius:9px;display:block}}
.fl .pp{{position:absolute;right:16px;top:184px;z-index:4;padding:8px 13px 9px;border-radius:999px;{GLASS};font-size:17.5px}}
.fl .gl{{position:absolute;left:9px;right:9px;bottom:9px;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 10px 10px 14px;border-radius:18px;{GLASS}}}
.fl .gl p{{min-width:0}}.fl .gl b{{font-size:15.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}.fl .gl small{{font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}"""
def flisc(x,j): return f'<div class="fl" style="animation-delay:{forsink(j,5)}">{bilder(x)}<div class="k holo"><img src="{x["img"]}"></div>{HJ}<strong class="pp">{kr(x["pris"])}</strong><div class="gl"><p><b>{x["spiller"]}</b><small>{kort_sett(x)}</small></p><u>{I["pil"]}</u></div></div>'
bygg_c('A4c4c',cssc,flisc,glasstopp())

# d: Liggende glassflis. Lav og bred: kortet til venstre, glassfelt til høyre med sett, navn, stor pris og pilknapp.
cssd=glasscss(334,196,28,av="opacity:.7;transform:scale(.96)")+f"""
.fl .k{{position:absolute;left:20px;top:50%;z-index:2;height:156px;aspect-ratio:5/7;margin-top:-78px;transform:rotate(-3deg);object-fit:cover;border-radius:7px;box-shadow:0 20px 24px -14px rgb(11 20 38/.75),0 0 0 1px rgb(255 255 255/.85)}}
.fl .eks{{height:20px}}
.fl .gl{{position:absolute;left:148px;right:10px;top:10px;bottom:10px;z-index:3;display:flex;flex-direction:column;padding:13px 12px 11px 15px;border-radius:18px;{GLASS}}}
.fl .gl small{{font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}.fl .gl b{{margin-top:2px;font-size:17.5px;line-height:1.12}}.fl .gl strong{{margin-top:7px;font-size:24px}}
.fl .gl div{{margin-top:auto;display:flex;align-items:center;justify-content:space-between}}.fl .gl em{{font-style:normal;font-size:12.5px;color:#475569}}"""
def flisd(x,j): return f'<div class="fl" style="animation-delay:{forsink(j,5)}">{bilder(x)}<img class="k" src="{x["img"]}"><div class="gl"><small>{kort_sett(x)}</small><b>{x["spiller"]}</b><strong>{kr(x["pris"])}</strong><div><em>{x["sted"]}</em><u>{I["pil"]}</u></div></div></div>'
bygg_c('A4c4d',cssd,flisd,glasstopp())
