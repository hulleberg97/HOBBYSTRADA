import type { MetadataRoute } from "next";
import { getListings } from "@/lib/listings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbystrada.vercel.app";
  const pages = ["", "/products", "/annonseloft", "/sell", "/faq", "/about", "/contact"].map((p) => ({ url: base + p }));
  const listings = (await getListings()).map((l) => ({ url: `${base}/products/${l.slug}`, lastModified: l.createdAt }));
  return [...pages, ...listings];
}
