"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, CameraIcon, CheckIcon, ImagePlusIcon, XIcon } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { CLUBS, LEAGUES } from "@/lib/clubs";
import { resizeImage } from "@/lib/resize";

const label = "mb-1.5 block font-mono-data text-[11px] uppercase tracking-[0.14em] text-muted-foreground";
const field =
  "h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-foreground/40 focus:ring-2 focus:ring-ring/30";

const TYPES = ["Autograf", "Patch / relic", "Rookie", "Nummerert", "Base", "Annet"];
const GRADERS = ["Ugradert (raw)", "PSA", "BGS", "SGC", "CGC", "Annet"];
const CONDITIONS = ["Mint", "Near Mint", "Excellent", "Very Good", "Brukt"];
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
    cond: "Near Mint",
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
      setState("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="mx-auto max-w-xl rounded-md border border-border bg-white p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
          <CheckIcon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-heading text-2xl font-semibold tracking-tight">Takk! Annonsen er sendt inn</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Vi går gjennom annonsen og publiserer den i markedet så snart som mulig.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {user && (
            <Link href="/account" className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white">
              Se annonsene mine
            </Link>
          )}
          <button
            type="button"
            onClick={() => location.reload()}
            className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm font-semibold"
          >
            Legg ut et kort til
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start" onSubmit={submit}>
      <div className="space-y-6">
        <fieldset className="rounded-md border border-border bg-white p-5 sm:p-7">
          <legend className="sr-only">Om kortet</legend>
          <Step n="01" title="Om kortet" />
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
              <input id="s-set" name="set" required maxLength={100} placeholder="Topps Chrome UCC" className={field} value={v.set} onChange={set("set")} />
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
              <input id="s-season" name="season" maxLength={20} placeholder="2024/25" className={field} value={v.season} onChange={set("season")} />
            </div>
            <div>
              <label htmlFor="s-code" className={label}>
                Kortnummer
              </label>
              <input id="s-code" name="code" maxLength={30} placeholder="CA-EH eller #18" className={field} value={v.code} onChange={set("code")} />
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
        <fieldset className="rounded-md border border-border bg-white p-5 sm:p-7">
          <legend className="sr-only">Tilstand og pris</legend>
          <Step n="02" title="Tilstand og pris" />
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
              <select id="s-cond" name="cond" className={field} value={v.cond} onChange={set("cond")}>
                {CONDITIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
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
                  placeholder="750"
                  className={`${field} pr-12 font-mono-data`}
                  value={v.price}
                  onChange={set("price")}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono-data text-xs text-muted-foreground">NOK</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Du og kjøperen avtaler betaling og frakt selv.</p>
            </div>
          </div>
        </fieldset>
        <fieldset className="rounded-md border border-border bg-white p-5 sm:p-7">
          <legend className="sr-only">Bilder og beskrivelse</legend>
          <Step n="03" title="Bilder og beskrivelse" />
          <div className="grid gap-6">
            <div>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold">Bilder av kortet</p>
                <p className="font-mono-data text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{count} bilder valgt</p>
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
        <fieldset className="rounded-md border border-border bg-white p-5 sm:p-7">
          <legend className="sr-only">Selger og kontakt</legend>
          <Step n="04" title="Selger og kontakt" />
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
                defaultValue={user?.name}
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
          <p className="mt-2 text-xs text-muted-foreground">Bare brukernavn og sted vises i annonsen. Kontaktinformasjonen din vises aldri.</p>
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
              skjer direkte mellom meg og kjøperen, og godtar{" "}
              <Link href="/terms" target="_blank" className="font-medium text-foreground underline underline-offset-2">
                vilkårene
              </Link>
              .
            </span>
          </label>
        </fieldset>
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} name="_hp" />
      </div>
      <aside className="lg:sticky lg:top-24">
        <div className="rounded-md bg-primary p-5 text-primary-foreground">
          <p className="font-mono-data text-[11px] uppercase tracking-[0.18em] text-accent">Forhåndsvisning</p>
          <div className="mx-auto mt-4 aspect-[5/7] w-full max-w-[220px]">
            {front ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={front.url} alt="" className="h-full w-full rounded-lg object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/25 bg-white/5 text-white/50">
                <CameraIcon className="h-6 w-6" aria-hidden="true" />
                <span className="text-xs">Forsidebilde</span>
              </div>
            )}
          </div>
          <p className="mt-5 line-clamp-2 font-heading text-base font-semibold leading-snug">{title}</p>
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/10 font-mono-data text-[11px]">
            {[
              ["Type", typeLabel],
              ["Tilstand", v.grader === GRADERS[0] ? v.cond : `${v.grader} ${v.grade}`.trim()],
              ["Sesong", v.season || "—"],
              ["Pris", v.price ? formatPrice(Number(v.price)) : "— kr"],
            ].map(([k, val]) => (
              <div key={k} className="bg-primary p-2.5">
                <dt className="uppercase tracking-wider text-white/50">{k}</dt>
                <dd className="mt-1 truncate text-white">{val}</dd>
              </div>
            ))}
          </dl>
          {error && <p className="mt-4 rounded-lg bg-white/10 px-3 py-2 text-xs text-white">{error}</p>}
          <button
            type="submit"
            disabled={!front || state === "sending"}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-semibold text-accent-foreground transition hover:bg-accent/90 disabled:opacity-60"
          >
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            {state === "sending" ? "Sender inn …" : "Publiser annonsen"}
          </button>
          {!front && <p className="mt-3 text-center text-xs text-white/50">Legg til et bilde av forsiden for å publisere.</p>}
        </div>
      </aside>
    </form>
  );
}
