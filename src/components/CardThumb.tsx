import { initials } from "@/lib/format";

/** Lite bilde av kortet i lister. */
export function CardThumb({ image, title }: { image: string | null; title: string }) {
  return image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt="" className="h-14 w-10 shrink-0 rounded-md bg-slate-100 object-cover" />
  ) : (
    <span className="flex h-14 w-10 shrink-0 items-center justify-center rounded-md bg-primary font-heading text-xs font-semibold text-white">
      {initials(title)}
    </span>
  );
}
