import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LangProvider } from "@/components/LangProvider";
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({ variable: "--nf-inter", subsets: ["latin"] });
const space = Space_Grotesk({ variable: "--nf-space", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--nf-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbystrada.vercel.app"),
  title: { default: "Fotballkort – kjøp og selg direkte | HOBBYSTRADA", template: "%s | HOBBYSTRADA" },
  description: "Kjøp og selg fotballkort direkte i Norge. Autografkort, relic, patch og nummererte kort fra Topps Chrome, Museum Collection og Inception.",
  openGraph: { locale: "nb_NO", siteName: "HOBBYSTRADA", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb" className={`${inter.variable} ${space.variable} ${mono.variable}`}>
      <body>
        <LangProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CookieConsent />
        </LangProvider>
      </body>
    </html>
  );
}
