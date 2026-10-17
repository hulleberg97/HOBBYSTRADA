"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowUpToLineIcon, CheckIcon, CrownIcon, SparklesIcon } from "lucide-react";
import { BOOSTS, type BoostKey } from "@/lib/boosts";
import { formatPrice } from "@/lib/format";

const PLANS: { key: BoostKey; Icon: typeof SparklesIcon; perks: string[]; popular?: boolean }[] = [
  { key: "top", Icon: ArrowUpToLineIcon, perks: ["Først i markedslisten", "Før alle nye annonser", "Varer i 3 dager"] },
  { key: "featured", Icon: SparklesIcon, perks: ["Gullmerket «Fremhevet»", "Egen seksjon på forsiden", "Først i markedet", "Varer i 7 dager"], popular: true },
  { key: "frontpage", Icon: CrownIcon, perks: ["Alt i Fremhevet", "Fast plass på forsiden", "Maksimal synlighet", "Varer i 30 dager"] },
];

export function BoostPicker() {
  const params = useSearchParams();
  const [listing, setListing] = useState(params.get("annonse") ?? "");
  const [busy, setBusy] = useState<BoostKey | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const choose = async (key: BoostKey) => {
    if (!listing.trim()) {
      setMsg({ ok: false, text: "Skriv inn lenken til annonsen eller tittelen først." });
      document.getElementById("boost-listing")?.focus();
      return;
    }
    setBusy(key);
    setMsg(null);
    try {
      const res = await fetch("/api/boost", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ listing, plan: key }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Noe gikk galt. Prøv igjen.");
      setMsg({ ok: true, text: data.message });
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-2xl rounded-md border border-border bg-white p-5 sm:p-6">
        <label htmlFor="boost-listing" className="block font-mono-data text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Hvilken annonse vil du løfte?
        </label>
        <input
          id="boost-listing"
          maxLength={300}
          placeholder="Lim inn lenken til annonsen, eller skriv tittelen"
          className="mt-2 h-12 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30"
          value={listing}
          onChange={(e) => setListing(e.target.value)}
        />
        <p className="mt-2 text-xs text-muted-foreground">Løftet aktiveres på annonsen etter at betalingen er gjennomført.</p>
        {msg && (
          <p role="status" className={`mt-3 rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-destructive/5 text-destructive"}`}>
            {msg.text}
          </p>
        )}
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {PLANS.map(({ key, Icon, perks, popular }) => {
          const b = BOOSTS[key];
          return (
            <div
              key={key}
              data-popular={popular ? "true" : undefined}
              className="relative flex flex-col rounded-md border border-border bg-white p-6 data-[popular=true]:border-accent data-[popular=true]:ring-1 data-[popular=true]:ring-accent"
            >
              {popular && (
                <span className="absolute -top-3 left-6 rounded-md bg-accent px-2 py-1 font-mono-data text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                  Mest valgt
                </span>
              )}
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-accent">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold tracking-tight">{b.name}</h3>
              <p className="mt-1 font-mono-data text-xs uppercase tracking-wider text-muted-foreground">{b.days} dager</p>
              <p className="mt-5 font-heading text-4xl font-semibold tracking-tight">{formatPrice(b.price)}</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {perks.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#9a7420]" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => choose(key)}
                className="mt-8 flex h-12 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
              >
                {busy === key ? "Et øyeblikk …" : "Velg løft"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
