import type { Metadata } from "next";
import { Anton, Fraunces, Inter, Schibsted_Grotesk, Sora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { BunnMeny } from "@/components/BunnMeny";
import { hiddenFromSearch } from "@/lib/private";

// Brødtekst og overskrifter (Schibsted), den store overskriften på forsiden (Fraunces) og tittelen i magasinvisningen (Sora)
const schibsted = Schibsted_Grotesk({ variable: "--nf-schibsted", subsets: ["latin"] });
const tSora = Sora({ variable: "--t-sora", subsets: ["latin"], weight: ["800"] });
const fFraunces = Fraunces({ variable: "--f-fraunces", subsets: ["latin"], weight: ["700"], style: ["normal", "italic"] });
// Utkast til telefonforsiden (MobilForside, data-tekst): Inter er den nærmeste frie skriften til Helvetica Now, og Anton den nærmeste til
// en smal, ekstra fet Futura. De forhåndslastes ikke, så andre sider ikke henter dem.
const fInter = Inter({ variable: "--f-inter", subsets: ["latin"], preload: false });
const fAnton = Anton({ variable: "--f-anton", subsets: ["latin"], weight: "400", preload: false });
const headlineFont = `${tSora.variable} ${fFraunces.variable} ${fInter.variable} ${fAnton.variable}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hobbystrada.no"),
  title: { default: "Fotballkort – kjøp og selg direkte | HOBBYSTRADA", template: "%s | HOBBYSTRADA" },
  description: "HOBBYSTRADA er en norsk markedsplass for fotballkort. Samlere kjøper og selger direkte av hverandre. Logg inn med Vipps og legg ut gratis.",
  openGraph: { locale: "nb_NO", siteName: "HOBBYSTRADA", type: "website" },
  // Før lansering: ingen indeksering, også når passordet er tatt bort for gjennomgang
  ...(hiddenFromSearch() ? { robots: { index: false, follow: false } } : {}),
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
        <BunnMeny />
        <CookieConsent />
      </body>
    </html>
  );
}
