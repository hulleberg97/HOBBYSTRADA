"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeftIcon, ChevronRightIcon, XIcon, ZoomInIcon } from "lucide-react";

/** Bildegalleri for annonsesiden: hovedbilde, miniatyrer og fullskjerm med sveip og zoom. */
export function Gallery({ images, title, badges }: { images: string[]; title: string; badges: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const n = images.length;

  const show = useCallback(
    (i: number) => {
      const next = (i + n) % n;
      setIndex(next);
      setZoom(null);
      track.current?.children[next]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    },
    [n],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") show(index + 1);
      if (e.key === "ArrowLeft") show(index - 1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    track.current?.children[index]?.scrollIntoView({ inline: "center", block: "nearest" });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, index, show]);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) {
      setIndex(i);
      setZoom(null);
    }
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-slate-50 to-slate-200 ring-1 ring-inset ring-slate-200">
        {badges}
        <div className="px-10 pb-10 pt-16 sm:px-20 sm:pb-14 sm:pt-20">
          <div className="mx-auto w-full max-w-[300px] sm:max-w-[340px]">
            <div className="rounded-[18px] border border-white bg-gradient-to-br from-white via-slate-100 to-white p-3 shadow-2xl shadow-slate-900/30">
              <div className="aspect-[5/7] overflow-hidden rounded-[10px] bg-primary">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="group relative block h-full w-full cursor-zoom-in"
                  aria-label="Vis bildet i full størrelse"
                >
                  <Image
                    alt={title}
                    src={images[index]}
                    width={800}
                    height={1120}
                    loading="eager"
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 80vw, 360px"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow transition sm:opacity-0 sm:group-hover:opacity-100">
                    <ZoomInIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {n > 1 && (
        <ul className="mt-3 flex flex-wrap justify-center gap-2">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                aria-label={`Bilde ${i + 1} av ${n}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className="block h-16 w-12 overflow-hidden rounded-lg ring-1 ring-slate-300 transition aria-[current=true]:ring-2 aria-[current=true]:ring-primary"
              >
                <Image src={src} alt="" width={96} height={128} className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* Legges rett i <body>, så fullskjermen alltid ligger over menylinjen */}
      {open &&
        createPortal(
          <div role="dialog" aria-modal="true" aria-label={title} className="galleri-fs fixed inset-0 z-[60] flex flex-col bg-white text-primary">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <p className="font-mono-data text-xs text-white/70">
                {index + 1} / {n}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Lukk"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div
              ref={track}
              onScroll={onScroll}
              className="flex flex-1 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {images.map((src, i) => (
                <div key={src} className="relative flex h-full w-full shrink-0 snap-center items-center justify-center overflow-hidden p-4">
                  <Image
                    src={src}
                    alt={`${title} – bilde ${i + 1}`}
                    width={1600}
                    height={2240}
                    sizes="100vw"
                    onClick={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      setZoom(zoom ? null : { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
                    }}
                    style={i === index && zoom ? { transform: "scale(2.5)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
                    className={`galleri-bilde max-h-full w-auto max-w-full object-contain transition-transform duration-200 ${i === index && zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                  />
                </div>
              ))}
            </div>
            {n > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => show(index - 1)}
                  aria-label="Forrige bilde"
                  className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 sm:flex"
                >
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => show(index + 1)}
                  aria-label="Neste bilde"
                  className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 sm:flex"
                >
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            )}
            <p className="pb-4 text-center text-xs text-white/60">Trykk på bildet for å zoome{n > 1 ? " · sveip for neste" : ""}</p>
          </div>,
          document.body,
        )}
    </>
  );
}
