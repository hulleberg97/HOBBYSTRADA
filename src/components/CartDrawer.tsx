"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ShoppingBagIcon, XIcon } from "lucide-react";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-slate-950/45 transition-opacity duration-300 motion-reduce:transition-none ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      ></div>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Handlekurv"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[460px] flex-col overflow-hidden bg-white text-slate-900 transition-[transform,visibility] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:inset-y-3 sm:right-3 sm:w-[calc(100%-1.5rem)] sm:rounded-3xl ${open ? "visible translate-x-0" : "invisible translate-x-[calc(100%+1rem)]"}`}
      >
        <div className="flex items-center justify-between px-5 pb-4 pt-5 sm:px-6">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-[22px] font-bold tracking-[-0.03em] text-primary">Handlekurv</h2>
          </div>
          <button
            aria-label="Lukk handlekurven"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 hover:text-slate-950"
          >
            <XIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain border-t border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <ShoppingBagIcon className="h-7 w-7 text-slate-500" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <p className="mt-5 font-heading text-xl font-bold tracking-[-0.02em] text-primary">Handlekurven er tom</p>
            <p className="mt-1.5 max-w-[280px] text-sm leading-relaxed text-slate-500">Finn kortet du har lett etter blant annonsene i markedet.</p>
            <div className="mt-6 flex w-full max-w-[280px] flex-col gap-2">
              <Link
                onClick={onClose}
                className="flex h-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition hover:bg-black"
                href="/products"
              >
                Utforsk markedet
              </Link>
              <Link
                onClick={onClose}
                className="flex h-12 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                href="/sell"
              >
                Legg ut kort
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 bg-slate-50">
          <div className="px-5 sm:px-6"></div>
        </div>
      </div>
    </>
  );
}
