import type { Metadata } from "next";
import {
  Abril_Fatface,
  Bricolage_Grotesque,
  EB_Garamond,
  Inter_Tight,
  Manrope,
  Nunito,
  Oswald,
  Pacifico,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Raleway,
  Satisfy,
  Schibsted_Grotesk,
  Sora,
  Space_Grotesk,
  Unbounded,
} from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

const schibsted = Schibsted_Grotesk({ variable: "--nf-schibsted", subsets: ["latin"] });
// Skriften i den store overskriften over vifta
const tJakarta = Plus_Jakarta_Sans({ variable: "--t-jakarta", subsets: ["latin"], weight: ["800"] });
// TEST ?font=…: moderne skrifter til overskriften. preload: false, så de bare lastes ned når testlenken brukes.
const fInterTight = Inter_Tight({ variable: "--f-intertight", subsets: ["latin"], weight: ["800"], preload: false });
const fManrope = Manrope({ variable: "--f-manrope", subsets: ["latin"], weight: ["800"], preload: false });
const fSora = Sora({ variable: "--f-sora", subsets: ["latin"], weight: ["800"], preload: false });
const fSpace = Space_Grotesk({ variable: "--f-space", subsets: ["latin"], weight: ["700"], preload: false });
const fUnbounded = Unbounded({ variable: "--f-unbounded", subsets: ["latin"], weight: ["700"], preload: false });
const fBricolage = Bricolage_Grotesque({ variable: "--f-bricolage", subsets: ["latin"], weight: ["800"], preload: false });
const fRaleway = Raleway({ variable: "--f-raleway", subsets: ["latin"], weight: ["300"], preload: false });
const fGaramond = EB_Garamond({ variable: "--f-garamond", subsets: ["latin"], weight: ["500"], preload: false });
const fOswald = Oswald({ variable: "--f-oswald", subsets: ["latin"], weight: ["600"], preload: false });
const fAbril = Abril_Fatface({ variable: "--f-abril", subsets: ["latin"], weight: ["400"], preload: false });
const fSatisfy = Satisfy({ variable: "--f-satisfy", subsets: ["latin"], weight: ["400"], preload: false });
const fNunito = Nunito({ variable: "--f-nunito", subsets: ["latin"], weight: ["300"], preload: false });
const fPlayfair = Playfair_Display({ variable: "--f-playfair", subsets: ["latin"], weight: ["700"], preload: false });
const fPacifico = Pacifico({ variable: "--f-pacifico", subsets: ["latin"], weight: ["400"], preload: false });
const testFonts = [fInterTight, fManrope, fSora, fSpace, fUnbounded, fBricolage, fRaleway, fGaramond, fOswald, fAbril, fSatisfy, fNunito, fPlayfair, fPacifico]
  .map((f) => f.variable)
  .join(" ");
const headlineFont = `${tJakarta.variable} ${testFonts}`;

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
        {/* TEST: ?font=intertight|manrope|sora|space|unbounded|bricolage|raleway|garamond|oswald|abril|satisfy|nunito|playfair|pacifico prøver andre skrifter i overskriften (?font=jakarta tilbake) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var v=new URLSearchParams(location.search).get("font");if(v)sessionStorage.setItem("font",v);var s=sessionStorage.getItem("font");if(s&&s!=="jakarta")document.documentElement.dataset.font=s}catch(e){}})()`,
          }}
        />
        {/* TEST: ?farge=marine|grafitt|blekk|solv|tofarge prøver andre farger på overskriften (?farge=perle tilbake) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var v=new URLSearchParams(location.search).get("farge");if(v)sessionStorage.setItem("farge",v);var s=sessionStorage.getItem("farge");if(s&&s!=="perle")document.documentElement.dataset.tfarge=s}catch(e){}})()`,
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
