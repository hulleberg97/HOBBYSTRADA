import { BadgeCheckIcon } from "lucide-react";

/** «Verifisert med Vipps»: selgeren har bekreftet identiteten sin med Vipps (BankID). */
export function VerifiedBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      title="Selgeren har bekreftet navnet sitt med Vipps"
      className={`inline-flex items-center gap-1 rounded-full bg-[#ff5b24]/10 py-0.5 text-[11px] font-semibold text-[#c2410c] ring-1 ring-inset ring-[#ff5b24]/25 ${compact ? "px-0.5" : "px-2"}`}
    >
      <BadgeCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
      {/* På annonsekortene vises bare haken, så stedet og tiden får plass på linja */}
      {compact ? <span className="sr-only">Verifisert med Vipps</span> : "Verifisert med Vipps"}
    </span>
  );
}

export function VippsButton({ href, label = "Logg inn med Vipps" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ff5b24] text-sm font-semibold text-white transition hover:bg-[#e94f1b]"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm2.6 5.4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM7.2 11.2c.4-.3 1-.2 1.3.2 1.6 2.1 3 3 3.5 3 .6 0 1.9-.9 3.5-3 .3-.4.9-.5 1.3-.2.4.3.5.9.2 1.3-1.7 2.3-3.5 3.8-5 3.8s-3.3-1.5-5-3.8c-.3-.4-.2-1 .2-1.3Z" />
      </svg>
      {label}
    </a>
  );
}
