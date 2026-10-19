const wholeKroner = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
const withOre = new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** «15 000 kr». Øre vises bare når beløpet ikke er helt. */
export function formatPrice(price: number) {
  return `${(Number.isInteger(Number(price)) ? wholeKroner : withOre).format(price)} kr`;
}

export function timeAgo(iso: string, now = Date.now()) {
  const minutes = Math.max(1, Math.round((now - new Date(iso).getTime()) / 60000));
  if (minutes < 60) return `For ${minutes} min siden`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `For ${hours} ${hours === 1 ? "time" : "timer"} siden`;
  const days = Math.round(hours / 24);
  if (days === 1) return "I går";
  return `For ${days} dager siden`;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
