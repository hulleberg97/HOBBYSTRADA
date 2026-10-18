"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ClockIcon, FlagIcon, MapPinIcon, MessageSquareIcon, Share2Icon } from "lucide-react";
import { formatPrice, timeAgo } from "@/lib/format";
import { FavoriteButton } from "./FavoriteButton";
import { VerifiedBadge, VippsButton } from "./VerifiedBadge";
import { useUser } from "./useUser";
import type { Listing } from "@/lib/types";

const input =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15";

export function ContactCard({ listing: l }: { listing: Listing }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [vippsNeeded, setVippsNeeded] = useState(false);
  const [shared, setShared] = useState(false);
  const [barOpen, setBarOpen] = useState(false);
  const [mode, setMode] = useState<"question" | "offer">("question");
  const card = useRef<HTMLDivElement>(null);
  const user = useUser();
  const router = useRouter();
  const loginHref = `/auth/login?next=${encodeURIComponent(`/products/${l.slug}`)}`;
  const own = Boolean(user && l.ownerId && user.id === l.ownerId);

  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setBarOpen(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const openForm = () => {
    if (user === null) return router.push(loginHref);
    setOpen(true);
    card.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ listing: l.slug, ...Object.fromEntries(f) }),
      });
      const data = await res.json().catch(() => ({}));
      setVippsNeeded(Boolean(data.vipps));
      if (!res.ok) throw new Error(data.error || "Meldingen ble ikke sendt. Prøv igjen om litt.");
      router.push(`/meldinger/${data.id}`);
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: l.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {}
  };

  return (
    <>
      <div
        ref={card}
        id="kontakt"
        data-featured={l.featured ? "true" : undefined}
        className="scroll-mt-24 rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)] ring-1 ring-slate-200 data-[featured=true]:ring-2 data-[featured=true]:ring-accent sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Pris</p>
            <div className="mt-0.5">
              <span className="font-heading text-3xl font-semibold tracking-tight">{formatPrice(l.price)}</span>
            </div>
          </div>
          <span
            data-state={l.status}
            className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 data-[state=sold]:bg-slate-100 data-[state=sold]:text-slate-600 data-[state=sold]:ring-slate-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true"></span>
            {l.status === "sold" ? "Solgt" : "Aktiv annonse"}
          </span>
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-base font-semibold text-primary-foreground">
            {l.seller[0]?.toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500">Selger</p>
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Link href={`/selger/${l.ownerId ?? "hobbystrada"}`} className="truncate text-sm font-semibold text-slate-900 hover:underline">
                {l.seller}
              </Link>
              {l.sellerVerified && <VerifiedBadge />}
            </span>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {l.location ?? "Sted ikke oppgitt"}
              </span>
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
                <span suppressHydrationWarning>Lagt ut {timeAgo(l.createdAt).toLowerCase()}</span>
              </span>
            </div>
          </div>
        </div>
        {l.status === "active" && (
          <div className="mt-5">
            <div className="grid gap-2.5">
              {own ? (
                <Link
                  href="/meldinger"
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-slate-100 px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
                >
                  <MessageSquareIcon className="h-4 w-4" aria-hidden="true" />
                  Dette er din annonse – se meldinger
                </Link>
              ) : user === null ? (
                <Link
                  href={loginHref}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  <MessageSquareIcon className="h-4 w-4" aria-hidden="true" />
                  Logg inn for å sende melding
                </Link>
              ) : (
                <button
                  type="button"
                  aria-expanded={open}
                  disabled={user === undefined}
                  onClick={() => setOpen(!open)}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                >
                  <MessageSquareIcon className="h-4 w-4" aria-hidden="true" />
                  Send melding til selger
                </button>
              )}
            </div>
            {open && user && !own && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <form className="grid gap-3" onSubmit={send}>
                  <div role="tablist" aria-label="Type melding" className="grid grid-cols-2 gap-1 rounded-full bg-slate-100 p-1 text-sm font-semibold">
                    {(
                      [
                        ["question", "Still et spørsmål"],
                        ["offer", "Gi bud"],
                      ] as const
                    ).map(([k, label]) => (
                      <button
                        key={k}
                        type="button"
                        role="tab"
                        aria-selected={mode === k}
                        onClick={() => setMode(k)}
                        className="h-9 rounded-full text-slate-600 transition aria-selected:bg-white aria-selected:text-primary aria-selected:shadow-sm"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {mode === "offer" && (
                    <div className="relative">
                      <input
                        name="offer"
                        required
                        inputMode="numeric"
                        maxLength={9}
                        aria-label="Ditt bud i kroner"
                        placeholder={`Ditt bud (prisantydning ${formatPrice(l.price)})`}
                        className={`${input} h-11 pr-12 font-mono-data`}
                        onChange={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
                      />
                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono-data text-xs text-slate-500">kr</span>
                    </div>
                  )}
                  <textarea
                    name="message"
                    required
                    rows={4}
                    maxLength={2000}
                    aria-label="Melding"
                    className={`${input} py-3`}
                    key={mode}
                    defaultValue={
                      mode === "offer" ? `Hei! Jeg vil gjerne by på «${l.title}». Gi meg beskjed om budet passer.` : `Hei! Er «${l.title}» fortsatt til salgs?`
                    }
                  />
                  <p className="text-xs text-slate-500">Meldingen sendes i chatten på HOBBYSTRADA. E-postadressen din deles ikke med selgeren.</p>
                  {state === "error" && <p className="text-sm text-destructive">{error}</p>}
                  {vippsNeeded && <VippsButton href={`/auth/vipps?next=${encodeURIComponent(`/products/${l.slug}`)}`} label="Bekreft med Vipps" />}
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                  >
                    {state === "sending" ? "Sender …" : mode === "offer" ? "Send bud" : "Send melding"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
        <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm">
          <FavoriteButton slug={l.slug} title={l.title} variant="detail" />
          <button
            type="button"
            onClick={share}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Share2Icon className="h-4 w-4" aria-hidden="true" />
            {shared ? "Lenke kopiert" : "Del"}
          </button>
          <Link
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            href={`/contact?rapport=${l.slug}`}
          >
            <FlagIcon className="h-4 w-4" aria-hidden="true" />
            Rapporter
          </Link>
        </div>
      </div>
      {l.status === "active" && (
        <div
          data-open={barOpen ? "true" : undefined}
          aria-hidden={!barOpen}
          className="fixed inset-x-0 bottom-0 z-30 flex translate-y-full items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur transition-transform duration-200 data-[open=true]:translate-y-0 lg:hidden"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-slate-500">{l.seller}</p>
            <span className="font-heading text-lg font-semibold tracking-tight">{formatPrice(l.price)}</span>
          </div>
          <button
            type="button"
            tabIndex={barOpen ? 0 : -1}
            onClick={openForm}
            className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            <MessageSquareIcon className="h-4 w-4" aria-hidden="true" />
            Send melding
          </button>
        </div>
      )}
    </>
  );
}
