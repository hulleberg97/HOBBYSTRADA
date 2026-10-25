import type { Metadata } from "next";
import { Bricolage_Grotesque, Fraunces, Instrument_Serif, Plus_Jakarta_Sans, Schibsted_Grotesk, Sora, Syne, Unbounded } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

const schibsted = Schibsted_Grotesk({ variable: "--nf-schibsted", subsets: ["latin"] });
// Skriften i den gamle overskriften (backup ?ot=av)
const tJakarta = Plus_Jakarta_Sans({ variable: "--t-jakarta", subsets: ["latin"], weight: ["800"] });
// Skriften i den store overskriften over vifta (Sora). Jakarta brukes av backupen ?ot=av.
const tSora = Sora({ variable: "--t-sora", subsets: ["latin"], weight: ["800"] });
// TEST ?skrift=…: skrifttyper til overskriften
const fBricolage = Bricolage_Grotesque({ variable: "--f-bricolage", subsets: ["latin"], weight: ["800"] });
const fSerif = Instrument_Serif({ variable: "--f-serif", subsets: ["latin"], weight: ["400"], style: ["normal", "italic"] });
const fUnbounded = Unbounded({ variable: "--f-unbounded", subsets: ["latin"], weight: ["700"] });
const fSyne = Syne({ variable: "--f-syne", subsets: ["latin"], weight: ["800"] });
const fFraunces = Fraunces({ variable: "--f-fraunces", subsets: ["latin"], weight: ["700"], style: ["normal", "italic"] });
const headlineFont = `${tJakarta.variable} ${tSora.variable} ${fBricolage.variable} ${fSerif.variable} ${fUnbounded.variable} ${fSyne.variable} ${fFraunces.variable}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbystrada.vercel.app"),
  title: { default: "Fotballkort – kjøp og selg direkte | HOBBYSTRADA", template: "%s | HOBBYSTRADA" },
  description: "Kjøp og selg fotballkort direkte i Norge. Autografkort, relic, patch og nummererte kort fra Topps Chrome, Museum Collection og Inception.",
  openGraph: { locale: "nb_NO", siteName: "HOBBYSTRADA", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb" data-stil="pro" data-tone="1" data-meny="c" data-glans="1" data-linje="s6" data-tittel="2" data-ot="u1" className={`${schibsted.variable} ${headlineFont}`}>
      <body>
        {/* TEST: ?vis=hand|pakke|magasin prøver nye oppsett av toppen (?vis=av tilbake) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var v=new URLSearchParams(location.search).get("vis");if(v)sessionStorage.setItem("vis",v);var s=sessionStorage.getItem("vis");if(s&&s!=="av")document.documentElement.dataset.vis=s;var k=new URLSearchParams(location.search).get("stort");if(k)sessionStorage.setItem("stort",k);var t=sessionStorage.getItem("stort");if(t&&t!=="av")document.documentElement.dataset.stort=t;var q=new URLSearchParams(location.search).get("tittel2");if(q)sessionStorage.setItem("tittel2",q);var u=sessionStorage.getItem("tittel2");if(u&&u!=="av")document.documentElement.dataset.tittel2=u;var f=new URLSearchParams(location.search).get("skrift");if(f)sessionStorage.setItem("skrift",f);var g=sessionStorage.getItem("skrift");if(g&&g!=="av")document.documentElement.dataset.skrift=g}catch(e){}})()`,
          }}
        />
        {/* Backup: ?ot=av viser den gamle overskriften (huskes mens fanen er åpen), ?ot=u1 tilbake */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var v=new URLSearchParams(location.search).get("ot");if(v)sessionStorage.setItem("ot",v);if(sessionStorage.getItem("ot")==="av")delete document.documentElement.dataset.ot}catch(e){}})()`,
          }}
        />
        {/* Norske feilmeldinger i skjemaer, uansett språk i nettleseren */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.addEventListener("invalid",function(e){var f=e.target,v=f.validity,m="";if(v.valueMissing)m=f.type==="checkbox"?"Kryss av her for å gå videre.":f.tagName==="SELECT"?"Velg et alternativ.":"Fyll ut dette feltet.";else if(v.typeMismatch&&f.type==="email")m="Skriv inn en gyldig e-postadresse.";else if(v.tooShort)m="Bruk minst "+f.minLength+" tegn.";else if(v.rangeUnderflow||v.rangeOverflow)m="Verdien er utenfor det som er tillatt.";f.setCustomValidity(m)},true);document.addEventListener("input",function(e){if(e.target.setCustomValidity)e.target.setCustomValidity("")},true);document.addEventListener("change",function(e){if(e.target.setCustomValidity)e.target.setCustomValidity("")},true)}catch(e){}})()`,
          }}
        />
        <Header />
        <main className="site-main">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
