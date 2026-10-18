import type { Listing } from "./types";

/** Ren søke- og filterlogikk. Brukes både i nettleseren (markedet) og på serveren (varsler om lagrede søk). */

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

export function matches(l: Listing, q: string) {
  const hay = norm([l.title, l.player, l.set, l.club, l.league, l.cardNumber, l.numbered, l.types.join(" "), l.season].filter(Boolean).join(" "));
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (q.trim() === "/") return Boolean(l.numbered);
  if (/^rc$/i.test(q.trim())) return l.types.includes("Rookie") || / RC\b/.test(l.title);
  if (/^relic$/i.test(q.trim())) return l.types.includes("Relic") || l.types.includes("Patch");
  return terms.every((t) => hay.includes(t) || (t === "autograf" && hay.includes("autograph")));
}

export const TYPES = ["Autograf", "Patch", "Rookie", "Nummerert", "Base"];
export const typeLabel = (t: string) => (t === "Patch" ? "Patch / relic" : t);

// «Patch» dekker også eldre annonser merket «Relic» – det er samme type kort
export const hasType = (l: Listing, t: string) =>
  t === "Nummerert" ? Boolean(l.numbered) || l.types.includes(t) : t === "Patch" ? l.types.includes("Patch") || l.types.includes("Relic") : l.types.includes(t);

const LINES = [
  "Topps Chrome",
  "Museum Collection",
  "Inception",
  "Topps DECO",
  "Topps Finest",
  "Merlin",
  "Stadium Club",
  "Panini Prizm",
  "Panini Select",
  "Panini Donruss",
];

/** Produktserien et kort tilhører, f.eks. «Topps Chrome UCC Shadow Etch» → «Topps Chrome». */
export function lineOf(set: string | null) {
  if (!set) return null;
  const hit = LINES.find((x) => norm(set).includes(norm(x)));
  if (hit) return hit.startsWith("Topps") || hit.startsWith("Panini") ? hit : `Topps ${hit}`;
  return set.split(" ").slice(0, 2).join(" ");
}

/** «PSA 10» → PSA, «Ugradert (raw)» → raw. */
export function graderOf(grading: string | null) {
  if (!grading || /ugradert|raw/i.test(grading)) return "raw";
  return grading.split(" ")[0].toUpperCase();
}

/** «01/25» → 25 (opplag). Ikke nummerert → null. */
export function runOf(l: Listing) {
  const m = l.numbered?.match(/\/\s*(\d+)/) ?? l.cardNumber?.match(/^\d+\s*\/\s*(\d+)$/);
  return m ? Number(m[1]) : null;
}

export type Filters = {
  q: string;
  types: string[];
  club: string;
  league: string;
  line: string;
  grader: string;
  min: number | null;
  max: number | null;
  run: number | null;
  place: string;
  photo: boolean;
  sort: string;
  page: number;
};

export const EMPTY: Filters = {
  q: "",
  types: [],
  club: "",
  league: "",
  line: "",
  grader: "",
  min: null,
  max: null,
  run: null,
  place: "",
  photo: false,
  sort: "newest",
  page: 1,
};

const num = (v: string | null) => (v && /^\d+$/.test(v) ? Number(v) : null);

export function parseFilters(p: URLSearchParams | Record<string, string>): Filters {
  const sp = p instanceof URLSearchParams ? p : new URLSearchParams(p);
  return {
    q: sp.get("q") ?? "",
    types: (sp.get("type") ?? "").split(",").filter((t) => TYPES.includes(t)),
    club: sp.get("klubb") ?? "",
    league: sp.get("liga") ?? "",
    line: sp.get("sett") ?? "",
    grader: sp.get("gradering") ?? "",
    min: num(sp.get("fra")),
    max: num(sp.get("til")),
    run: num(sp.get("opplag")),
    place: sp.get("sted") ?? "",
    photo: sp.get("bilde") === "1",
    sort: sp.get("sort") ?? "newest",
    page: Math.max(1, num(sp.get("side")) ?? 1),
  };
}

export function toQuery(f: Filters) {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.types.length) sp.set("type", f.types.join(","));
  if (f.club) sp.set("klubb", f.club);
  if (f.league) sp.set("liga", f.league);
  if (f.line) sp.set("sett", f.line);
  if (f.grader) sp.set("gradering", f.grader);
  if (f.min !== null) sp.set("fra", String(f.min));
  if (f.max !== null) sp.set("til", String(f.max));
  if (f.run !== null) sp.set("opplag", String(f.run));
  if (f.place) sp.set("sted", f.place);
  if (f.photo) sp.set("bilde", "1");
  if (f.sort !== "newest") sp.set("sort", f.sort);
  if (f.page > 1) sp.set("side", String(f.page));
  return sp.toString();
}

/** Antall aktive filtre (søk, sortering og side teller ikke). */
export function activeCount(f: Filters) {
  return (
    f.types.length +
    [f.club, f.league, f.line, f.grader, f.place].filter(Boolean).length +
    Number(f.min !== null || f.max !== null) +
    Number(f.run !== null) +
    Number(f.photo)
  );
}

export function applyFilters(list: Listing[], f: Filters, skip?: keyof Filters) {
  return list.filter(
    (l) =>
      (!f.q || matches(l, f.q)) &&
      (skip === "types" || f.types.every((t) => hasType(l, t))) &&
      (skip === "club" || !f.club || l.club === f.club) &&
      (skip === "league" || !f.league || l.league === f.league) &&
      (skip === "line" || !f.line || lineOf(l.set) === f.line) &&
      (skip === "grader" || !f.grader || graderOf(l.grading) === f.grader) &&
      (f.min === null || l.price >= f.min) &&
      (f.max === null || l.price <= f.max) &&
      (skip === "run" || f.run === null || (runOf(l) ?? Infinity) <= f.run) &&
      (skip === "place" || !f.place || norm(l.location ?? "") === norm(f.place)) &&
      (!f.photo || Boolean(l.image)),
  );
}

export function sortListings(list: Listing[], sort: string) {
  if (sort === "price-low") return [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-high") return [...list].sort((a, b) => b.price - a.price);
  if (sort === "name") return [...list].sort((a, b) => a.title.localeCompare(b.title, "nb"));
  return list;
}

/** Verdier med antall treff, gitt de andre filtrene. Sortert etter flest treff. */
export function facet(list: Listing[], f: Filters, key: "club" | "league" | "line" | "grader" | "place") {
  const counts = new Map<string, number>();
  for (const l of applyFilters(list, f, key)) {
    const v = key === "line" ? lineOf(l.set) : key === "grader" ? graderOf(l.grading) : key === "place" ? l.location : l[key];
    if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "nb"));
}

export function describeFilters(f: Filters) {
  const parts = [
    f.q && `«${f.q}»`,
    ...f.types,
    f.club,
    f.league,
    f.line,
    f.grader && (f.grader === "raw" ? "Ugradert" : f.grader),
    f.min !== null && f.max !== null ? `${f.min}–${f.max} kr` : f.min !== null ? `over ${f.min} kr` : f.max !== null ? `under ${f.max} kr` : "",
    f.run !== null && (f.run === 1 ? "1/1" : `opplag ≤ /${f.run}`),
    f.place,
    f.photo && "med bilde",
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Alle kort";
}
