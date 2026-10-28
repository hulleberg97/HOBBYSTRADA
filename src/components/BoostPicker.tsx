"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpToLineIcon, CheckIcon, CrownIcon, SparklesIcon } from "lucide-react";
import { BOOSTS, BOOST_PERKS, type BoostKey } from "@/lib/boosts";
import { formatPrice, initials } from "@/lib/format";
import { useUser } from "./useUser";

const PLANS: { key: BoostKey; Icon: typeof SparklesIcon }[] = [
  { key: "top", Icon: ArrowUpToLineIcon },
  { key: "featured", Icon: SparklesIcon },
  { key: "frontpage", Icon: CrownIcon },
];

/** Ledige plasser for toppannonser i kortraden, regnet ut på serveren. */
export type FrontpageAvailability = { soldOut: boolean; nextFreeText: string; slots: number };

type Mine = { slug: string; title: string; price: number; image: string | null; boost: string | null };

export function BoostPicker({ frontpage }: { frontpage: FrontpageAvailability }) {
  const params = useSearchParams();
  const [listing, setListing] = useState(params.get("annonse") ?? "");
  const [plan, setPlan] = useState<BoostKey | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  // Bekreftelsene starter alltid tomme. Verdien er tidspunktet kunden krysset av, og lagres med bestillingen.
  const [consent, setConsent] = useState<string | null>(null);
  const [consentLoss, setConsentLoss] = useState<string | null>(null);
  // Annonsene brukeren kan løfte. undefined mens de lastes, null hvis ikke innlogget.
  const [hentet, setMine] = useState<Mine[] | null>();

  const user = useUser();
  useEffect(() => {
    // Annonsene hentes bare for innloggede, så serveren ikke får en unødvendig forespørsel fra andre
    if (!user) return;
    fetch("/api/listings/mine", { cache: "no-store" })
      .then((r) => (r.status === 401 ? { listings: null } : r.json()))
      .then((d) => setMine(d.listings))
      .catch(() => setMine([]));
  }, [user]);
  // Ikke innlogget: null (vis «logg inn»). Innlogget: det som er hentet (undefined mens det lastes).
  const mine = user === null ? null : hentet;

  const chosen = plan ? BOOSTS[plan] : null;
  const chosenListing = mine?.find((l) => l.slug === listing) ?? null;
  const ready = Boolean(listing.trim() && plan && consent && consentLoss);

  const pick = (key: BoostKey) => {
    if (key === "frontpage" && frontpage.soldOut) return;
    setPlan(key);
    setMsg(null);
    document.getElementById("kasse")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const order = async () => {
    if (!ready || !plan) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/boost", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ listing, plan, consent: true, consentLoss: true, consentAt: consent, consentLossAt: consentLoss }),
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
      setBusy(false);
    }
  };

  const box = "mx-auto max-w-2xl rounded-3xl bg-white p-5 ring-1 ring-slate-300/70 sm:p-6";
  const check = "mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]";

  return (
    <div>
      {/* Steg 1: annonse */}
      <div className={box}>
        <p id="boost-listing" className="text-sm font-semibold text-slate-900">
          1. Hvilken annonse vil du løfte?
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
          <ul
            role="radiogroup"
            aria-labelledby="boost-listing"
            className="mt-3 grid max-h-[460px] grid-cols-3 gap-2 overflow-y-auto overflow-x-hidden p-1 sm:grid-cols-4 sm:gap-3"
          >
            {mine.map((l) => (
              <li key={l.slug} className="min-w-0">
                <button
                  type="button"
                  role="radio"
                  aria-checked={listing === l.slug}
                  onClick={() => setListing(l.slug)}
                  className="group relative flex h-full w-full flex-col rounded-2xl bg-white p-1.5 text-left ring-1 ring-slate-300/70 transition hover:ring-slate-500 aria-checked:ring-2 aria-checked:ring-primary"
                >
                  <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
                    {l.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={l.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-primary font-heading text-xl font-semibold text-white">
                        {initials(l.title)}
                      </span>
                    )}
                    {l.boost && (
                      <span className="absolute bottom-1.5 left-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                        {l.boost}
                      </span>
                    )}
                    <span
                      aria-hidden="true"
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 ring-1 ring-slate-300 group-aria-checked:bg-primary group-aria-checked:ring-primary"
                    >
                      {listing === l.slug && <CheckIcon className="h-4 w-4 text-white" />}
                    </span>
                  </span>
                  <span className="mt-1.5 line-clamp-2 px-0.5 text-[12px] font-semibold leading-snug text-slate-900">{l.title}</span>
                  <span className="mt-auto px-1 pb-1 pt-1 text-xs text-slate-500">{formatPrice(l.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Steg 2: pakke */}
      <p className="mx-auto mt-10 max-w-2xl text-sm font-semibold text-slate-900">2. Velg pakke</p>
      <div role="radiogroup" aria-label="Pakke" className="mt-4 grid gap-5 md:grid-cols-3">
        {PLANS.map(({ key, Icon }) => {
          const b = BOOSTS[key];
          const soldOut = key === "frontpage" && frontpage.soldOut;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={plan === key}
              aria-disabled={soldOut || undefined}
              onClick={() => pick(key)}
              className="plan-card relative flex flex-col rounded-3xl bg-white p-6 text-left ring-1 ring-slate-300/70 transition duration-200 hover:-translate-y-1 aria-checked:ring-2 aria-checked:ring-primary aria-disabled:cursor-not-allowed aria-disabled:opacity-60 aria-disabled:hover:translate-y-0"
            >
              <span className="plan-icon flex h-11 w-11 items-center justify-center rounded-full bg-primary text-accent">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="plan-title mt-5 font-heading text-xl font-semibold tracking-tight">{b.name}</span>
              <span className="mt-1 font-mono-data text-xs uppercase tracking-wider text-muted-foreground">{b.days} dager</span>
              <span className="plan-price mt-5 font-heading text-4xl font-semibold tracking-tight">{formatPrice(b.price)}</span>
              <ul className="mb-8 mt-6 space-y-2.5 text-sm">
                {BOOST_PERKS[key].map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#9a7420]" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
              <span
                className={`mt-auto flex h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold ${
                  soldOut ? "bg-slate-100 text-slate-600" : plan === key ? "bg-primary text-primary-foreground" : "bg-slate-100 text-slate-900"
                }`}
              >
                {soldOut ? `Utsolgt – ledig fra ${frontpage.nextFreeText}` : plan === key ? "Valgt" : "Velg"}
              </span>
            </button>
          );
        })}
      </div>
      {frontpage.soldOut && (
        <p className="mx-auto mt-3 max-w-2xl text-xs text-muted-foreground">
          Alle {frontpage.slots} plassene for toppannonser i kortraden er tatt. Neste plass blir ledig {frontpage.nextFreeText}.
        </p>
      )}

      {/* Steg 3: kassen */}
      <div id="kasse" className={`${box} mt-10 scroll-mt-24`}>
        <p className="text-sm font-semibold text-slate-900">3. Bekreft og betal</p>
        <p className="mt-3 text-xs text-muted-foreground">
          Du har 14 dagers angrerett. For at løftet skal starte før fristen er ute, må du be om det og bekrefte at du vet hva det betyr.
        </p>
        <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
          <input type="checkbox" autoComplete="off" checked={Boolean(consent)} onChange={(e) => setConsent(e.target.checked ? new Date().toISOString() : null)} className={check} />
          <span>Jeg ber om at annonseløftet starter med en gang betalingen er gjennomført, før angrefristen på 14 dager er ute.</span>
        </label>
        <label className="mt-2 flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
          <input type="checkbox" autoComplete="off" checked={Boolean(consentLoss)} onChange={(e) => setConsentLoss(e.target.checked ? new Date().toISOString() : null)} className={check} />
          <span>
            Jeg forstår at angreretten går tapt når løftperioden er over, og at jeg betaler for dagene som er brukt hvis jeg angrer før det.{" "}
            <Link href="/salgsvilkar" target="_blank" className="tap font-medium text-foreground underline underline-offset-2">
              Salgsvilkår
            </Link>{" "}
            ·{" "}
            <Link href="/angreskjema" target="_blank" className="tap font-medium text-foreground underline underline-offset-2">
              Angreskjema
            </Link>
          </span>
        </label>
        <dl className="mt-5 space-y-1.5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <div>
            <dt className="inline font-semibold text-slate-900">Du bestiller: </dt>
            <dd className="inline">
              {chosen ? `${chosen.name} i ${chosen.days} dager` : "velg pakke over"}
              {listing.trim() ? ` for annonsen «${chosenListing?.title ?? listing}»` : ", og velg annonse øverst"}
            </dd>
          </div>
          <div>
            <dt className="inline font-semibold text-slate-900">Pris: </dt>
            <dd className="inline">
              {chosen ? `${chosen.price} kr. ` : "– kr. "}Prisen er uten merverdiavgift fordi foretaket ikke er merverdiavgiftsregistrert. Det kommer ingen andre gebyrer i
              tillegg.
            </dd>
          </div>
          <div>
            <dt className="inline font-semibold text-slate-900">Varighet: </dt>
            <dd className="inline">Engangskjøp som ikke fornyes automatisk.</dd>
          </div>
        </dl>
        <button
          type="button"
          disabled={!ready || busy}
          onClick={order}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Et øyeblikk …" : chosen ? `Bestill og betal ${chosen.price} kr med Vipps` : "Bestill og betal med Vipps"}
        </button>
        {!ready && !busy && (
          <p className="mt-2 text-center text-xs text-muted-foreground">Knappen åpnes når annonse og pakke er valgt, og begge boksene er krysset av.</p>
        )}
        {msg && (
          <p role="status" className={`mt-3 rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-destructive/5 text-destructive"}`}>
            {msg.text}
          </p>
        )}
      </div>
    </div>
  );
}
