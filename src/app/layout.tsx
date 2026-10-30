import type { Metadata } from "next";
import { Fraunces, Schibsted_Grotesk, Sora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

// Brødtekst og overskrifter (Schibsted), den store overskriften på forsiden (Fraunces) og tittelen i magasinvisningen (Sora)
const schibsted = Schibsted_Grotesk({ variable: "--nf-schibsted", subsets: ["latin"] });
const tSora = Sora({ variable: "--t-sora", subsets: ["latin"], weight: ["800"] });
const fFraunces = Fraunces({ variable: "--f-fraunces", subsets: ["latin"], weight: ["700"], style: ["normal", "italic"] });
const headlineFont = `${tSora.variable} ${fFraunces.variable}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hobbystrada.no"),
  title: { default: "Fotballkort – kjøp og selg direkte | HOBBYSTRADA", template: "%s | HOBBYSTRADA" },
  description: "Kjøp og selg fotballkort direkte i Norge. Autografkort, relic, patch og nummererte kort fra Topps Chrome, Museum Collection og Inception.",
  openGraph: { locale: "nb_NO", siteName: "HOBBYSTRADA", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb" data-stil="pro" data-tone="1" data-meny="c" data-glans="1" data-linje="s6" data-tittel="2" data-ot="u1" data-vis="magasin" data-stort="ren" data-tittel2="d" data-skrift="fraunces" className={`${schibsted.variable} ${headlineFont}`}>
      <body>
        {/* Norske feilmeldinger i skjemaer, uansett språk i nettleseren */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.addEventListener("invalid",function(e){var f=e.target,v=f.validity,m="";if(v.valueMissing)m=f.type==="checkbox"?"Kryss av her for å gå videre.":f.tagName==="SELECT"?"Velg et alternativ.":"Fyll ut dette feltet.";else if(v.typeMismatch&&f.type==="email")m="Skriv inn en gyldig e-postadresse.";else if(v.tooShort)m="Bruk minst "+f.minLength+" tegn.";else if(v.rangeUnderflow||v.rangeOverflow)m="Verdien er utenfor det som er tillatt.";f.setCustomValidity(m)},true);document.addEventListener("input",function(e){if(e.target.setCustomValidity)e.target.setCustomValidity("")},true);document.addEventListener("change",function(e){if(e.target.setCustomValidity)e.target.setCustomValidity("")},true)}catch(e){}})()`,
          }}
        />
        <a href="#innhold" className="sr-only z-[100] rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
          Hopp til innhold
        </a>
        <Header />
        <main id="innhold" className="site-main">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
