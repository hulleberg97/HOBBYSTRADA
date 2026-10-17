"use client";

import { GlobeIcon } from "lucide-react";
import { useLang } from "./LangProvider";

export function LangToggle({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  const { lang, setLang } = useLang();
  const btn = dark
    ? "h-8 rounded-full px-2.5 text-xs font-semibold transition text-white/60 hover:text-white data-[current=true]:bg-white data-[current=true]:text-primary"
    : "h-8 rounded-full px-2.5 text-xs font-semibold transition text-slate-500 hover:text-primary data-[current=true]:bg-white data-[current=true]:text-primary data-[current=true]:shadow-sm";
  return (
    <div
      role="group"
      aria-label="Språk"
      className={`inline-flex h-10 items-center gap-1 rounded-full p-1 ${dark ? "bg-white/10" : "bg-slate-100"} ${className}`}
    >
      <GlobeIcon className={`ml-2 h-4 w-4 ${dark ? "text-white/60" : "text-slate-500"}`} strokeWidth={1.75} aria-hidden="true" />
      {(["no", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          aria-label={l === "no" ? "NO – norsk" : "EN – English"}
          data-current={lang === l ? "true" : undefined}
          onClick={() => setLang(l)}
          className={btn}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
