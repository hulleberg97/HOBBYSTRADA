"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CheckIcon, InfoIcon } from "lucide-react";

const field =
  "h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10";
const label = "mb-1.5 block text-sm font-medium text-slate-800";

export function ContactForm() {
  const params = useSearchParams();
  const report = params.get("rapport");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Meldingen ble ikke sendt. Prøv igjen.");
      setState("sent");
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="flex items-start gap-3 rounded-3xl bg-emerald-50 p-6 text-emerald-900 ring-1 ring-inset ring-emerald-200 sm:p-8">
        <CheckIcon className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-heading text-lg font-bold">Takk for meldingen</p>
          <p className="mt-1 text-sm">Vi svarer deg på e-post så snart vi kan.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="relative rounded-3xl bg-white p-5 ring-1 ring-slate-200 sm:p-8" onSubmit={submit}>
      <div className="mb-6 flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 ring-1 ring-inset ring-slate-200">
        <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        Gjelder det et bestemt kort? Kontakt selgeren direkte fra annonsen – vi er ikke part i handelen.
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-first-name" className={label}>
            Fornavn
          </label>
          <input id="contact-first-name" name="first_name" type="text" required maxLength={100} className={field} autoComplete="given-name" />
        </div>
        <div>
          <label htmlFor="contact-last-name" className={label}>
            Etternavn
          </label>
          <input id="contact-last-name" name="last_name" type="text" maxLength={99} className={field} autoComplete="family-name" />
        </div>
        <div>
          <label htmlFor="contact-email" className={label}>
            E-post
          </label>
          <input id="contact-email" name="email" type="email" required maxLength={320} className={field} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="contact-topic" className={label}>
            Emne
          </label>
          <select
            id="contact-topic"
            name="topic"
            defaultValue={report ? "Rapporter annonse" : ""}
            className={`${field} appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10`}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="">Velg emne</option>
            <option value="Spørsmål om annonse">Spørsmål om annonse</option>
            <option value="Annonseløft og betaling">Annonseløft og betaling</option>
            <option value="Rapporter annonse">Rapporter annonse</option>
            <option value="Annet">Annet</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className={label}>
            Melding
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            required
            maxLength={4900}
            defaultValue={report ? `Jeg vil rapportere denne annonsen: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/products/${report}\n\nGrunn: ` : ""}
            className={`${field} h-auto resize-y py-3`}
          ></textarea>
          <p className="mt-1.5 text-xs text-slate-500">Gjelder det en annonse? Lim inn lenken til annonsen, eller oppgi spiller og kortnummer.</p>
        </div>
      </div>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} name="_hp" />
      {state === "error" && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60 sm:w-auto"
      >
        {state === "sending" ? "Sender …" : "Send melding"}
      </button>
    </form>
  );
}
