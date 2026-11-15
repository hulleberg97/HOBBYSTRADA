import type { MetadataRoute } from "next";
import { getListings } from "@/lib/listings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hobbystrada.vercel.app";
  const pages = ["", "/marked", "/annonseloft", "/selg", "/solgt", "/sporsmal", "/om-oss", "/kontakt", "/vilkar", "/salgsvilkar", "/personvern"].map(
    (p) => ({ url: base + p }),
  );
  // Eksempelannonser er ikke med: de er ikke til salgs og slettes ved lansering
  const listings = (await getListings()).filter((l) => !l.isExample).map((l) => ({ url: `${base}/annonse/${l.slug}`, lastModified: l.createdAt }));
  return [...pages, ...listings];
}
