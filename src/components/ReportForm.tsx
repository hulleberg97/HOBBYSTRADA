"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckIcon, FlagIcon } from "lucide-react";
import { REPORT_REASONS } from "@/lib/reports";
import { useUser } from "./useUser";

const field =
  "h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10";
const label = "mb-1.5 block text-sm font-medium text-slate-800";

export function ReportForm({ slug }: { slug: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const user = useUser();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("sending");
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ listing: slug, ...Object.fromEntries(new FormData(e.currentTarget)) }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Rapporten ble ikke sendt. Prøv igjen.");
      setState("error");
      return;
    }
    setState("sent");
  };

  if (state === "sent") {
    return (
      <div className="flex items-start gap-3 rounded-3xl bg-emerald-50 p-6 text-emerald-900 ring-1 ring-inset ring-emerald-200 sm:p-8">
        <CheckIcon className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-heading text-lg font-bold">Takk for at du sa fra</p>
          <p className="mt-1 text-sm">Vi ser på annonsen og fjerner den hvis den bryter vilkårene.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="relative rounded-3xl bg-white p-5 ring-1 ring-slate-200 sm:p-8" onSubmit={submit}>
      <div className="mb-6 flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 ring-1 ring-inset ring-slate-200">
        <FlagIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span>
          Du rapporterer{" "}
          <Link href={`/products/${slug}`} className="font-medium text-primary underline underline-offset-2">
            denne annonsen
          </Link>
          . Er du blitt svindlet, bør du også kontakte politiet.
        </span>
      </div>
      <div className="grid gap-5">
        <div>
          <label htmlFor="report-reason" className={label}>
            Hva er galt?
          </label>
          <select id="report-reason" name="reason" required defaultValue="" className={field}>
            <option value="" disabled>
              Velg en grunn
            </option>
            {REPORT_REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="report-details" className={label}>
            Beskriv kort (valgfritt)
          </label>
          <textarea id="report-details" name="details" rows={4} maxLength={2000} className={`${field} h-auto resize-y py-3`} />
        </div>
        {user ? (
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-inset ring-slate-200">
            Sendes fra <span className="font-semibold text-slate-900">{user.fullName}</span> ({user.email}). Vi kan svare deg på e-post.
          </p>
        ) : (
          <div>
            <label htmlFor="report-email" className={label}>
              Din e-post (valgfritt, hvis vi skal kunne svare deg)
            </label>
            <input id="report-email" name="email" type="email" maxLength={320} autoComplete="email" className={field} />
          </div>
        )}
      </div>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} name="_hp" />
      {state === "error" && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60 sm:w-auto"
      >
        {state === "sending" ? "Sender …" : "Send rapport"}
      </button>
    </form>
  );
}
