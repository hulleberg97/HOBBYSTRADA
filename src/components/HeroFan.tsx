import Image from "next/image";
import Link from "next/link";
import { CardArt } from "./CardArt";
import type { Listing } from "@/lib/types";

const POSITIONS = [
  { x: "-88%", y: "34px", r: "-16deg", z: 1 },
  { x: "-46%", y: "10px", r: "-8deg", z: 2 },
  { x: "0%", y: "0px", r: "0deg", z: 5 },
  { x: "46%", y: "10px", r: "8deg", z: 3 },
  { x: "88%", y: "34px", r: "16deg", z: 1 },
];

/** De fem nyeste annonsene: den nyeste i midten, de neste på hver side, de eldste ytterst. */
export function pickFan(list: Listing[]) {
  const [first, second, third, fourth, fifth] = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return [fourth, second, first, third, fifth].filter(Boolean) as Listing[];
}

export function HeroFan({ listings }: { listings: Listing[] }) {
  return (
    <div className="relative mx-auto h-[280px] w-full max-w-[520px] sm:h-[380px] lg:h-[440px]">
      {pickFan(listings).map((l, i) => {
        const p = POSITIONS[i];
        return (
          <Link
            key={l.slug}
            style={{ zIndex: p.z, transform: `translate(-50%, 0) translate(${p.x}, ${p.y}) rotate(${p.r})` }}
            className="group absolute left-1/2 top-2 w-[38%] origin-bottom sm:w-[36%]"
            href={`/products/${l.slug}`}
          >
            <div className="transition-transform duration-300 ease-out group-hover:-translate-y-4">
              <div className="relative w-full rounded-[12px] border border-white/60 bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(226,232,240,0.78)_45%,rgba(255,255,255,0.9))] p-[5%] shadow-[0_30px_60px_-25px_rgba(2,6,23,0.75)]">
                <div className="rounded-[4px] border-2 border-[#c8102e] bg-white px-[6%] py-[4%] text-[#0b1726]">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 truncate text-[clamp(6px,0.7vw,9px)] font-bold uppercase leading-tight tracking-wide">{l.set}</p>
                    <p className="shrink-0 text-[clamp(6px,0.7vw,9px)] font-bold uppercase leading-tight">{l.cardNumber ? `#${l.cardNumber}` : ""}</p>
                  </div>
                  <div className="mt-[3%] flex items-end justify-between gap-2">
                    <p className="min-w-0 truncate text-[clamp(7px,0.8vw,10px)] font-bold uppercase leading-tight">{l.player}</p>
                    <p className="shrink-0 text-[clamp(7px,0.8vw,10px)] font-bold uppercase leading-tight">{l.types[0]}</p>
                  </div>
                </div>
                <div className="mt-[5%] aspect-[5/7] overflow-hidden rounded-[4px] bg-[#0d2238] ring-1 ring-black/10">
                  {l.image ? (
                    <Image
                      alt=""
                      src={l.image}
                      width={400}
                      height={560}
                      priority
                      sizes="(max-width: 640px) 38vw, 190px"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <CardArt listing={l} square />
                  )}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
