import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { MobileTabBar } from "@/components/MobileTabBar";

const schibsted = Schibsted_Grotesk({ variable: "--nf-schibsted", subsets: ["latin"] });
// Skriften i den store overskriften over vifta
const tJakarta = Plus_Jakarta_Sans({ variable: "--t-jakarta", subsets: ["latin"], weight: ["800"] });
const headlineFont = tJakarta.variable;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbystrada.vercel.app"),
  title: { default: "Fotballkort – kjøp og selg direkte | HOBBYSTRADA", template: "%s | HOBBYSTRADA" },
  description: "Kjøp og selg fotballkort direkte i Norge. Autografkort, relic, patch og nummererte kort fra Topps Chrome, Museum Collection og Inception.",
  openGraph: { locale: "nb_NO", siteName: "HOBBYSTRADA", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb" data-stil="pro" data-tone="1" data-meny="c" data-glans="1" data-linje="s6" data-tittel="2" data-ot="u1" data-stil2="1" className={`${schibsted.variable} ${headlineFont}`}>
      <body>
        {/* Backup: ?stil2=av viser den gamle toppen (huskes mens fanen er åpen), ?stil2=1 tilbake */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var v=new URLSearchParams(location.search).get("stil2");if(v)sessionStorage.setItem("stil2",v);if(sessionStorage.getItem("stil2")==="av")delete document.documentElement.dataset.stil2}catch(e){}})()`,
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
        <MobileTabBar />
      </body>
    </html>
  );
}
