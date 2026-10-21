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
        {/* Test av linjen over vifta (?linje=2–5, ?linje=av for å skru av). Huskes mens fanen er åpen. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var q=new URLSearchParams(location.search).get("linje");sessionStorage.removeItem("linje");if(q)sessionStorage.setItem("linje2",q);var t=sessionStorage.getItem("linje2");if(t==="av")delete document.documentElement.dataset.linje;else if(t)document.documentElement.dataset.linje=t}catch(e){}})()`,
          }}
        />
        {/* Test av overskrifter (?overskrift=2 eller 3, ?overskrift=av for å skru av). Huskes mens fanen er åpen. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var u=new URLSearchParams(location.search),k=["tom","passord","luft"];if(u.get("alle"))k.forEach(function(n){sessionStorage.setItem("t-"+n,u.get("alle"))});k.forEach(function(n){var v=u.get(n);if(v)sessionStorage.setItem("t-"+n,v);if(sessionStorage.getItem("t-"+n)==="1")document.documentElement.setAttribute("data-t-"+n,"")})}catch(e){}})();(function(){try{var a=new URLSearchParams(location.search).get("tittel");if(a)sessionStorage.setItem("tittel",a);var v=sessionStorage.getItem("tittel");if(v==="av")delete document.documentElement.dataset.tittel;else if(v==="1"||v==="2"||v==="3")document.documentElement.dataset.tittel=v}catch(e){}})();(function(){try{var q=new URLSearchParams(location.search).get("overskrift");if(q)sessionStorage.setItem("overskrift",q);var t=sessionStorage.getItem("overskrift");if(t&&t!=="av")document.documentElement.dataset.overskrift=t}catch(e){}})()`,
          }}
        />
        <Header />
        <main className="t-main min-h-screen">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
