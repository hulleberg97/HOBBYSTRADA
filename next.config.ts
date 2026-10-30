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

/** Sikkerhetsheadere på alle svar. Ingen rammer fra andre nettsteder, ingen gjetting av innholdstype, begrenset henvisning. */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
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
