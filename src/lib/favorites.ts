"use client";

import { useSyncExternalStore } from "react";

/** Favoritter lagres i nettleseren, så de virker uten innlogging. */
const KEY = "favoritter";
const EVENT = "favoritter-endret";
let cached: string[] | null = null;
const EMPTY: string[] = [];

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

export function useFavorites() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleFavorite(slug: string) {
  const list = read();
  const next = list.includes(slug) ? list.filter((s) => s !== slug) : [slug, ...list];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  cached = null;
  window.dispatchEvent(new Event(EVENT));
}
