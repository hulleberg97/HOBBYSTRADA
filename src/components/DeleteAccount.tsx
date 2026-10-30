"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { browserClient } from "@/lib/supabase";

export function DeleteAccount() {
  const router = useRouter();
  const [step, setStep] = useState<"idle" | "confirm" | "busy">("idle");
  const [error, setError] = useState("");

  const remove = async () => {
    setStep("busy");
    const res = await fetch("/api/account", { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Noe gikk galt.");
      setStep("confirm");
      return;
    }
    await browserClient()?.auth.signOut();
    router.replace("/");
    router.refresh();
  };

  return (
    <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
      <h3 className="font-semibold text-slate-950">Slett konto</h3>
      <p className="mt-1 text-sm text-slate-600">Kontoen, annonsene, bildene, varslene og de lagrede søkene dine slettes for godt. Meldinger du har sendt, blir stående hos den du har skrevet med, merket «Slettet bruker», til samtalen slettes etter 12 måneder. Kvitteringer for annonseløft beholdes så lenge bokføringsloven krever.</p>
      {step === "idle" ? (
        <button
          type="button"
          onClick={() => setStep("confirm")}
          className="mt-4 inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-destructive ring-1 ring-inset ring-destructive/30 transition hover:bg-destructive/5"
        >
          Slett kontoen min
        </button>
      ) : (
        <div className="mt-4 rounded-2xl bg-destructive/5 p-4 ring-1 ring-inset ring-destructive/20">
          <p className="text-sm font-medium text-slate-900">Er du sikker? Dette kan ikke angres.</p>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={step === "busy"}
              onClick={remove}
              className="inline-flex h-10 items-center rounded-full bg-destructive px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {step === "busy" ? "Sletter …" : "Ja, slett alt"}
            </button>
            <button
              type="button"
              onClick={() => setStep("idle")}
              className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-slate-600 hover:bg-white"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
