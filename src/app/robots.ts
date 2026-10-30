import type { MetadataRoute } from "next";
import { hiddenFromSearch } from "@/lib/private";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hobbystrada.no";
  if (hiddenFromSearch()) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/account", "/api/"] }, sitemap: `${base}/sitemap.xml` };
}
