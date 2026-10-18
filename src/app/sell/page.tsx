import type { Metadata } from "next";
import Link from "next/link";
import { SellForm } from "@/components/SellForm";
import { getUser, getVerification } from "@/lib/auth";
import { hasVippsLogin } from "@/lib/vipps-login";
import { VippsButton } from "@/components/VerifiedBadge";

export const metadata: Metadata = { title: "Legg ut kort" };
export const dynamic = "force-dynamic";

const STEPS = [
  ["Lag annonsen", "Spiller, sett, tilstand, pris, sted og bilder."],
  ["Ute i markedet", "Vises med kortdata for samlere i hele Norge."],
  ["Kjøpere tar kontakt", "Chat direkte med kjøperne."],
  ["Løft om du vil", "Fremhev annonsen for å selge raskere."],
];

export default async function SellPage() {
  const user = await getUser();
  const mustVerify = hasVippsLogin() && !(user && (await getVerification(user.id)));
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1320px] px-4 pb-10 pt-12 sm:px-6 lg:px-8 lg:pb-12 lg:pt-16">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
            <div>
              <p className="font-mono-data text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Ny annonse</p>
              <h1 className="mt-4 font-heading text-4xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-5xl lg:text-6xl">Legg ut kortet ditt</h1>
            </div>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Lag annonsen på et par minutter. Kjøperne kontakter deg direkte, og dere avtaler handelen selv.
            </p>
          </div>
          <ol className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-foreground pt-6 lg:grid-cols-4">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[2rem_1fr]">
                <span className="font-mono-data text-xs text-muted-foreground">0{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold">{t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {!user && !mustVerify ? (
          <div className="mx-auto max-w-md rounded-md border border-border bg-white p-6 text-center sm:p-8">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">Logg inn for å legge ut kort</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Med en konto får du meldinger fra kjøpere samlet på ett sted, og du kan endre og følge med på annonsene dine.
            </p>
            <div className="mt-6 grid gap-2">
              <Link href="/auth/login?next=/sell" className="flex h-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                Logg inn
              </Link>
              <Link href="/auth/register" className="flex h-12 items-center justify-center rounded-full border border-border text-sm font-semibold">
                Opprett gratis konto
              </Link>
            </div>
          </div>
        ) : mustVerify ? (
          <div className="mx-auto max-w-md rounded-md border border-border bg-white p-6 text-center sm:p-8">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">Bekreft deg med Vipps</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Alle selgere bekrefter navnet sitt med Vipps. Det gjør markedet tryggere for kjøperne, og annonsene dine får merket «Verifisert med Vipps».
            </p>
            <div className="mt-6">
              <VippsButton href="/auth/vipps?next=/sell" label={user ? "Bekreft med Vipps" : "Fortsett med Vipps"} />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Vi får bare navnet, telefonnummeret og e-posten din fra Vipps. Telefonnummeret vises aldri.</p>
          </div>
        ) : (
          <SellForm user={user ? { name: user.name, email: user.email } : null} />
        )}
      </section>
    </>
  );
}
