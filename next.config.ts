import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : "*.supabase.co";

/** Gamle engelske adresser sendes varig videre til de norske. */
const OLD_PATHS: [string, string][] = [
  ["/terms", "/vilkar"],
  ["/privacy", "/personvern"],
  ["/refund-policy", "/refusjon"],
  ["/cookie-policy", "/informasjonskapsler"],
  ["/about", "/om-oss"],
  ["/contact", "/kontakt"],
  ["/faq", "/sporsmal"],
  ["/sell", "/selg"],
  ["/search", "/sok"],
  ["/products", "/marked"],
  ["/cart", "/marked"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...OLD_PATHS.map(([source, destination]) => ({ source, destination, permanent: true })),
      { source: "/products/:slug", destination: "/annonse/:slug", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }],
  },
};

export default nextConfig;
