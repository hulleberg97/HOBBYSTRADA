"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Raden med kort på forsiden. Uten JavaScript glir den med CSS-animasjonen «mag-rull». Når siden er lastet, tar denne
 * over og driver glidingen selv, så raden kan sveipes med fingeren på mobil: den følger fingeren, får et lite kast når
 * den slippes, og glir videre med en gang fingeren er borte. Mus over raden stopper den, som før.
 */
export function MagRull({ children, className, ...rest }: { children: ReactNode; className?: string; "aria-label"?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = ref.current;
    const frame = el?.parentElement;
    if (!el || !frame) return;
    // Varigheten CSS-animasjonen har akkurat nå (ulik på mobil og PC), så farten blir den samme
    const style = getComputedStyle(el);
    const dur = parseFloat(style.animationDuration) || 32;
    let x = 0;
    try {
      x = new DOMMatrixReadOnly(style.transform).m41 || 0;
    } catch {}
    el.style.animation = "none";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = () => el.scrollWidth / 3; // raden består av tre kopier
    let dragging = false;
    let dragId = -1;
    let startX = 0;
    let lastX = 0;
    let lastT = 0;
    let vel = 0; // px per ms, fra fingeren
    let fling = 0; // px per s etter slipp
    let moved = false;
    let pauseUntil = 0;
    let hover = false;
    let visible = true;
    let last = performance.now();
    let raf = 0;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(frame);

    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      dragging = true;
      dragId = e.pointerId;
      startX = lastX = e.clientX;
      lastT = performance.now();
      vel = 0;
      fling = 0;
      moved = false;
    };
    const drag = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== dragId) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      vel = 0.7 * vel + 0.3 * (dx / Math.max(1, now - lastT));
      lastX = e.clientX;
      lastT = now;
      if (Math.abs(e.clientX - startX) > 8) moved = true;
      x += dx;
    };
    const release = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== dragId) return;
      dragging = false;
      const now = performance.now();
      // Bare et ekte sveip gir kast og en kort pause. Ble fingeren brukt til å bla nedover (pointercancel), glir raden videre med en gang.
      const swiped = moved && e.type === "pointerup";
      fling = swiped && now - lastT <= 80 ? Math.max(-2500, Math.min(2500, vel * 1000)) : 0;
      pauseUntil = swiped ? now + 1200 : 0;
    };
    // Et sveip skal ikke åpne kortet under fingeren
    const click = (e: MouseEvent) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };
    const over = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hover = true;
    };
    const out = () => (hover = false);
    frame.addEventListener("pointerdown", down);
    frame.addEventListener("pointermove", drag);
    frame.addEventListener("pointerup", release);
    frame.addEventListener("pointercancel", release);
    frame.addEventListener("click", click, true);
    frame.addEventListener("pointerover", over);
    frame.addEventListener("pointerleave", out);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!visible || document.hidden) return;
      if (!dragging) {
        if (fling) {
          x += fling * dt;
          fling *= Math.exp(-dt * 3.5);
          if (Math.abs(fling) < 8) fling = 0;
        } else if (now > pauseUntil && !hover && !el.matches(":focus-within")) {
          x -= (loop() / dur) * (reduce ? 0.5 : 1) * dt;
        }
      }
      const L = loop();
      if (L > 0) {
        while (x > 0) x -= L;
        while (x <= -L) x += L;
      }
      el.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      frame.removeEventListener("pointerdown", down);
      frame.removeEventListener("pointermove", drag);
      frame.removeEventListener("pointerup", release);
      frame.removeEventListener("pointercancel", release);
      frame.removeEventListener("click", click, true);
      frame.removeEventListener("pointerover", over);
      frame.removeEventListener("pointerleave", out);
      el.style.animation = "";
      el.style.transform = "";
    };
  }, []);
  return (
    <ul ref={ref} className={className} {...rest}>
      {children}
    </ul>
  );
}
