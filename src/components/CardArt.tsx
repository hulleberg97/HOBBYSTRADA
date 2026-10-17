import { initials } from "@/lib/format";
import type { Listing } from "@/lib/types";

/** Tegnet kort som vises når selgeren ikke har lastet opp bilde. */
export function CardArt({ listing, square = false }: { listing: Listing; square?: boolean }) {
  const isAuto = listing.types.includes("Autograf");
  const hasSwatch = listing.types.includes("Patch") || listing.types.includes("Relic");
  const isRookie = listing.types.includes("Rookie");
  const label = listing.types.filter((t) => t !== "Rookie").join(" / ");
  const corner = listing.cardNumber ?? listing.numbered ?? "RAW";
  return (
    <div
      className={`relative flex h-full w-full flex-col rounded-[6px] bg-[#0d2238] p-[6%] text-white ${square ? "!rounded-none" : ""}`}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between rounded-[2px] bg-[#f4f3ee] px-2 py-1 text-[#0d2238]">
        <span className="font-mono-data text-[9px] font-semibold uppercase tracking-wider">{listing.producer}</span>
        <span className="font-mono-data text-[9px] font-semibold uppercase tracking-wider">{corner}</span>
      </div>
      <div
        className={`relative mt-[6%] flex flex-1 flex-col justify-between overflow-hidden rounded-[2px] border border-white/15 p-[8%] ${isAuto ? "bg-[#122c4a]" : "bg-[#0f2a40]"}`}
      >
        {isAuto && <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-[#d8b264]"></div>}
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono-data text-[8px] uppercase tracking-[0.14em] text-[#d8b264]">{label}</p>
          {isRookie && (
            <span className="rounded-[2px] border border-[#d8b264]/70 px-1 font-mono-data text-[8px] font-semibold text-[#d8b264]">
              RC
            </span>
          )}
        </div>
        <div className="flex items-center gap-[8%]">
          <span className="font-heading text-[clamp(1.75rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em] text-white">
            {initials(listing.player)}
          </span>
          {hasSwatch && (
            <span className="h-[clamp(1.25rem,3.5vw,2.75rem)] w-[clamp(1.25rem,3.5vw,2.75rem)] shrink-0 rounded-[3px] border border-white/25 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.18)_0_2px,transparent_2px_5px)]"></span>
          )}
        </div>
        <div className="border-t border-white/15 pt-[6%]">
          {isAuto && (
            <svg viewBox="0 0 120 20" className="mb-1 h-3 w-2/3 text-[#d8b264]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M2 14c8-10 12-10 14-4s4 6 9-2 7-6 8 0 5 6 11-1 8-5 10 1 6 4 12-3 9-4 14 1 10 3 16-3" />
            </svg>
          )}
          <p className="font-heading text-sm font-semibold leading-tight">{listing.player}</p>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <p className="line-clamp-1 font-mono-data text-[9px] uppercase tracking-wide text-white/55">{listing.set}</p>
            {listing.numbered && <span className="shrink-0 font-mono-data text-[9px] text-[#d8b264]">{listing.numbered}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
