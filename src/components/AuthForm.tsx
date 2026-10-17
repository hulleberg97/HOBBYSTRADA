"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { browserClient } from "@/lib/supabase";

const field =
  "w-full border-b border-foreground/20 bg-transparent px-0 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors";
const label = "mb-2 block text-xs font-semibold uppercase tracking-widest";
const button =
  "flex w-full items-center justify-center gap-2 bg-foreground py-3.5 text-sm font-semibold uppercase tracking-wide text-background transition-opacity hover:opacity-90 disabled:opacity-50";

type Mode = "login" | "register" | "forgot" | "reset";

const COPY: Record<Mode, { title: string; lead: string; submit: string }> = {
  login: { title: "Logg inn", lead: "Logg inn for å legge ut og følge med på annonser", submit: "Logg inn" },
  register: { title: "Opprett konto", lead: "Lag en gratis konto for å legge ut kort og kontakte selgere", submit: "Opprett konto" },
  forgot: { title: "Glemt passord", lead: "Skriv inn e-posten din, så sender vi deg en lenke for å lage nytt passord", submit: "Send lenke" },
  reset: { title: "Nytt passord", lead: "Velg et nytt passord for kontoen din", submit: "Lagre passord" },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/account";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const c = COPY[mode];

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
          data: { first_name: f.first_name, last_name: f.last_name, username: f.first_name },
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
      <div className="container-custom py-24">
        <div className="mx-auto max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-h2 font-semibold">{c.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{c.lead}</p>
          </div>
          {done ? (
            <p className="rounded-2xl bg-emerald-50 p-4 text-center text-sm text-emerald-800 ring-1 ring-inset ring-emerald-200">{done}</p>
          ) : (
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
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={mode === "login" ? undefined : 8}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    className={field}
                    placeholder={mode === "login" ? "Ditt passord" : "Minst 8 tegn"}
                  />
                </div>
              )}
              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <Link className="ml-auto text-xs text-muted-foreground transition-colors hover:text-foreground" href="/auth/forgot-password">
                    Glemt passord?
                  </Link>
                </div>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button type="submit" disabled={busy} className={button}>
                {busy ? "Et øyeblikk …" : c.submit}
              </button>
            </form>
          )}
          {mode === "login" && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Har du ikke konto?{" "}
              <Link className="font-semibold text-foreground underline underline-offset-4" href="/auth/register">
                Opprett konto
              </Link>
            </p>
          )}
          {mode === "register" && (
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
