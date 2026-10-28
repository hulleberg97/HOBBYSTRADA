import type { MetadataRoute } from "next";
import { getListings } from "@/lib/listings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbystrada.vercel.app";
  const pages = ["", "/marked", "/annonseloft", "/selg", "/solgt", "/sporsmal", "/om-oss", "/kontakt", "/vilkar", "/salgsvilkar", "/personvern", "/refusjon"].map(
    (p) => ({ url: base + p }),
  );
  const listings = (await getListings()).map((l) => ({ url: `${base}/annonse/${l.slug}`, lastModified: l.createdAt }));
  return [...pages, ...listings];
}
