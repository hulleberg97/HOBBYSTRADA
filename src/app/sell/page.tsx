import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { SellForm } from "@/components/SellForm";
import { getUser, getVerification } from "@/lib/auth";
import { hasVippsLogin } from "@/lib/vipps-login";
import { VippsButton } from "@/components/VerifiedBadge";

export const metadata: Metadata = { title: "Legg ut kort" };
export const dynamic = "force-dynamic";

export default async function SellPage() {
  const user = await getUser();
  const mustVerify = hasVippsLogin() && !(user && (await getVerification(user.id)));
  return (
    <>
      <PageHeader
        eyebrow="Ny annonse"
        title="Legg ut kortet ditt"
        lead="Lag annonsen på et par minutter. Kjøperne kontakter deg direkte, og dere avtaler handelen selv."
      ></PageHeader>
      <section className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {!user && !mustVerify ? (
          <div className="mx-auto max-w-md rounded-3xl bg-white p-6 text-center ring-1 ring-slate-300/70 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">Logg inn for å legge ut kort</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Med en konto får du alle meldinger fra kjøpere på ett sted, og du kan enkelt endre annonsene dine.
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
            <p className="mt-4 text-xs text-muted-foreground">
              Vi får navnet, e-posten og poststedet ditt fra Vipps. Gateadressen lagres ikke.
            </p>
          </div>
        ) : (
          <SellForm user={user ? { name: user.name, email: user.email, location: user.location } : null} />
        )}
      </section>
    </>
  );
}
