import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

const W = 1080, H = 1350;
const pub = (f: string) => path.join(process.cwd(), "public", f);

/** Henter annonsebildet og gjør det om til en data-URI, så rendereren slipper å hente det selv. */
export async function imageDataUri(url: string | null) {
  if (!url) return null;
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const type = r.headers.get("content-type") ?? "image/jpeg";
    return `data:${type};base64,${Buffer.from(await r.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}

/** Instagram-bilde (4:5) av en annonse, i samme stil som nettsiden. Brukes fra admin. image er en data-URI. */
export async function igImage({ player, set, price, image }: { player: string; set: string; price: string; image: string | null }) {
  const [fraunces, inter500, inter800, logo] = await Promise.all([
    readFile(pub("fonts/Fraunces-700.woff")),
    readFile(pub("fonts/Inter-500.otf")),
    readFile(pub("fonts/Inter-800.otf")),
    readFile(pub("brand/logo-hvit.svg"), "utf8"),
  ]);
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: W, height: H, display: "flex", flexDirection: "column", alignItems: "center", background: "#0b1426", color: "#f7f3ea", fontFamily: "Inter", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 38%, rgba(207,166,83,0.28), rgba(11,20,38,0) 58%)" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" style={{ height: 40, marginTop: 64 }} />
        <div style={{ display: "flex", marginTop: 86, width: 600, height: 840, borderRadius: 26, overflow: "hidden", border: "2px solid rgba(207,166,83,0.5)", boxShadow: "0 60px 120px -40px rgba(0,0,0,0.9)", background: "#0d2238" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {image && <img src={image} alt="" width={600} height={840} style={{ width: 600, height: 840, objectFit: "cover" }} />}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 44, padding: "0 80px", textAlign: "center" }}>
          <div style={{ fontFamily: "Fraunces", fontSize: 54, lineHeight: 1.05, letterSpacing: -1 }}>{player}</div>
          <div style={{ marginTop: 14, fontSize: 26, color: "rgba(247,243,234,0.72)", fontWeight: 500 }}>{set}</div>
          <div style={{ marginTop: 22, padding: "14px 30px", borderRadius: 999, background: "#cfa653", color: "#0b1426", fontWeight: 800, fontSize: 30 }}>{price}</div>
        </div>
        <div style={{ position: "absolute", bottom: 40, fontSize: 22, letterSpacing: 3, color: "rgba(247,243,234,0.6)", fontWeight: 600 }}>HOBBYSTRADA.NO</div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 700, style: "normal" },
        { name: "Inter", data: inter500, weight: 500, style: "normal" },
        { name: "Inter", data: inter800, weight: 800, style: "normal" },
      ],
    },
  );
}
