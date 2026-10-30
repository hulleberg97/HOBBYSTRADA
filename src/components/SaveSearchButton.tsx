"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "./useUser";
import { useState } from "react";
import { BellIcon, CheckIcon } from "lucide-react";

/** «Varsle meg»: lagrer søket i adressen og sender e-post når nye kort passer. */
export function SaveSearchButton() {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const [state, setState] = useState<"idle" | "busy" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const query = params.toString();
  const user = useUser();
  const [savedQuery, setSavedQuery] = useState("");

  const save = async () => {
    // Uinnlogget sendes rett til innlogging, uten et mislykket kall først
    if (user === null) {
      router.push(`/auth/login?next=${encodeURIComponent(`${path}?${query}`)}`);
      return;
    }
    setState("busy");
    const res = await fetch("/api/saved-searches", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query }) });
    if (res.status === 401) {
      router.push(`/auth/login?next=${encodeURIComponent(`${path}?${query}`)}`);
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Kunne ikke lagre varselet.");
      setState("error");
      return;
    }
    setSavedQuery(query);
    setState("saved");
  };

  const saved = state === "saved" && savedQuery === query;
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={save}
        disabled={state === "busy" || saved}
        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-[13px] font-semibold text-white transition hover:bg-black disabled:opacity-80"
      >
        {saved ? <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> : <BellIcon className="h-3.5 w-3.5" aria-hidden="true" />}
        {saved ? "Du får varsel om nye kort" : "Varsle meg om nye kort"}
      </button>
      {state === "error" && <span className="text-xs text-destructive">{error}</span>}
    </span>
  );
}
