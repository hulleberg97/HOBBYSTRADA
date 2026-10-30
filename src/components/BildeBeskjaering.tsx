"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, RotateCwIcon, XIcon } from "lucide-react";

/**
 * Beskjæring av bilde i nettleseren, uten eksterne biblioteker.
 * Bildet vises bak en fast ramme (kortformat 5:7). Brukeren drar for å flytte, kniper eller bruker glideren for å zoome, og kan rotere.
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

/** Største bredde på utsnittet som lastes opp. */
const OUT_WIDTH = 1200;
/** Arbeidsbildet skaleres ned først, så visningen er rask også på mobil. */
const WORK_MAX = 2200;

export function BildeBeskjaering({ file, aspect = 5 / 7, title = "Beskjær bildet", onDone, onSkip, onCancel }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const img = useRef<ImageBitmap | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [rot, setRot] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ dist: number; zoom: number; mid: { x: number; y: number }; pos: { x: number; y: number } } | null>(null);
  const skip = useRef(onSkip);
  skip.current = onSkip;

  // Laster bildet med riktig retning (EXIF) og lager et mindre arbeidsbilde
  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;
    (async () => {
      try {
        const raw = await createImageBitmap(file, { imageOrientation: "from-image" });
        const scale = Math.min(1, WORK_MAX / Math.max(raw.width, raw.height));
        let bitmap = raw;
        if (scale < 1) {
          const c = document.createElement("canvas");
          c.width = Math.round(raw.width * scale);
          c.height = Math.round(raw.height * scale);
          c.getContext("2d")!.drawImage(raw, 0, 0, c.width, c.height);
          bitmap = await createImageBitmap(c);
          raw.close();
        }
        if (cancelled) return;
        img.current = bitmap;
        const c = document.createElement("canvas");
        c.width = bitmap.width;
        c.height = bitmap.height;
        c.getContext("2d")!.drawImage(bitmap, 0, 0);
        const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.92));
        if (cancelled || !blob) return;
        url = URL.createObjectURL(blob);
        setSrc(url);
      } catch {
        skip.current();
      }
    })();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
      img.current?.close();
      img.current = null;
    };
  }, [file]);

  // Rammens størrelse i px, så bildet kan plasseres riktig
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => setFrame({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [src]);

  // Ingen rulling av siden bak mens beskjæringen er åpen
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const bitmap = img.current;
  const rotated = rot % 180 !== 0;
  const iw = bitmap ? (rotated ? bitmap.height : bitmap.width) : 1;
  const ih = bitmap ? (rotated ? bitmap.width : bitmap.height) : 1;
  // Minste skala som dekker hele rammen
  const cover = frame.w && frame.h ? Math.max(frame.w / iw, frame.h / ih) : 1;
  const k = cover * zoom;

  // Bildet skal alltid dekke hele rammen
  const clamp = (p: { x: number; y: number }, scale = k) => {
    const mx = Math.max(0, (iw * scale - frame.w) / 2);
    const my = Math.max(0, (ih * scale - frame.h) / 2);
    return { x: Math.min(mx, Math.max(-mx, p.x)), y: Math.min(my, Math.max(-my, p.y)) };
  };

  const setZoomAt = (z: number, anchor?: { x: number; y: number }) => {
    const next = Math.min(5, Math.max(1, z));
    const scale = cover * next;
    // Zoomer rundt fingrene/musepekeren, så punktet under dem står stille
    if (anchor) {
      const ratio = scale / k;
      setPos((p) => clamp({ x: anchor.x - (anchor.x - p.x) * ratio, y: anchor.y - (anchor.y - p.y) * ratio }, scale));
    } else {
      setPos((p) => clamp(p, scale));
    }
    setZoom(next);
  };

  const local = (e: React.PointerEvent | WheelEvent) => {
    const r = frameRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    if (pts.length === 2) {
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      gesture.current = { dist, zoom, mid: { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }, pos };
    } else {
      gesture.current = { dist: 0, zoom, mid: { x: e.clientX, y: e.clientY }, pos };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    const g = gesture.current;
    if (pts.length >= 2 && g.dist) {
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      const next = Math.min(5, Math.max(1, g.zoom * (dist / g.dist)));
      const scale = cover * next;
      const ratio = scale / (cover * g.zoom);
      const r = frameRef.current!.getBoundingClientRect();
      const a = { x: g.mid.x - r.left - r.width / 2, y: g.mid.y - r.top - r.height / 2 };
      setPos(clamp({ x: a.x - (a.x - g.pos.x) * ratio + (mid.x - g.mid.x), y: a.y - (a.y - g.pos.y) * ratio + (mid.y - g.mid.y) }, scale));
      setZoom(next);
    } else if (pts.length === 1) {
      setPos(clamp({ x: g.pos.x + (e.clientX - g.mid.x), y: g.pos.y + (e.clientY - g.mid.y) }));
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    const pts = [...pointers.current.values()];
    // Fra to fingre til én: start en ny flytting fra der fingeren er
    gesture.current = pts.length === 1 ? { dist: 0, zoom, mid: { x: pts[0].x, y: pts[0].y }, pos } : null;
  };

  // Musehjul zoomer rundt pekeren
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoomAt(zoom * (e.deltaY < 0 ? 1.1 : 0.9), local(e));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  });

  const rotate = () => {
    const next = (rot + 90) % 360;
    setRot(next);
    setZoom(1);
    setPos({ x: 0, y: 0 });
  };

  const finish = async () => {
    const b = img.current;
    if (!b || busy) return;
    setBusy(true);
    try {
      // Ikke større enn bildet faktisk har piksler til, og aldri over OUT_WIDTH
      const outW = Math.max(300, Math.min(OUT_WIDTH, Math.round(frame.w / k)));
      const f = outW / frame.w;
      const c = document.createElement("canvas");
      c.width = Math.round(frame.w * f);
      c.height = Math.round(frame.h * f);
      const ctx = c.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.translate(c.width / 2 + pos.x * f, c.height / 2 + pos.y * f);
      ctx.scale(k * f, k * f);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.drawImage(b, -b.width / 2, -b.height / 2);
      const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.9));
      if (!blob) return onSkip();
      onDone(new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }));
    } catch {
      onSkip();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-950 text-white" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex items-center justify-between px-4 py-3">
        <button type="button" onClick={onCancel} aria-label="Avbryt" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10">
          <XIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <p className="text-sm font-semibold">{title}</p>
        <button type="button" onClick={rotate} aria-label="Roter bildet" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10">
          <RotateCwIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden px-6">
        <div
          ref={frameRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ aspectRatio: `${aspect}`, touchAction: "none" }}
          className="relative w-full max-w-[360px] cursor-grab select-none overflow-hidden rounded-xl bg-black shadow-[0_0_0_9999px_rgba(2,6,23,0.75)] ring-1 ring-white/40 active:cursor-grabbing"
        >
          {src && frame.w > 0 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt=""
              draggable={false}
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
              style={{
                width: bitmap?.width ?? 0,
                height: bitmap?.height ?? 0,
                transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) scale(${k}) rotate(${rot}deg)`,
                transformOrigin: "center",
              }}
            />
          )}
          {/* Tredelingslinjer som hjelp til å rette opp kortet */}
          <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-40">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="border border-white/40" />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 px-6 pb-[max(20px,env(safe-area-inset-bottom))] pt-4">
        <label className="flex items-center gap-3 text-xs text-white/80">
          <span className="w-10 shrink-0">Zoom</span>
          <input
            type="range"
            min={1}
            max={5}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoomAt(Number(e.target.value))}
            aria-label="Zoom"
            className="h-1.5 w-full cursor-pointer accent-white"
          />
        </label>
        <p className="text-center text-xs text-white/60">Dra for å flytte bildet. Knip eller bruk glideren for å zoome.</p>
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
