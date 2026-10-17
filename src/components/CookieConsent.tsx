"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

const KEY = "cookie-consent";
const EVENT = "open-cookie-settings";

export function CookieButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(EVENT))} className="transition hover:text-white">
      Administrer informasjonskapsler
    </button>
  );
}

const CHANGE = "cookie-consent-change";
const subscribe = (cb: () => void) => {
  window.addEventListener(CHANGE, cb);
  return () => window.removeEventListener(CHANGE, cb);
};
const hasConsent = () => {
  try {
    return Boolean(localStorage.getItem(KEY));
  } catch {
    return true;
  }
};

/** Siden bruker bare nødvendige informasjonskapsler (innlogging og språk). */
export function CookieConsent() {
  const consented = useSyncExternalStore(subscribe, hasConsent, () => true);
  const [manual, setManual] = useState(false);
  useEffect(() => {
    const show = () => setManual(true);
    window.addEventListener(EVENT, show);
    return () => window.removeEventListener(EVENT, show);
  }, []);
  const open = !consented || manual;
  if (!open) return null;
  const close = () => {
    try {
      localStorage.setItem(KEY, new Date().toISOString());
    } catch {}
    setManual(false);
    window.dispatchEvent(new Event(CHANGE));
  };
  return (
    <div
      role="dialog"
      aria-label="Informasjonskapsler"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-lg rounded-3xl bg-white p-5 text-sm text-slate-700 shadow-[0_20px_60px_-20px_rgba(2,6,23,0.45)] ring-1 ring-slate-200 sm:p-6"
    >
      <p className="font-heading text-lg font-bold tracking-[-0.02em] text-primary">Informasjonskapsler</p>
      <p className="mt-1.5 leading-relaxed">
        Vi bruker bare informasjonskapsler som trengs for at siden skal virke, som innlogging og språkvalg. Vi bruker ikke sporing eller annonser.{" "}
        <Link href="/cookie-policy" className="font-medium text-primary underline underline-offset-2">
          Les mer
        </Link>
      </p>
      <button
        type="button"
        onClick={close}
        className="mt-4 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-black"
      >
        Den er grei
      </button>
    </div>
  );
}
