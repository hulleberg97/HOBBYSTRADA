"use client";

import { useEffect } from "react";

/**
 * Holder topplinjen og bunnmenyen i takt med forsiden i oppsettet «kino»: de er mørke mens en mørk sone (.kino-mork)
 * ligger bak dem, og lyse ellers. Topplinjen er mørk fra første bilde (siden starter på den mørke toppen), så her
 * settes «data-lys-topp» når den skal være lys, og «data-mork-bunn» når bunnmenyen skal være mørk. Utseendet ligger i globals.css.
 */
export function KinoSoner() {
  useEffect(() => {
    const rot = document.documentElement;
    let venter = 0;
    const sjekk = () => {
      venter = 0;
      const soner = [...document.querySelectorAll(".kino-mork")].map((e) => e.getBoundingClientRect()).filter((r) => r.height > 0);
      const bak = (y: number) => soner.some((r) => r.top <= y && r.bottom >= y);
      // Midt i topplinjen og midt i bunnmenyen
      rot.toggleAttribute("data-lys-topp", !bak(36));
      rot.toggleAttribute("data-mork-bunn", bak(window.innerHeight - 32));
    };
    const be = () => {
      if (!venter) venter = requestAnimationFrame(sjekk);
    };
    sjekk();
    window.addEventListener("scroll", be, { passive: true });
    window.addEventListener("resize", be);
    // Fanene kan endre høyden på siden uten at den rulles
    document.addEventListener("click", be);
    return () => {
      cancelAnimationFrame(venter);
      window.removeEventListener("scroll", be);
      window.removeEventListener("resize", be);
      document.removeEventListener("click", be);
      rot.removeAttribute("data-lys-topp");
      rot.removeAttribute("data-mork-bunn");
    };
  }, []);
  return null;
}
