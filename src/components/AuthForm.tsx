"use client";

import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { browserClient } from "@/lib/supabase";
import { VippsButton } from "./VerifiedBadge";
import * as ui from "./ui";

const field = ui.field;
const label = ui.fieldLabel;
const button = `${ui.btnPrimary} w-full`;

type Mode = "login" | "register" | "forgot" | "reset";

const COPY: Record<Mode, { title: string; lead: string; submit: string }> = {
  login: { title: "Logg inn", lead: "Logg inn for å legge ut kort, chatte med andre samlere og få varsler om nye kort.", submit: "Logg inn" },
  register: { title: "Opprett konto", lead: "Lag en gratis konto for å legge ut kort og kontakte selgere", submit: "Opprett konto" },
  forgot: { title: "Glemt passord", lead: "Skriv inn e-posten din, så sender vi deg en lenke for å lage nytt passord", submit: "Send lenke" },
  reset: { title: "Nytt passord", lead: "Velg et nytt passord for kontoen din", submit: "Lagre passord" },
};

export function AuthForm({ mode, vipps = false }: { mode: Mode; vipps?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/account";
  const vippsError = {
    vipps: "Innloggingen med Vipps ble avbrutt eller feilet. Prøv igjen.",
    "vipps-koblet": "Denne Vipps-kontoen er allerede koblet til en annen bruker.",
    alder: "Du må bekrefte at du er minst 18 år for å lage konto på HOBBYSTRADA.",
    utestengt: "Denne kontoen er stengt fordi den har brutt brukervilkårene. Mener du dette er feil, kan du klage via kontaktskjemaet.",
  }[params.get("feil") ?? ""];
  const [busy, setBusy] = useState(false);
  const [adult, setAdult] = useState(false); // egenerklæring: minst 18 år
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState("");
  const c = COPY[mode];
  // Med Vipps slått på verifiserer alle seg med Vipps. E-post er bare for kontoer som finnes fra før.
  const vippsOnly = vipps && (mode === "login" || mode === "register");
  // Bare Vipps for alle. ?epost=1 viser e-postinnlogging for testkontoen frem til lansering.
  const showEmail = params.get("epost") === "1";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const db = browserClient();
    if (!db) {
      setError("Innlogging er ikke slått på ennå.");
      return;
    }
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    setError("");
    const origin = window.location.origin;
    let err: { message: string } | null = null;
    if (mode === "login") {
      ({ error: err } = await db.auth.signInWithPassword({ email: f.email, password: f.password }));
      if (!err) {
        router.replace(next);
        router.refresh();
        return;
      }
    } else if (mode === "register") {
      const { data, error } = await db.auth.signUp({
        email: f.email,
        password: f.password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/account`,
          data: { first_name: f.first_name, last_name: f.last_name, username: f.first_name, location: f.location?.trim() },
        },
      });
      err = error;
      if (!err && data.session) {
        router.replace("/account");
        router.refresh();
        return;
      }
      if (!err) setDone("Sjekk e-posten din og trykk på lenken for å bekrefte kontoen.");
    } else if (mode === "forgot") {
      ({ error: err } = await db.auth.resetPasswordForEmail(f.email, { redirectTo: `${origin}/auth/callback?next=/auth/reset-password` }));
      if (!err) setDone("Hvis e-posten finnes hos oss, har vi sendt deg en lenke.");
    } else {
      ({ error: err } = await db.auth.updateUser({ password: f.password }));
      if (!err) {
        router.replace("/account");
        router.refresh();
        return;
      }
    }
    if (err) setError(translate(err.message));
    setBusy(false);
  };

  return (
    <div className="min-h-screen">
      <div className="container-custom py-16 sm:py-24">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-6 ring-1 ring-slate-300/70 sm:p-10">
          <div className="mb-8 text-center">
            <div className="flex justify-center">
              <ui.Eyebrow center>HOBBYSTRADA</ui.Eyebrow>
            </div>
            <h1 className="mt-3 font-heading text-[2rem] font-bold tracking-[-0.03em] text-slate-950">{c.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {vippsOnly ? "Alle kjøpere og selgere på HOBBYSTRADA bekrefter seg med Vipps. Det tar bare noen sekunder." : c.lead}
            </p>
          </div>
          {done ? (
            <p className="rounded-2xl bg-emerald-50 p-4 text-center text-sm text-emerald-800 ring-1 ring-inset ring-emerald-200">{done}</p>
          ) : (
            <>
              {vippsOnly && (
                <div className="mb-8">
                  {vippsError && <p className="mb-3 text-sm text-destructive">{vippsError}</p>}
                  <label className="mb-4 flex cursor-pointer items-start gap-3 text-sm text-slate-700">
                    <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]" />
                    <span>
                      Jeg bekrefter at jeg er minst 18 år, og godtar{" "}
                      <Link href="/vilkar" target="_blank" className="font-medium text-slate-900 underline underline-offset-2">
                        vilkårene
                      </Link>{" "}
                      og{" "}
                      <Link href="/personvern" target="_blank" className="font-medium text-slate-900 underline underline-offset-2">
                        personvernerklæringen
                      </Link>
                      .
                    </span>
                  </label>
                  {adult ? (
                    <VippsButton href={`/auth/vipps?alder=1&next=${encodeURIComponent(next)}`} label={mode === "login" ? "Logg inn med Vipps" : "Fortsett med Vipps"} />
                  ) : (
                    <span aria-disabled="true" className="flex h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-[#ff5b24]/40 text-sm font-semibold text-white">
                      {mode === "login" ? "Logg inn med Vipps" : "Fortsett med Vipps"}
                    </span>
                  )}
                  <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
                    Vi får navnet, e-posten og poststedet ditt fra Vipps. Ved å fortsette godtar du{" "}
                    <Link href="/vilkar" target="_blank" className="underline underline-offset-2">
                      vilkårene
                    </Link>
                    .
                  </p>
                  {mode === "login" && (
                    <p className="mt-6 text-center text-sm text-slate-600">Ny her? Kontoen lages automatisk første gang du logger inn med Vipps.</p>
                  )}
                </div>
              )}
              {(!vippsOnly || (mode === "login" && showEmail)) && (
                <form className="space-y-5" onSubmit={submit}>
                  {mode === "register" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="first_name" className={label}>
                          Fornavn
                        </label>
                        <input id="first_name" name="first_name" type="text" required autoComplete="given-name" className={field} placeholder="Ola" />
                      </div>
                      <div>
                        <label htmlFor="last_name" className={label}>
                          Etternavn
                        </label>
                        <input id="last_name" name="last_name" type="text" required autoComplete="family-name" className={field} placeholder="Nordmann" />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="location" className={label}>
                          Sted
                        </label>
                        <input
                          id="location"
                          name="location"
                          type="text"
                          required
                          maxLength={60}
                          autoComplete="address-level2"
                          className={field}
                          placeholder="F.eks. Kongsberg"
                        />
                        <p className="mt-1.5 text-xs text-muted-foreground">Vises i annonsene dine, så kjøpere ser hvor kortet er.</p>
                      </div>
                    </div>
                  )}
                  {mode !== "reset" && (
                    <div>
                      <label htmlFor="email" className={label}>
                        E-post
                      </label>
                      <input id="email" name="email" type="email" required autoComplete="email" className={field} placeholder="deg@eksempel.no" />
                    </div>
                  )}
                  {mode !== "forgot" && (
                    <div>
                      <label htmlFor="password" className={label}>
                        Passord
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPw ? "text" : "password"}
                          required
                          minLength={mode === "login" ? undefined : 8}
                          autoComplete={mode === "login" ? "current-password" : "new-password"}
                          className={field}
                          placeholder={mode === "login" ? "Ditt passord" : "Minst 8 tegn"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          aria-label={showPw ? "Skjul passordet" : "Vis passordet"}
                          aria-pressed={showPw}
                          className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          {showPw ? (
                            <EyeOffIcon className="h-[18px] w-[18px]" aria-hidden="true" />
                          ) : (
                            <EyeIcon className="h-[18px] w-[18px]" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  {mode === "login" && (
                    <div className="flex items-center justify-between">
                      <Link className="ml-auto py-2 text-sm text-primary underline underline-offset-[3px] transition-colors hover:text-black" href="/auth/forgot-password">
                        Glemt passord?
                      </Link>
                    </div>
                  )}
                  {mode === "register" && (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Ved å opprette konto godtar du{" "}
                      <Link href="/vilkar" target="_blank" className="underline underline-offset-2">
                        vilkårene
                      </Link>
                      . HOBBYSTRADA er en annonseplass og ikke part i handel mellom brukerne.
                    </p>
                  )}
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <button type="submit" disabled={busy} className={button}>
                    {busy ? "Et øyeblikk …" : c.submit}
                  </button>
                </form>
              )}
            </>
          )}
          {mode === "login" && !vippsOnly && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Har du ikke konto?{" "}
              <Link className="font-semibold text-foreground underline underline-offset-4" href="/auth/register">
                Opprett konto
              </Link>
            </p>
          )}
          {mode === "register" && !vippsOnly && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Har du allerede konto?{" "}
              <Link className="font-semibold text-foreground underline underline-offset-4" href="/auth/login">
                Logg inn
              </Link>
            </p>
          )}
          {mode === "forgot" && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              <Link className="font-semibold text-foreground underline underline-offset-4" href="/auth/login">
                Tilbake til innlogging
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function translate(msg: string) {
  if (/invalid login/i.test(msg)) return "Feil e-post eller passord.";
  if (/already registered/i.test(msg)) return "Det finnes allerede en konto med denne e-posten. Logg inn i stedet.";
  if (/email not confirmed/i.test(msg)) return "Du må bekrefte e-posten din først. Sjekk innboksen.";
  if (/password/i.test(msg) && /characters/i.test(msg)) return "Passordet må ha minst 8 tegn.";
  if (/rate limit/i.test(msg)) return "For mange forsøk. Vent litt og prøv igjen.";
  return "Noe gikk galt. Prøv igjen.";
}
