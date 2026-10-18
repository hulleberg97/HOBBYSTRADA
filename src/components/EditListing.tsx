"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PencilIcon } from "lucide-react";

const field =
  "h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:ring-2 focus:ring-ring/30";
const label = "mb-1.5 block font-mono-data text-[11px] uppercase tracking-[0.14em] text-muted-foreground";
const CONDITIONS = ["Mint", "Near Mint / Mint", "Excellent", "Very Good", "Brukt"];

type Props = { id: string; price: number; location: string | null; condition: string | null; description: string };

export function EditListing({ id, price, location, condition, description }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-100 px-4 text-xs font-semibold text-slate-800 transition hover:bg-slate-200"
      >
        <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" />
        Endre
      </button>
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
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Kunne ikke lagre.");
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
          {[...new Set([...(condition ? [condition] : []), ...CONDITIONS])].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-3">
        <label htmlFor={`desc-${id}`} className={label}>
          Beskrivelse
        </label>
        <textarea id={`desc-${id}`} name="description" rows={3} maxLength={1500} defaultValue={description} className={`${field} h-auto py-3`} />
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
