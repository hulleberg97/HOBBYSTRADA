import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

const schibsted = Schibsted_Grotesk({ variable: "--nf-schibsted", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbystrada.vercel.app"),
  title: { default: "Fotballkort – kjøp og selg direkte | HOBBYSTRADA", template: "%s | HOBBYSTRADA" },
  description: "Kjøp og selg fotballkort direkte i Norge. Autografkort, relic, patch og nummererte kort fra Topps Chrome, Museum Collection og Inception.",
  openGraph: { locale: "nb_NO", siteName: "HOBBYSTRADA", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb" data-stil="pro" data-tone="1" data-meny="c" data-glans="1" data-linje="s6" data-tittel="2" className={schibsted.variable}>
      <body>
        {/* Test av mer dybde i det lyse designet (?dybde=1, ?dybde=av). Huskes mens fanen er åpen. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var v=new URLSearchParams(location.search).get("dybde");if(v)sessionStorage.setItem("dybde",v);if(sessionStorage.getItem("dybde")==="1")document.documentElement.dataset.dybde="1"}catch(e){}})()`,
          }}
        />
        {/* Test av overskriften (?ot=1–4, ?ot=av). Huskes mens fanen er åpen. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var v=new URLSearchParams(location.search).get("ot");if(v)sessionStorage.setItem("ot",v);var m=sessionStorage.getItem("ot");if(/^[1-7]$/.test(m||""))document.documentElement.dataset.ot=m}catch(e){}})()`,
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
