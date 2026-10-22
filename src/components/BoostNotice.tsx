"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { XIcon, ZapIcon } from "lucide-react";

type Notice = { id: string; title: string; slug: string; text: string };

/** Lukkede varsler huskes i nettleseren, på samme måte som favoritter. */
const KEY = "lukkede-loft";
const EVENT = "lukkede-loft-endret";
const SERVER: string[] = ["*"]; // på serveren vises ingenting, så varselet ikke blinker før nettleseren har sjekket
let cached: string[] | null = null;

function read(): string[] {
  if (cached) return cached;
  try {
    cached = JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    cached = [];
  }
  return cached!;
}

function subscribe(cb: () => void) {
  const onChange = () => {
    cached = null;
    cb();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function close(id: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...read(), id].slice(-50)));
  } catch {}
  cached = null;
  window.dispatchEvent(new Event(EVENT));
}

/** «Hurra!»-varsel på Min side for løft som nylig er aktivert. Kan lukkes. */
export function BoostNotice({ items }: { items: Notice[] }) {
  const closed = useSyncExternalStore(subscribe, read, () => SERVER);
  const shown = closed === SERVER ? [] : items.filter((n) => !closed.includes(n.id));
  if (!shown.length) return null;
  return (
    <div className="mb-8 space-y-2">
      {shown.map((n) => (
        <div key={n.id} role="status" className="flex items-start gap-3 rounded-2xl bg-accent/15 py-4 pl-5 pr-3 ring-1 ring-inset ring-accent/50">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <ZapIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-950">Hurra! Annonsen din er løftet!</p>
            <p className="mt-0.5 text-sm text-slate-700">
              <Link href={`/products/${n.slug}`} className="font-medium underline underline-offset-2">
                {n.title}
              </Link>
              : {n.text}
            </p>
          </div>
          <button type="button" onClick={() => close(n.id)} aria-label="Lukk varselet" className="tap-sm flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-white/60 hover:text-slate-950">
            <XIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
