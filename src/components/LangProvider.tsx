"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

type Lang = "no" | "en";
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "no", setLang: () => {} });
const EVENT = "lang-change";

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};
const read = (): Lang => {
  try {
    return localStorage.getItem("lang") === "en" ? "en" : "no";
  } catch {
    return "no";
  }
};

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, read, () => "no" as Lang);
  const setLang = (l: Lang) => {
    try {
      localStorage.setItem("lang", l);
    } catch {}
    document.documentElement.lang = l === "no" ? "nb" : "en";
    window.dispatchEvent(new Event(EVENT));
  };
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
