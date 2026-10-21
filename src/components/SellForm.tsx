"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, CameraIcon, CheckIcon, ImagePlusIcon, XIcon } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { CLUBS, LEAGUES } from "@/lib/clubs";
import { CONDITIONS, conditionLabel } from "@/lib/conditions";
import { btnPrimary, btnSecondary } from "./ui";
import { resizeImage } from "@/lib/resize";

const label = "mb-1.5 block font-mono-data text-[11px] uppercase tracking-[0.14em] text-muted-foreground";
const field =
  "h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30";

const TYPES = ["Autograf", "Patch / relic", "Rookie", "Nummerert", "Base", "Annet"];
const GRADERS = ["Ugradert (raw)", "PSA", "BGS", "SGC", "CGC", "Annet"];
const MAX_MB = 10;

type Photo = { file: File; url: string };

function Step({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary font-mono-data text-xs font-semibold text-primary-foreground">{n}</span>
      <h2 className="font-heading text-lg font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

function PhotoSlot({
  title,
  hint,
  photo,
  onPick,
  onClear,
  required,
}: {
  title: string;
  hint: string;
  photo: Photo | null;
  onPick: (f: File) => void;
  onClear: () => void;
  required?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div>
      <p className={label}>
        {title}
        {required && " *"}
      </p>
      <div className="relative aspect-[5/7] overflow-hidden rounded-xl border border-border bg-muted/50">
        {photo ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={onClear}
              aria-label={`Fjern ${title.toLowerCase()}`}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow"
            >
              <XIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-transparent p-3 text-center transition hover:border-foreground/20 hover:bg-muted"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CameraIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold">Legg til {title.toLowerCase()}</span>
            <span className="text-xs leading-snug text-muted-foreground">{hint}</span>
          </button>
        )}
        <input
          ref={input}
          type="file"
          accept="image/*"
          className="sr-only"
          tabIndex={-1}
          aria-label={`Velg ${title.toLowerCase()}`}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

export function SellForm({ user }: { user: { name: string; email: string; location?: string } | null }) {
  const [v, setV] = useState({
    player: "",
    set: "",
    season: "",
    club: "",
    league: "",
    code: "",
    num: "",
    grader: "Ugradert (raw)",
    grade: "",
    cond: "",
    price: "",
  });
  const [types, setTypes] = useState<string[]>([]);
  const toggleType = (t: string) => setTypes(types.includes(t) ? types.filter((x) => x !== t) : [...types, t]);
  const [front, setFront] = useState<Photo | null>(null);
  const [back, setBack] = useState<Photo | null>(null);
  const [extra, setExtra] = useState<Photo[]>([]);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const extraInput = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const steps = useRef<(HTMLFieldSetElement | null)[]>([]);
  const top = useRef<HTMLDivElement>(null);
  const [slug, setSlug] = useState("");

  // Sjekker steget før man går videre, så feil vises der feltet er
  const next = () => {
    if (step === 0 && !front) {
      setError("Legg til et bilde av forsiden av kortet.");
      return;
    }
    if (step === 1 && !types.length) {
      setError("Velg minst én type, for eksempel Autograf eller Patch.");
      return;
    }
    if (!steps.current[step]?.reportValidity()) return;
    setError("");
    setStep(step + 1);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const prev = () => {
    setError("");
    setStep(step - 1);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => () => [front, back, ...extra].forEach((p) => p && URL.revokeObjectURL(p.url)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setV({ ...v, [k]: k === "price" ? e.target.value.replace(/\D/g, "") : e.target.value });
  const photo = (f: File): Photo | null => {
    if (!f.type.startsWith("image/")) return null;
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`Bildet er større enn ${MAX_MB} MB. Velg et mindre bilde.`);
      return null;
    }
    setError("");
    return { file: f, url: URL.createObjectURL(f) };
  };

  const count = [front, back].filter(Boolean).length + extra.length;
  const typeLabel = types.length ? TYPES.filter((t) => types.includes(t)).join(" + ") : "—";
  const title = `${v.player || "Spillernavn"} – ${v.set || "Sett"}`;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!front) return;
    if (!types.length) {
      setError("Velg minst én type, for eksempel Autograf eller Patch.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    setState("sending");
    setError("");
    try {
      fd.append("front", await resizeImage(front.file));
      if (back) fd.append("back", await resizeImage(back.file));
      for (const p of extra) fd.append("extra", await resizeImage(p.file));
      const res = await fetch("/api/listings", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Annonsen ble ikke sendt. Prøv igjen.");
      setSlug(data.slug ?? "");
      setState("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center ring-1 ring-slate-300/70">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
          <CheckIcon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-heading text-2xl font-bold tracking-tight text-slate-950">Takk! Annonsen er sendt inn</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Vi går raskt gjennom den, og den dukker opp i markedet så snart den er godkjent. Du ser statusen på Min side.
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Link href="/account" className={btnPrimary}>
            Se annonsene mine
          </Link>
          <button type="button" onClick={() => location.reload()} className={btnSecondary}>
            Legg ut et kort til
          </button>
        </div>
        {slug && (
          <Link
            href={`/annonseloft?annonse=${slug}`}
            className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-amber-50 px-5 py-4 text-left ring-1 ring-inset ring-accent/40 transition hover:ring-accent"
          >
            <span>
              <span className="block text-sm font-semibold text-slate-900">Vil du selge raskere?</span>
              <span className="block text-xs text-slate-600">Løft annonsen til toppen av markedet med gullmerke.</span>
            </span>
            <span className="shrink-0 rounded-full bg-accent px-3.5 py-2 text-xs font-semibold text-accent-foreground">Løft annonsen</span>
          </Link>
        )}
      </div>
    );
  }

  return (
    <form className="grid scroll-mt-28 gap-8 lg:grid-cols-[1fr_340px] lg:items-start" onSubmit={submit}>
      <div ref={top} className="scroll-mt-28 space-y-6">
        <ol className="grid grid-cols-4 gap-2" aria-label="Steg">
          {["Bilder", "Om kortet", "Tilstand og pris", "Send inn"].map((label, i) => (
            <li key={label} aria-current={i === step ? "step" : undefined}>
              <span
                data-done={i <= step ? "true" : undefined}
                className="block h-1.5 rounded-full bg-slate-300/70 transition-colors data-[done=true]:bg-primary"
              ></span>
              <span className="mt-1.5 block truncate text-[11px] font-semibold text-slate-500 sm:text-xs [[aria-current=step]_&]:text-slate-950">
                {i + 1}. <span className="sm:hidden">{label === "Tilstand og pris" ? "Pris" : label}</span>
                <span className="hidden sm:inline">{label}</span>
              </span>
            </li>
          ))}
        </ol>
        <fieldset
          ref={(el) => {
            steps.current[0] = el;
          }}
          hidden={step !== 0}
          className="rounded-3xl bg-white p-5 ring-1 ring-slate-300/70 sm:p-7"
        >
          <legend className="sr-only">Bilder og beskrivelse</legend>
          <Step n="01" title="Bilder og beskrivelse" />
          <div className="grid gap-6">
            <div>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold">Bilder av kortet</p>
                <p className="font-mono-data text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {count} {count === 1 ? "bilde" : "bilder"} valgt
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:max-w-md">
                <PhotoSlot
                  title="Forside"
                  hint="Hele kortet, rett ovenfra"
                  required
                  photo={front}
                  onPick={(f) => setFront(photo(f))}
                  onClear={() => setFront(null)}
                />
                <PhotoSlot title="Bakside" hint="Viser nummer og tilstand" photo={back} onPick={(f) => setBack(photo(f))} onClear={() => setBack(null)} />
              </div>
              <div className="mt-5">
                <p className={label}>Nærbilder (valgfritt, maks 4)</p>
                <div className="flex flex-wrap gap-3">
                  {extra.map((p, i) => (
                    <div key={p.url} className="relative h-24 w-20 overflow-hidden rounded-lg border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        aria-label="Fjern bilde"
                        onClick={() => setExtra(extra.filter((_, j) => j !== i))}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-800"
                      >
                        <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  {extra.length < 4 && (
                    <button
                      type="button"
                      onClick={() => extraInput.current?.click()}
                      className="flex h-24 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-foreground/25 text-muted-foreground transition hover:border-foreground/50 hover:text-foreground"
                    >
                      <ImagePlusIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="text-[11px] font-medium">Legg til</span>
                    </button>
                  )}
                  <input
                    ref={extraInput}
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    tabIndex={-1}
                    aria-label="Velg nærbilder"
                    onChange={(e) => {
                      const picked = [...(e.target.files ?? [])].map(photo).filter(Boolean) as Photo[];
                      setExtra([...extra, ...picked].slice(0, 4));
                      e.target.value = "";
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Hjørner, kanter, overflate eller graderingsetiketten.</p>
              </div>
              <p className="mt-4 rounded-lg bg-muted/60 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                Du kan ta bilde med en gang eller velge fra bildene dine. Tips: legg kortet på en ensfarget flate i godt dagslys, uten blits.
              </p>
            </div>
            <div className="border-t border-border pt-6">
              <label htmlFor="s-notes" className={label}>
                Beskrivelse
              </label>
              <textarea
                id="s-notes"
                name="notes"
                rows={4}
                maxLength={1500}
                placeholder="Sentrering, hjørner, kanter og overflate – nevn eventuelle skader"
                className={`${field} h-auto py-3`}
              ></textarea>
            </div>
          </div>
        </fieldset>
        <fieldset
          ref={(el) => {
            steps.current[1] = el;
          }}
          hidden={step !== 1}
          className="rounded-3xl bg-white p-5 ring-1 ring-slate-300/70 sm:p-7"
        >
          <legend className="sr-only">Om kortet</legend>
          <Step n="02" title="Om kortet" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="s-player" className={label}>
                Spiller *
              </label>
              <input
                id="s-player"
                name="player"
                required
                maxLength={80}
                placeholder="F.eks. Erling Haaland"
                className={field}
                value={v.player}
                onChange={set("player")}
              />
            </div>
            <div>
              <label htmlFor="s-set" className={label}>
                Sett *
              </label>
              <input
                id="s-set"
                name="set"
                required
                maxLength={100}
                placeholder="F.eks. Topps Chrome UCC"
                className={field}
                value={v.set}
                onChange={set("set")}
              />
            </div>
            <div>
              <label htmlFor="s-club" className={label}>
                Klubb / landslag
              </label>
              <input
                id="s-club"
                name="club"
                list="s-clubs"
                maxLength={60}
                placeholder="F.eks. Manchester City"
                autoComplete="off"
                className={field}
                value={v.club}
                onChange={(e) => {
                  const club = e.target.value;
                  // Kjent klubb: fyll inn ligaen automatisk
                  setV({ ...v, club, league: CLUBS[club] ?? v.league });
                }}
              />
              <datalist id="s-clubs">
                {Object.keys(CLUBS).map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor="s-league" className={label}>
                Liga
              </label>
              <select id="s-league" name="league" className={field} value={v.league} onChange={set("league")}>
                <option value="">Velg liga</option>
                {LEAGUES.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="s-season" className={label}>
                Sesong
              </label>
              <input id="s-season" name="season" maxLength={20} placeholder="F.eks. 2024/25" className={field} value={v.season} onChange={set("season")} />
            </div>
            <div>
              <label htmlFor="s-code" className={label}>
                Kortnummer
              </label>
              <input id="s-code" name="code" maxLength={30} placeholder="F.eks. CA-EH eller #18" className={field} value={v.code} onChange={set("code")} />
            </div>
            <div className="sm:col-span-2">
              <p className={label} id="s-type">
                Type <span className="font-normal normal-case tracking-normal text-muted-foreground">(velg alle som passer)</span>
              </p>
              <div role="group" aria-labelledby="s-type" className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={types.includes(t)}
                    onClick={() => toggleType(t)}
                    className="h-9 rounded-full border border-border px-3.5 text-sm font-medium transition hover:border-foreground/40 aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                  >
                    {t}
                  </button>
                ))}
              </div>
              {types.map((t) => (
                <input key={t} type="hidden" name="type" value={t} />
              ))}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="s-num" className={label}>
                Nummerering
              </label>
              <input
                id="s-num"
                name="num"
                maxLength={20}
                placeholder="F.eks. 25/99 (la stå tom hvis ikke nummerert)"
                className={field}
                value={v.num}
                onChange={set("num")}
              />
            </div>
          </div>
        </fieldset>
        <fieldset
          ref={(el) => {
            steps.current[2] = el;
          }}
          hidden={step !== 2}
          className="rounded-3xl bg-white p-5 ring-1 ring-slate-300/70 sm:p-7"
        >
          <legend className="sr-only">Tilstand og pris</legend>
          <Step n="03" title="Tilstand og pris" />
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="s-grader" className={label}>
                Gradering
              </label>
              <select id="s-grader" name="grader" className={field} value={v.grader} onChange={set("grader")}>
                {GRADERS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="s-grade" className={label}>
                Karakter
              </label>
              <input
                id="s-grade"
                name="grade"
                maxLength={10}
                placeholder="F.eks. 9.5"
                disabled={v.grader === GRADERS[0]}
                required={v.grader !== GRADERS[0]}
                className={`${field} disabled:bg-muted disabled:text-muted-foreground`}
                value={v.grade}
                onChange={set("grade")}
              />
            </div>
            <div>
              <label htmlFor="s-cond" className={label}>
                Tilstand
              </label>
              {/* Selgeren må selv vurdere tilstanden på ugraderte kort, så ingenting er valgt på forhånd */}
              <select id="s-cond" name="cond" required={v.grader === GRADERS[0]} className={field} value={v.cond} onChange={set("cond")}>
                <option value="" disabled>
                  Velg tilstand
                </option>
                {CONDITIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.no === c.en ? c.no : `${c.no} – ${c.en}`}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-muted-foreground">{CONDITIONS.find((c) => c.value === v.cond)?.hint}</p>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="s-price" className={label}>
                Pris (NOK) *
              </label>
              <div className="relative">
                <input
                  id="s-price"
                  name="price"
                  required
                  inputMode="numeric"
                  maxLength={9}
                  placeholder="F.eks. 750"
                  className={`${field} pr-12 font-mono-data`}
                  value={v.price}
                  onChange={set("price")}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono-data text-xs text-muted-foreground">NOK</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Du avtaler betaling og frakt direkte med kjøperen.</p>
            </div>
          </div>
        </fieldset>
        <fieldset
          ref={(el) => {
            steps.current[3] = el;
          }}
          hidden={step !== 3}
          className="rounded-3xl bg-white p-5 ring-1 ring-slate-300/70 sm:p-7"
        >
          <legend className="sr-only">Navn og sted i annonsen</legend>
          <Step n="04" title="Se over og send inn" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="s-username" className={label}>
                Brukernavn *
              </label>
              <input
                id="s-username"
                name="username"
                required
                maxLength={40}
                placeholder="Vises i annonsen"
                autoComplete="nickname"
                // Brukernavnet vises offentlig – aldri hele e-postadressen
                defaultValue={user?.name.includes("@") ? user.name.split("@")[0] : user?.name}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="s-location" className={label}>
                Sted *
              </label>
              <input
                id="s-location"
                name="location"
                required
                maxLength={60}
                placeholder="F.eks. Bergen"
                autoComplete="address-level2"
                defaultValue={user?.location}
                className={field}
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Kjøperne ser brukernavnet og stedet ditt. All kontakt skjer i chatten.</p>
          {user && (
            <p className="mt-5 rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
              Du er logget inn som <span className="font-semibold text-foreground">{user.email}</span>. Meldinger fra kjøpere kommer under Meldinger, og du får
              beskjed på e-post.
            </p>
          )}
          <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
            <input type="checkbox" name="confirm" required className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]" />
            <span>
              Jeg eier kortet, opplysningene stemmer, og jeg godtar at kjøpere kan sende meg meldinger om annonsen via HOBBYSTRADA. Jeg forstår at handelen
              skjer direkte mellom meg og kjøperen. Jeg godtar{" "}
              <Link href="/terms" target="_blank" className="font-medium text-foreground underline underline-offset-2">
                vilkårene
              </Link>
              .
            </span>
          </label>
        </fieldset>
        {error && step < 3 && <p className="rounded-xl bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}
        {step < 3 && (
          <div className="flex items-center justify-between gap-3">
            {step > 0 ? (
              <button type="button" onClick={prev} className={btnSecondary}>
                Tilbake
              </button>
            ) : (
              <span />
            )}
            <button type="button" onClick={next} className={btnPrimary}>
              Neste
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
        {step === 3 && (
          <button type="button" onClick={prev} className={`${btnSecondary} lg:hidden`}>
            Tilbake
          </button>
        )}
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} name="_hp" />
      </div>
      <aside data-last={step === 3 ? "true" : undefined} className="hidden data-[last=true]:block lg:sticky lg:top-24 lg:block">
        <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-300/70">
          <p className="font-mono-data text-[11px] uppercase tracking-[0.18em] text-[#8a6a24]">Forhåndsvisning</p>
          <div className="mx-auto mt-4 aspect-[5/7] w-full max-w-[220px]">
            {front ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={front.url} alt="" className="h-full w-full rounded-lg object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400">
                <CameraIcon className="h-6 w-6" aria-hidden="true" />
                <span className="text-xs">Forsidebilde</span>
              </div>
            )}
          </div>
          <p className="mt-5 line-clamp-2 font-heading text-base font-semibold leading-snug text-slate-950">{title}</p>
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-slate-200 font-mono-data text-[11px]">
            {[
              ["Type", typeLabel],
              ["Tilstand", v.grader === GRADERS[0] ? (conditionLabel(v.cond) ?? "") : `${v.grader} ${v.grade}`.trim()],
              ["Sesong", v.season || "—"],
              ["Pris", v.price ? formatPrice(Number(v.price)) : "— kr"],
            ].map(([k, val]) => (
              <div key={k} className="bg-white p-2.5">
                <dt className="uppercase tracking-wider text-slate-500">{k}</dt>
                <dd className="mt-1 truncate text-slate-900">{val}</dd>
              </div>
            ))}
          </dl>
          {error && <p className="mt-4 rounded-xl bg-destructive/5 px-3 py-2 text-xs text-destructive">{error}</p>}
          {step < 3 && <p className="mt-5 text-center text-xs text-slate-500">Steg {step + 1} av 4. Du sender inn i siste steg.</p>}
          <button type="submit" hidden={step < 3} disabled={!front || state === "sending"} className={`${btnPrimary} mt-5 w-full`}>
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            {state === "sending" ? "Sender inn …" : "Send inn annonsen"}
          </button>
        </div>
      </aside>
    </form>
  );
}
