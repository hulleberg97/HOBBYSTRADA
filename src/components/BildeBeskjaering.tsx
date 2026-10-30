"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckIcon, RotateCwIcon, XIcon } from "lucide-react";

/**
 * Beskjæring av bilde i nettleseren, uten eksterne biblioteker.
 * Hele bildet vises, og brukeren drar i hjørnene og kantene på en ramme for å velge utsnittet,
 * eller drar inne i rammen for å flytte den. Kortformat 5:7 er låst som standard, og kan slås av.
 * Resultatet tegnes på et lerret og leveres som JPEG.
 */

type Props = {
  file: File;
  /** Bredde delt på høyde, for eksempel 5/7 for et samlekort. */
  aspect?: number;
  title?: string;
  onDone: (file: File) => void;
  onSkip: () => void;
  onCancel: () => void;
};

type Rect = { x: number; y: number; w: number; h: number };
type Handle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "move";

/** Største bredde på utsnittet som lastes opp. */
const OUT_WIDTH = 1200;
/** Arbeidsbildet skaleres ned først, så visningen er rask også på mobil. */
const WORK_MAX = 2200;
/** Minste bredde og høyde på rammen, i skjermpiksler. */
const MIN = 48;
/** Luft rundt bildet, så håndtakene får plass utenfor kanten. */
const MARGIN = 26;

export function BildeBeskjaering({ file, aspect = 5 / 7, title = "Beskjær bildet", onDone, onSkip, onCancel }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const img = useRef<ImageBitmap | null>(null);
  const area = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ w: 0, h: 0 });
  const [rot, setRot] = useState(0);
  const [locked, setLocked] = useState(true);
  const [rect, setRect] = useState<Rect | null>(null);
  const [busy, setBusy] = useState(false);
  const drag = useRef<{ handle: Handle; start: { x: number; y: number }; rect: Rect; id: number } | null>(null);
  const skip = useRef(onSkip);
  skip.current = onSkip;

  // Laster bildet med riktig retning (EXIF) og lager et mindre arbeidsbilde. Rotering tegnes inn i arbeidsbildet.
  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;
    (async () => {
      try {
        const raw = await createImageBitmap(file, { imageOrientation: "from-image" });
        const scale = Math.min(1, WORK_MAX / Math.max(raw.width, raw.height));
        const turned = rot % 180 !== 0;
        const c = document.createElement("canvas");
        c.width = Math.round((turned ? raw.height : raw.width) * scale);
        c.height = Math.round((turned ? raw.width : raw.height) * scale);
        const ctx = c.getContext("2d")!;
        ctx.translate(c.width / 2, c.height / 2);
        ctx.rotate((rot * Math.PI) / 180);
        ctx.drawImage(raw, (-raw.width * scale) / 2, (-raw.height * scale) / 2, raw.width * scale, raw.height * scale);
        raw.close();
        const bitmap = await createImageBitmap(c);
        const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.92));
        if (cancelled || !blob) return;
        img.current?.close();
        img.current = bitmap;
        url = URL.createObjectURL(blob);
        setDims({ w: bitmap.width, h: bitmap.height });
        setSrc(url);
        setRect(null);
      } catch {
        skip.current();
      }
    })();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [file, rot]);

  useEffect(() => () => img.current?.close(), []);

  // Plassen bildet får på skjermen
  useEffect(() => {
    const el = area.current;
    if (!el) return;
    const update = () => setView({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Ingen rulling av siden bak mens beskjæringen er åpen
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Bildet vises så stort som plassen tillater
  const fit = dims.w && view.w ? Math.max(0, Math.min((view.w - 2 * MARGIN) / dims.w, (view.h - 2 * MARGIN) / dims.h)) : 0;
  const shown = { w: dims.w * fit, h: dims.h * fit };

  // Startramme: størst mulig i valgt format, midt i bildet
  const initial = useCallback(
    (lock: boolean): Rect => {
      if (!lock) return { x: 0, y: 0, w: shown.w, h: shown.h };
      let w = shown.w;
      let h = w / aspect;
      if (h > shown.h) {
        h = shown.h;
        w = h * aspect;
      }
      return { x: (shown.w - w) / 2, y: (shown.h - h) / 2, w, h };
    },
    [shown.w, shown.h, aspect],
  );
  useEffect(() => {
    if (shown.w && !rect) setRect(initial(locked));
  }, [shown.w, rect, initial, locked]);

  const clampRect = (r: Rect): Rect => {
    const w = Math.min(Math.max(MIN, r.w), shown.w);
    const h = Math.min(Math.max(MIN, r.h), shown.h);
    return { w, h, x: Math.min(Math.max(0, r.x), shown.w - w), y: Math.min(Math.max(0, r.y), shown.h - h) };
  };

  /** Ny ramme når et håndtak dras dx, dy fra startpunktet. Med låst format følger den andre siden med. */
  const resize = (start: Rect, handle: Handle, dx: number, dy: number): Rect => {
    if (handle === "move") return clampRect({ ...start, x: start.x + dx, y: start.y + dy });
    let { x, y, w, h } = start;
    const right = x + w;
    const bottom = y + h;
    if (handle.includes("e")) w = Math.max(MIN, Math.min(shown.w - x, w + dx));
    if (handle.includes("s")) h = Math.max(MIN, Math.min(shown.h - y, h + dy));
    if (handle.includes("w")) {
      const nx = Math.min(Math.max(0, x + dx), right - MIN);
      w = right - nx;
      x = nx;
    }
    if (handle.includes("n")) {
      const ny = Math.min(Math.max(0, y + dy), bottom - MIN);
      h = bottom - ny;
      y = ny;
    }
    if (locked) {
      // Kantene styrer én retning, hjørnene styrer den største endringen. Den andre siden regnes ut fra formatet.
      const byWidth = handle === "e" || handle === "w" || (handle.length === 2 && Math.abs(dx) >= Math.abs(dy));
      if (byWidth) h = w / aspect;
      else w = h * aspect;
      // Hold rammen innenfor bildet, og krymp om nødvendig
      if (handle.includes("w")) x = right - w;
      if (handle.includes("n")) y = bottom - h;
      if (x < 0) {
        w += x;
        h = w / aspect;
        x = 0;
        if (handle.includes("n")) y = bottom - h;
      }
      if (y < 0) {
        h += y;
        w = h * aspect;
        y = 0;
        if (handle.includes("w")) x = right - w;
      }
      if (x + w > shown.w) {
        w = shown.w - x;
        h = w / aspect;
        if (handle.includes("n")) y = bottom - h;
      }
      if (y + h > shown.h) {
        h = shown.h - y;
        w = h * aspect;
        if (handle.includes("w")) x = right - w;
      }
      if (w < MIN || h < MIN) return start;
    }
    return { x, y, w, h };
  };

  const onPointerDown = (handle: Handle) => (e: React.PointerEvent) => {
    if (!rect || drag.current) return;
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { handle, start: { x: e.clientX, y: e.clientY }, rect, id: e.pointerId };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    setRect(resize(d.rect, d.handle, e.clientX - d.start.x, e.clientY - d.start.y));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (drag.current?.id === e.pointerId) drag.current = null;
  };

  const toggleLock = () => {
    const next = !locked;
    setLocked(next);
    setRect(initial(next));
  };

  const finish = async () => {
    const b = img.current;
    if (!b || !rect || busy || !fit) return;
    setBusy(true);
    try {
      // Rammen i bildets egne piksler
      const sx = rect.x / fit;
      const sy = rect.y / fit;
      const sw = rect.w / fit;
      const sh = rect.h / fit;
      const outW = Math.max(200, Math.min(OUT_WIDTH, Math.round(sw)));
      const c = document.createElement("canvas");
      c.width = outW;
      c.height = Math.round((outW * sh) / sw);
      const ctx = c.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(b, sx, sy, sw, sh, 0, 0, c.width, c.height);
      const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.9));
      if (!blob) return onSkip();
      onDone(new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }));
    } catch {
      onSkip();
    } finally {
      setBusy(false);
    }
  };

  const handleBase = "absolute z-20 touch-none";
  const knob = "block h-7 w-7 rounded-full bg-white shadow ring-1 ring-slate-400";
  const bar = "block rounded-full bg-white shadow ring-1 ring-slate-400";

  return (
    <div className="fixed inset-0 z-[60] flex select-none flex-col bg-slate-950 text-white" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex items-center justify-between px-4 py-3">
        <button type="button" onClick={onCancel} aria-label="Avbryt" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10">
          <XIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <p className="text-sm font-semibold">{title}</p>
        <button
          type="button"
          onClick={() => setRot((r) => (r + 90) % 360)}
          aria-label="Roter bildet"
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
        >
          <RotateCwIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div ref={area} className="relative flex flex-1 items-center justify-center overflow-hidden">
        {src && fit > 0 && rect && (
          <div
            data-ramme
            className="relative select-none"
            style={{ width: shown.w, height: shown.h }}
            onMouseDown={(e) => e.preventDefault()}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" draggable={false} className="pointer-events-none block h-full w-full" />
            {/* Mørkt utenfor rammen */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: "rgba(2,6,23,0.65)",
                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${rect.x}px ${rect.y}px, ${rect.x}px ${rect.y + rect.h}px, ${rect.x + rect.w}px ${rect.y + rect.h}px, ${rect.x + rect.w}px ${rect.y}px, ${rect.x}px ${rect.y}px)`,
              }}
            />
            {/* Rammen. Dra inne i den for å flytte. */}
            <div
              onPointerDown={onPointerDown("move")}
              className="absolute z-10 cursor-move touch-none ring-2 ring-white"
              style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
            >
              <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-50">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span key={i} className="border border-white/40" />
                ))}
              </div>
            </div>
            {/* Hjørner */}
            {(["nw", "ne", "sw", "se"] as const).map((h) => (
              <div
                key={h}
                onPointerDown={onPointerDown(h)}
                data-handle={h}
                className={`${handleBase} flex h-11 w-11 items-center justify-center ${h === "nw" || h === "se" ? "cursor-nwse-resize" : "cursor-nesw-resize"}`}
                style={{
                  left: (h.includes("w") ? rect.x : rect.x + rect.w) - 22,
                  top: (h.includes("n") ? rect.y : rect.y + rect.h) - 22,
                }}
              >
                <span className={knob} />
              </div>
            ))}
            {/* Kanter */}
            <div onPointerDown={onPointerDown("n")} data-handle="n" className={`${handleBase} flex h-9 cursor-ns-resize items-center justify-center`} style={{ left: rect.x + 28, top: rect.y - 18, width: Math.max(0, rect.w - 56) }}>
              <span className={`${bar} h-2 w-10`} />
            </div>
            <div onPointerDown={onPointerDown("s")} data-handle="s" className={`${handleBase} flex h-9 cursor-ns-resize items-center justify-center`} style={{ left: rect.x + 28, top: rect.y + rect.h - 18, width: Math.max(0, rect.w - 56) }}>
              <span className={`${bar} h-2 w-10`} />
            </div>
            <div onPointerDown={onPointerDown("w")} data-handle="w" className={`${handleBase} flex w-9 cursor-ew-resize items-center justify-center`} style={{ left: rect.x - 18, top: rect.y + 28, height: Math.max(0, rect.h - 56) }}>
              <span className={`${bar} h-10 w-2`} />
            </div>
            <div onPointerDown={onPointerDown("e")} data-handle="e" className={`${handleBase} flex w-9 cursor-ew-resize items-center justify-center`} style={{ left: rect.x + rect.w - 18, top: rect.y + 28, height: Math.max(0, rect.h - 56) }}>
              <span className={`${bar} h-10 w-2`} />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-white/60">Dra i hjørnene og kantene. Dra inne i rammen for å flytte den.</p>
          <button
            type="button"
            onClick={toggleLock}
            aria-pressed={locked}
            className="inline-flex h-9 shrink-0 items-center rounded-full border border-white/30 px-3 text-xs font-semibold transition aria-pressed:bg-white aria-pressed:text-slate-950"
          >
            {locked ? "Kortformat 5:7" : "Fritt utsnitt"}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-white/30 text-sm font-semibold transition hover:bg-white/10"
          >
            Bruk hele bildet
          </button>
          <button
            type="button"
            onClick={finish}
            disabled={!src || busy}
            className="inline-flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:opacity-50"
          >
            <CheckIcon className="h-4 w-4" aria-hidden="true" />
            {busy ? "Lagrer …" : "Bruk utsnittet"}
          </button>
        </div>
      </div>
    </div>
  );
}
