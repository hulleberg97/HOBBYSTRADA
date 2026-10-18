"use client";

import { useEffect, useId, useRef, useState } from "react";

type Item = { label: string; kind: string; n: number };

let cache: Promise<Item[]> | null = null;
const load = () =>
  (cache ??= fetch("/api/search-index")
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => []));

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/**
 * Søkefelt med forslag (spillere, sett, klubber). Pakker inn et vanlig <input>, så utseendet styres av den som bruker det.
 * Velger man et forslag, kalles onPick med teksten.
 */
export function SearchSuggest({
  value,
  onChange,
  onPick,
  inputProps,
  listClassName = "",
}: {
  value: string;
  onChange: (v: string) => void;
  onPick: (v: string) => void;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  listClassName?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const id = useId();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const q = norm(value.trim());
  const hits =
    q.length < 2
      ? []
      : items
          .filter(
            (i) =>
              norm(i.label)
                .split(/[\s-]+/)
                .some((w) => w.startsWith(q)) || norm(i.label).startsWith(q),
          )
          .slice(0, 7);
  const show = open && hits.length > 0;

  const pick = (label: string) => {
    onChange(label);
    setOpen(false);
    onPick(label);
  };

  return (
    <div ref={box} className="relative min-w-0 flex-1">
      <input
        {...inputProps}
        value={value}
        role="combobox"
        aria-expanded={show}
        aria-controls={id}
        aria-autocomplete="list"
        autoComplete="off"
        onFocus={() => load().then(setItems)}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={(e) => {
          if (!show) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => (a + 1) % hits.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => (a <= 0 ? hits.length - 1 : a - 1));
          } else if (e.key === "Enter" && active >= 0) {
            e.preventDefault();
            pick(hits[active].label);
          } else if (e.key === "Escape") setOpen(false);
        }}
      />
      {show && (
        <ul
          id={id}
          role="listbox"
          className={`absolute inset-x-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl bg-white py-1.5 text-left text-slate-900 shadow-[0_18px_40px_-12px_rgba(2,6,23,0.35)] ring-1 ring-slate-200 ${listClassName}`}
        >
          {hits.map((h, i) => (
            <li
              key={h.kind + h.label}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(h.label);
              }}
              onMouseEnter={() => setActive(i)}
              className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm aria-selected:bg-slate-100"
            >
              <span className="truncate font-medium">{h.label}</span>
              <span className="shrink-0 text-xs text-slate-500">
                {h.kind} · {h.n}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
