"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Raden med kort på forsiden. Den glir med CSS-animasjonen «mag-rull» helt til noen tar på den, så det ikke blir noe
 * bytte av motor når siden lastes. Første gang fingeren drar i raden, leses posisjonen av, og raden følger fingeren.
 * Etter kastet fortsetter glidingen som en nettleser-animasjon (Web Animations) fra samme sted, jevnt på skjermkortet.
 * Mus over raden stopper den, som før.
 */
export function MagRull({ children, className, ...rest }: { children: ReactNode; className?: string; "aria-label"?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = ref.current;
    const frame = el?.parentElement;
    if (!el || !frame || typeof el.animate !== "function") return;
    const style = getComputedStyle(el);
    const durMs = (parseFloat(style.animationDuration) || 32) * 1000; // CSS-varigheten (ulik på mobil og PC)
    let x = 0;
    let cssActive = true; // CSS-animasjonen kjører fortsatt (ingen har tatt på raden ennå)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let L = el.scrollWidth / 3; // raden består av tre kopier, så hver tredjedel viser det samme
    let anim: Animation | null = null;
    let animStart = 0; // x der den gjeldende animasjonen startet
    let dragging = false;
    let dragId = -1;
    let startX = 0;
    let lastX = 0;
    let lastT = 0;
    let vel = 0; // px per ms fra fingeren
    let moved = false;
    let hover = false;
    let focused = false;
    let visible = true;
    let raf = 0;
    let timer = 0;

    const norm = (v: number) => (L > 0 ? ((v % L) - L) % L : v); // inn i (-L, 0]
    const place = (v: number) => {
      el.style.transform = `translate3d(${v.toFixed(2)}px, 0, 0)`;
    };
    /** Hvor raden står akkurat nå, enten animasjonen eller fingeren styrer. */
    const currentX = () => {
      if (cssActive) {
        try {
          return new DOMMatrixReadOnly(getComputedStyle(el).transform).m41 || 0;
        } catch {
          return 0;
        }
      }
      if (!anim || L <= 0) return x;
      const t = Number(anim.currentTime ?? 0);
      return animStart - ((t % durMs) / durMs) * L;
    };
    const stopAuto = () => {
      if (cssActive) {
        x = norm(currentX());
        el.style.animation = "none";
        cssActive = false;
        place(x);
        return;
      }
      if (!anim) return;
      x = currentX();
      anim.cancel();
      anim = null;
      place(x);
    };
    /** Starter glidingen fra der raden står. Én runde fra x til x − L er sømløs, fordi innholdet gjentar seg hver L. */
    const startAuto = () => {
      if (cssActive || anim || L <= 0) return;
      animStart = norm(x);
      el.style.transform = "";
      anim = el.animate([{ transform: `translate3d(${animStart.toFixed(2)}px, 0, 0)` }, { transform: `translate3d(${(animStart - L).toFixed(2)}px, 0, 0)` }], {
        duration: durMs,
        iterations: Infinity,
        easing: "linear",
      });
      if (reduce) anim.playbackRate = 0.5;
      syncPause();
    };
    const syncPause = () => {
      if (!anim) return;
      if (hover || focused || !visible || document.hidden) anim.pause();
      else anim.play();
    };
    const measure = () => {
      const next = el.scrollWidth / 3;
      if (Math.abs(next - L) < 1) return;
      if (cssActive) {
        L = next; // CSS-animasjonen måler seg selv
        return;
      }
      const wasAuto = Boolean(anim);
      stopAuto();
      L = next;
      x = norm(x);
      if (wasAuto) startAuto();
      else place(x);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      syncPause();
    });
    io.observe(frame);
    const onVis = () => syncPause();
    document.addEventListener("visibilitychange", onVis);

    // Sveip med fingeren
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      stopAuto();
      dragging = true;
      dragId = e.pointerId;
      startX = lastX = e.clientX;
      lastT = performance.now();
      vel = 0;
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
      x = norm(x + dx);
      place(x);
    };
    const release = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== dragId) return;
      dragging = false;
      const now = performance.now();
      // Bare et ekte sveip gir kast og en kort pause. Ble fingeren brukt til å bla nedover (pointercancel), glir raden videre med en gang.
      const swiped = moved && e.type === "pointerup";
      let fling = swiped && now - lastT <= 80 ? Math.max(-2500, Math.min(2500, vel * 1000)) : 0;
      if (!swiped) return startAuto();
      let last = now;
      const tick = (t: number) => {
        const dt = Math.min((t - last) / 1000, 0.1);
        last = t;
        x = norm(x + fling * dt);
        place(x);
        fling *= Math.exp(-dt * 3.5);
        if (Math.abs(fling) > 8) raf = requestAnimationFrame(tick);
        else timer = window.setTimeout(startAuto, 1000);
      };
      if (fling) raf = requestAnimationFrame(tick);
      else timer = window.setTimeout(startAuto, 1200);
    };
    // Et sveip skal ikke åpne kortet under fingeren
    const click = (e: MouseEvent) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };
    const over = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      hover = true;
      syncPause();
    };
    const out = () => {
      hover = false;
      syncPause();
    };
    const focusIn = () => {
      focused = true;
      syncPause();
    };
    const focusOut = () => {
      focused = false;
      syncPause();
    };
    frame.addEventListener("pointerdown", down);
    frame.addEventListener("pointermove", drag);
    frame.addEventListener("pointerup", release);
    frame.addEventListener("pointercancel", release);
    frame.addEventListener("click", click, true);
    frame.addEventListener("pointerover", over);
    frame.addEventListener("pointerleave", out);
    el.addEventListener("focusin", focusIn);
    el.addEventListener("focusout", focusOut);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      anim?.cancel();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      frame.removeEventListener("pointerdown", down);
      frame.removeEventListener("pointermove", drag);
      frame.removeEventListener("pointerup", release);
      frame.removeEventListener("pointercancel", release);
      frame.removeEventListener("click", click, true);
      frame.removeEventListener("pointerover", over);
      frame.removeEventListener("pointerleave", out);
      el.removeEventListener("focusin", focusIn);
      el.removeEventListener("focusout", focusOut);
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
