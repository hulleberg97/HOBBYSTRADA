"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "cookie-consent";
const EVENT = "open-cookie-settings";

export function CookieButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(EVENT))} className="transition hover:text-white">
      Administrer informasjonskapsler
    </button>
  );
}

/** Siden bruker bare nødvendige informasjonskapsler (innlogging og språk). */
export function CookieConsent() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {}
    const show = () => setOpen(true);
    window.addEventListener(EVENT, show);
    return () => window.removeEventListener(EVENT, show);
  }, []);
  if (!open) return null;
  const close = () => {
    try {
      localStorage.setItem(KEY, new Date().toISOString());
    } catch {}
    setOpen(false);
  };
  return (
    <div role="dialog" aria-label="Informasjonskapsler" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-lg rounded-3xl bg-white p-5 text-sm text-slate-700 shadow-[0_20px_60px_-20px_rgba(2,6,23,0.45)] ring-1 ring-slate-200 sm:p-6">
      <p className="font-heading text-lg font-bold tracking-[-0.02em] text-primary">Informasjonskapsler</p>
      <p className="mt-1.5 leading-relaxed">
        Vi bruker bare informasjonskapsler som trengs for at siden skal virke, som innlogging og språkvalg. Vi bruker ikke sporing eller annonser.{" "}
        <Link href="/cookie-policy" className="font-medium text-primary underline underline-offset-2">
          Les mer
        </Link>
      </p>
      <button type="button" onClick={close} className="mt-4 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-black">
        Den er grei
      </button>
    </div>
  );
}
