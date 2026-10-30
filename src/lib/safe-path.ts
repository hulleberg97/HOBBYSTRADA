/**
 * Gjør om en «next»-verdi fra lenker og skjema til en trygg intern sti.
 * Bare stier på vårt eget nettsted slipper gjennom; «//ond.no», «/\ond.no» og fulle URL-er gir reserveverdien.
 */
export function safePath(next: string | null | undefined, fallback = "/account") {
  if (!next) return fallback;
  try {
    const u = new URL(next, "https://hobbystrada.local");
    if (u.origin !== "https://hobbystrada.local") return fallback;
    if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
    return u.pathname + u.search + u.hash;
  } catch {
    return fallback;
  }
}
