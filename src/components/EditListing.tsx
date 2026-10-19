"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ImagePlusIcon, PencilIcon, StarIcon, XIcon } from "lucide-react";
import { resizeImage } from "@/lib/resize";
import { CLUBS, LEAGUES } from "@/lib/clubs";
import { CONDITIONS, conditionLabel } from "@/lib/conditions";

const field =
  "h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-ring/30";
const label = "mb-1.5 block font-mono-data text-[11px] uppercase tracking-[0.14em] text-muted-foreground";

const MAX_IMAGES = 6;

type Props = {
  id: string;
  price: number;
  location: string | null;
  condition: string | null;
  description: string;
  images: string[];
  club: string | null;
  league: string | null;
};
type Pic = { kind: "keep"; url: string } | { kind: "add"; url: string; file: File };

export function EditListing({ id, price, location, condition, description, images, club, league }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pics, setPics] = useState<Pic[]>(() => images.map((url) => ({ kind: "keep", url })));
  const picker = useRef<HTMLInputElement>(null);
  const changed = pics.length !== images.length || pics.some((p, i) => p.kind === "add" || p.url !== images[i]);

  const addFiles = (list: FileList | null) => {
    const files = [...(list ?? [])].filter((f) => f.type.startsWith("image/")).slice(0, MAX_IMAGES - pics.length);
    setPics([...pics, ...files.map((file) => ({ kind: "add" as const, url: URL.createObjectURL(file), file }))]);
  };
  const remove = (i: number) => setPics(pics.filter((_, j) => j !== i));
  const makeFirst = (i: number) => setPics([pics[i], ...pics.filter((_, j) => j !== i)]);

  const saveImages = async () => {
    const form = new FormData();
    let keep = 0;
    let add = 0;
    for (const p of pics) {
      if (p.kind === "keep") {
        form.append("keep", p.url);
        form.append("order", `keep:${keep++}`);
      } else {
        form.append("add", await resizeImage(p.file));
        form.append("order", `add:${add++}`);
      }
    }
    const res = await fetch(`/api/listings/${id}/images`, { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "Kunne ikke lagre bildene.");
    return Boolean(data.pending);
  };

  if (!open) {
    return (
      <>
        {notice && <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 ring-1 ring-inset ring-amber-200">{notice}</p>}
        <button
          type="button"
          onClick={() => {
            setPics(images.map((url) => ({ kind: "keep", url })));
            setError("");
            setOpen(true);
          }}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-100 px-4 text-xs font-semibold text-slate-800 transition hover:bg-slate-200"
        >
          <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Endre
        </button>
      </>
    );
  }

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true);
    setError("");
    const res = await fetch(`/api/listings/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...f, price: Number(String(f.price).replace(/\D/g, "")) }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBusy(false);
      return setError(data.error ?? "Kunne ikke lagre.");
    }
    if (changed) {
      if (!pics.length) {
        setBusy(false);
        return setError("Annonsen må ha minst ett bilde.");
      }
      try {
        if (await saveImages()) setNotice("Bildene er lagret. Annonsen er skjult til vi har godkjent de nye bildene.");
      } catch (err) {
        setBusy(false);
        return setError((err as Error).message);
      }
    }
    setBusy(false);
    setOpen(false);
    router.refresh();
  };

  return (
    <form onSubmit={save} className="mt-3 grid w-full gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200 sm:grid-cols-3">
      <div>
        <label htmlFor={`price-${id}`} className={label}>
          Pris (NOK)
        </label>
        <input id={`price-${id}`} name="price" required inputMode="numeric" maxLength={9} defaultValue={price} className={`${field} font-mono-data`} />
      </div>
      <div>
        <label htmlFor={`loc-${id}`} className={label}>
          Sted
        </label>
        <input id={`loc-${id}`} name="location" required maxLength={60} defaultValue={location ?? ""} className={field} />
      </div>
      <div>
        <label htmlFor={`cond-${id}`} className={label}>
          Tilstand
        </label>
        <select id={`cond-${id}`} name="condition" defaultValue={condition ?? "Near Mint / Mint"} className={field}>
          {condition && !CONDITIONS.some((c) => c.value === condition) && <option value={condition}>{conditionLabel(condition)}</option>}
          {CONDITIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.no === c.en ? c.no : `${c.no} – ${c.en}`}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`club-${id}`} className={label}>
          Klubb / landslag
        </label>
        <input
          id={`club-${id}`}
          name="club"
          list={`clubs-${id}`}
          maxLength={60}
          defaultValue={club ?? ""}
          autoComplete="off"
          className={field}
          onChange={(e) => {
            const l = CLUBS[e.target.value];
            const sel = e.currentTarget.form?.elements.namedItem("league") as HTMLSelectElement | null;
            if (l && sel) sel.value = l;
          }}
        />
        <datalist id={`clubs-${id}`}>
          {Object.keys(CLUBS).map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
      <div>
        <label htmlFor={`league-${id}`} className={label}>
          Liga
        </label>
        <select id={`league-${id}`} name="league" defaultValue={league ?? ""} className={field}>
          <option value="">Velg liga</option>
          {[...new Set([...(league ? [league] : []), ...LEAGUES])].map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-3">
        <label htmlFor={`desc-${id}`} className={label}>
          Beskrivelse
        </label>
        <textarea id={`desc-${id}`} name="description" rows={3} maxLength={1500} defaultValue={description} className={`${field} h-auto py-3`} />
      </div>
      <div className="sm:col-span-3">
        <p className={label}>Bilder (det første bildet er forsidebildet)</p>
        <ul className="flex flex-wrap gap-3">
          {pics.map((p, i) => (
            <li key={p.url} className="relative h-28 w-20 overflow-hidden rounded-lg bg-slate-200 ring-1 ring-slate-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              {i === 0 ? (
                <span className="absolute inset-x-0 bottom-0 bg-primary/85 py-0.5 text-center text-[10px] font-semibold text-white">Forside</span>
              ) : (
                <button
                  type="button"
                  onClick={() => makeFirst(i)}
                  aria-label="Bruk som forsidebilde"
                  className="absolute bottom-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-800"
                >
                  <StarIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Fjern bilde"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-800"
              >
                <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
          {pics.length < MAX_IMAGES && (
            <li>
              <button
                type="button"
                onClick={() => picker.current?.click()}
                className="flex h-28 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-400 text-slate-600 transition hover:border-slate-600"
              >
                <ImagePlusIcon className="h-5 w-5" aria-hidden="true" />
                <span className="text-[11px] font-medium">Legg til</span>
              </button>
              <input
                ref={picker}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                tabIndex={-1}
                aria-label="Velg bilder"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </li>
          )}
        </ul>
        {changed && <p className="mt-2 text-xs text-slate-500">Nye bilder må godkjennes før annonsen vises igjen.</p>}
      </div>
      {error && <p className="text-sm text-destructive sm:col-span-3">{error}</p>}
      <div className="flex gap-2 sm:col-span-3">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
        >
          {busy ? "Lagrer …" : "Lagre endringer"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
}
