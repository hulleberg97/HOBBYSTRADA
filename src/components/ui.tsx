import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

/**
 * Felles byggeklosser, så alle sider ser like ut:
 * lys bakgrunn, mørkeblå runde hovedknapper, runde knapper med ramme som andrevalg, og gull bare for premium.
 */
export const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50 sm:h-12 sm:px-6";
export const btnSecondary =
  "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-5 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 transition hover:ring-slate-500 sm:h-12 sm:px-6";
export const field =
  "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15";
export const fieldLabel = "mb-1.5 block text-sm font-semibold text-slate-900";

/** Liten gull-etikett med strek foran, brukt over overskrifter. */
export function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <p
      data-center={center ? "true" : undefined}
      className="eyebrow flex items-center data-[center=true]:justify-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6a24]"
    >
      <span className="h-px w-6 bg-[#cfa653]" aria-hidden="true"></span>
      {children}
    </p>
  );
}

/** Toppen av en underside: gull-etikett, stor overskrift og kort ingress på lys bakgrunn. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  center = false,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: React.ReactNode;
  center?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-slate-300/60">
      <div
        data-center={center ? "true" : undefined}
        className="group mx-auto max-w-[1320px] px-4 py-10 data-[center=true]:text-center sm:px-6 sm:py-14 lg:px-8"
      >
        <Eyebrow center={center}>{eyebrow}</Eyebrow>
        <h1 className="mt-3 font-heading text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-slate-950 sm:text-[44px]">{title}</h1>
        {lead && <p className="mt-3 max-w-xl text-base text-slate-600 group-data-[center=true]:mx-auto sm:text-lg">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

/** «Har du kort i skuffen?» – samme boks på alle sider. */
export function SellCta({ secondary }: { secondary?: { href: string; label: string } }) {
  return (
    <section className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-white p-6 ring-1 ring-slate-300/70 sm:p-10 md:flex-row md:items-center">
      <div>
        <Eyebrow>Selg kortene dine</Eyebrow>
        <h2 className="mt-3 font-heading text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-3xl">Har du kort i skuffen?</h2>
        <p className="mt-2 max-w-lg text-[15px] text-slate-600">Legg dem ut på et par minutter og nå andre samlere.</p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <Link className={btnPrimary} href="/selg">
          Legg ut kort
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </Link>
        {secondary && (
          <Link className={btnSecondary} href={secondary.href}>
            {secondary.label}
          </Link>
        )}
      </div>
    </section>
  );
}
