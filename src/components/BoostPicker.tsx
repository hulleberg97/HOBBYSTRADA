"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpToLineIcon, CheckIcon, CrownIcon, SparklesIcon } from "lucide-react";
import { CardThumb } from "./CardThumb";
import { BOOSTS, type BoostKey } from "@/lib/boosts";
import { formatPrice } from "@/lib/format";

const PLANS: { key: BoostKey; Icon: typeof SparklesIcon; perks: string[]; popular?: boolean }[] = [
  { key: "top", Icon: ArrowUpToLineIcon, perks: ["Over alle vanlige annonser i markedet", "Selg raskere uten å bruke mye", "Varer i 3 dager"] },
  {
    key: "featured",
    Icon: SparklesIcon,
    perks: ["Gullmerke og gullramme", "Vises under «Utvalgte kort» på forsiden", "Foran Topp av listen og vanlige annonser", "Varer i 7 dager"],
    popular: true,
  },
  { key: "frontpage", Icon: CrownIcon, perks: ["Alt i Fremhevet", "Plass i kortvifta på forsiden", "Aller først i markedet", "Varer i 30 dager"] },
];

export function BoostPicker() {
  const params = useSearchParams();
  const [listing, setListing] = useState(params.get("annonse") ?? "");
  const [busy, setBusy] = useState<BoostKey | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [consent, setConsent] = useState(false);
  // Annonsene brukeren kan løfte. undefined mens de lastes, null hvis ikke innlogget.
  const [mine, setMine] = useState<{ slug: string; title: string; price: number; image: string | null; boost: string | null }[] | null>();

  useEffect(() => {
    fetch("/api/listings/mine", { cache: "no-store" })
      .then((r) => (r.status === 401 ? { listings: null } : r.json()))
      .then((d) => setMine(d.listings))
      .catch(() => setMine([]));
  }, []);

  const choose = async (key: BoostKey) => {
    if (!listing.trim()) {
      setMsg({ ok: false, text: "Velg hvilken annonse du vil løfte først." });
      document.getElementById("boost-listing")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!consent) {
      setMsg({ ok: false, text: "Bekreft at løftet kan starte med en gang før du går videre." });
      return;
    }
    setBusy(key);
    setMsg(null);
    try {
      const res = await fetch("/api/boost", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ listing, plan: key, consent }),
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
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-5 ring-1 ring-slate-300/70 sm:p-6">
        <p id="boost-listing" className="text-sm font-semibold text-slate-900">
          Hvilken annonse vil du løfte?
        </p>
        {mine === undefined ? (
          <p className="mt-3 text-sm text-slate-500">Henter annonsene dine …</p>
        ) : mine === null ? (
          <p className="mt-3 text-sm text-slate-600">
            <Link href="/auth/login?next=/annonseloft" className="font-semibold text-slate-900 underline underline-offset-2">
              Logg inn
            </Link>{" "}
            for å velge en av annonsene dine.
          </p>
        ) : mine.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            Du har ingen aktive annonser ennå.{" "}
            <Link href="/sell" className="font-semibold text-slate-900 underline underline-offset-2">
              Legg ut et kort
            </Link>
          </p>
        ) : (
          <ul role="radiogroup" aria-labelledby="boost-listing" className="mt-3 grid max-h-[340px] grid-cols-[minmax(0,1fr)] gap-2 overflow-y-auto overflow-x-hidden p-1">
            {mine.map((l) => (
              <li key={l.slug}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={listing === l.slug}
                  onClick={() => setListing(l.slug)}
                  className="flex w-full items-center gap-3 rounded-2xl p-2 pr-4 text-left ring-1 ring-slate-300/70 transition hover:ring-slate-500 aria-checked:ring-2 aria-checked:ring-primary"
                >
                  <CardThumb image={l.image} title={l.title} />
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">{l.title}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {formatPrice(l.price)}
                      {l.boost && <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 font-semibold text-[#8a6a24]">{l.boost}</span>}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1 ring-slate-400 [[aria-checked=true]_&]:bg-primary [[aria-checked=true]_&]:ring-primary"
                  >
                    {listing === l.slug && <CheckIcon className="h-3.5 w-3.5 text-white" />}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-muted-foreground">Løftet aktiveres på annonsen etter at betalingen er gjennomført.</p>
        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]"
          />
          <span>
            Jeg ber om at løftet starter med en gang etter betaling, og forstår at angreretten da faller bort.{" "}
            <Link href="/salgsvilkar" target="_blank" className="font-medium text-foreground underline underline-offset-2">
              Salgsvilkår
            </Link>
          </span>
        </label>
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
              className="relative flex flex-col rounded-3xl bg-white p-6 ring-1 ring-slate-300/70 data-[popular=true]:ring-2 data-[popular=true]:ring-accent"
            >
              {popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-accent px-2 py-1 font-mono-data text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                  Mest valgt
                </span>
              )}
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-accent">
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
                className="mt-8 flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
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
