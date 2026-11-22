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
