"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ImageIcon, SendIcon, TagIcon, XIcon } from "lucide-react";
import { formatPrice, initials } from "@/lib/format";
import type { ChatMessage, Conversation } from "@/lib/chat";
import { browserClient } from "@/lib/supabase";
import { resizeImage } from "@/lib/resize";

// Nye meldinger kommer i sanntid via Supabase. Henting hvert 30. sekund er bare en reserve.
const POLL_MS = 30000;

export function ListingThumb({ image, title, size = "md" }: { image: string | null; title: string; size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-12 w-9 rounded-md" : "h-16 w-12 rounded-lg";
  return image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt="" className={`${box} shrink-0 bg-slate-100 object-cover`} />
  ) : (
    <span className={`${box} flex shrink-0 items-center justify-center bg-primary font-heading text-xs font-semibold text-white`}>{initials(title)}</span>
  );
}

const day = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(Date.now() - 864e5);
  if (d.toDateString() === today.toDateString()) return "I dag";
  if (d.toDateString() === yesterday.toDateString()) return "I går";
  const label = d.toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" });
  return label[0].toUpperCase() + label.slice(1);
};
const time = (iso: string) => new Date(iso).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });

export function Chat({ conversation: c, initial }: { conversation: Conversation; initial: ChatMessage[] }) {
  const [messages, setMessages] = useState(initial);
  const [text, setText] = useState("");
  const [offer, setOffer] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<{ file: File; url: string } | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);
  const picker = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const last = messages.at(-1)?.createdAt;

  const poll = useCallback(async () => {
    if (document.visibilityState !== "visible") return;
    const res = await fetch(`/api/chat/${c.id}${last ? `?etter=${encodeURIComponent(last)}` : ""}`, { cache: "no-store" }).catch(() => null);
    const data = res?.ok ? await res.json() : null;
    if (data?.messages?.length) {
      setMessages((prev) => [...prev, ...data.messages.filter((m: ChatMessage) => !prev.some((p) => p.id === m.id))]);
    }
  }, [c.id, last]);

  const latest = useRef(poll);
  useEffect(() => {
    latest.current = poll;
  }, [poll]);

  useEffect(() => {
    const t = setInterval(poll, POLL_MS);
    document.addEventListener("visibilitychange", poll);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", poll);
    };
  }, [poll]);

  // Sanntid: når en ny melding lagres i samtalen, hentes den med en gang
  useEffect(() => {
    const db = browserClient();
    if (!db) return;
    const channel = db
      .channel(`samtale-${c.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${c.id}` }, () => latest.current())
      .subscribe();
    return () => {
      db.removeChannel(channel);
    };
  }, [c.id]);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
    window.dispatchEvent(new Event("hs:unread"));
  }, [messages.length]);

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Velg et bilde.");
      return;
    }
    setError("");
    if (image) URL.revokeObjectURL(image.url);
    setImage({ file, url: URL.createObjectURL(file) });
  };

  const clearImage = () => {
    if (image) URL.revokeObjectURL(image.url);
    setImage(null);
  };

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const body = text.trim();
    if ((!body && !image) || sending) return;
    setSending(true);
    setError("");
    let request: RequestInit;
    if (image) {
      // Bildet gjøres mindre i nettleseren først, så det sendes raskt også på mobil
      const form = new FormData();
      form.append("message", body);
      if (offer) form.append("offer", offer);
      form.append("image", await resizeImage(image.file));
      request = { method: "POST", body: form };
    } else {
      request = { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: body, offer: offer || undefined }) };
    }
    const res = await fetch(`/api/chat/${c.id}`, request).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    setSending(false);
    if (!res?.ok) {
      setError(data.error ?? "Meldingen ble ikke sendt. Prøv igjen.");
      return;
    }
    setMessages((prev) => [...prev, data.message]);
    setText("");
    setOffer(null);
    clearImage();
  };

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-128px)] max-w-[880px] flex-col bg-white md:min-h-[calc(100dvh-72px)]">
      <div className="sticky top-[128px] z-10 flex items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 md:top-[72px]">
        <Link href="/meldinger" aria-label="Tilbake til meldinger" className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100">
          <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <ListingThumb image={c.listingImage} title={c.listingTitle} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-950">{c.otherName}</p>
          <Link href={`/products/${c.listingSlug}`} className="block truncate text-xs text-slate-500 hover:underline">
            {c.listingTitle}
          </Link>
        </div>
      </div>

      <div className="flex-1 space-y-1.5 px-4 py-5 sm:px-6">
        <p className="mx-auto mb-4 max-w-md rounded-2xl bg-slate-50 px-4 py-3 text-center text-xs leading-relaxed text-slate-600">
          Dere avtaler betaling og frakt direkte. HOBBYSTRADA er ikke part i handelen. Del aldri BankID, passord eller koder.
        </p>
        {messages.map((m, i) => {
          const newDay = i === 0 || day(m.createdAt) !== day(messages[i - 1].createdAt);
          return (
            <div key={m.id}>
              {newDay && (
                <p className="py-3 text-center text-xs font-medium text-slate-500" suppressHydrationWarning>
                  {day(m.createdAt)}
                </p>
              )}
              <div data-mine={m.mine ? "true" : undefined} className="group flex flex-col items-start data-[mine=true]:items-end">
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-2.5 text-[15px] leading-relaxed text-slate-900 group-data-[mine=true]:rounded-bl-2xl group-data-[mine=true]:rounded-br-md group-data-[mine=true]:bg-primary group-data-[mine=true]:text-white sm:max-w-[70%]">
                  {m.offer && (
                    <p className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                      <TagIcon className="h-3 w-3" aria-hidden="true" />
                      Bud: {formatPrice(m.offer)}
                    </p>
                  )}
                  {m.image && (
                    <button
                      type="button"
                      onClick={() => setZoom(m.image)}
                      className="-mx-2 mb-1 mt-0.5 block overflow-hidden rounded-xl"
                      aria-label="Vis bildet større"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.image} alt="Bilde i meldingen" className="max-h-72 w-auto max-w-full object-cover" loading="lazy" />
                    </button>
                  )}
                  {m.body && <p className="whitespace-pre-line break-words">{m.body}</p>}
                </div>
                <span className="mt-0.5 px-1 text-[11px] text-slate-400" suppressHydrationWarning>
                  {time(m.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={end} />
      </div>

      <form onSubmit={send} className="sticky bottom-0 border-t border-slate-200 bg-white px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 sm:px-6">
        {error && <p className="mb-2 text-sm text-destructive">{error}</p>}
        {image && (
          <div className="relative mb-2 inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt="Bildet du sender" className="h-24 w-auto rounded-xl object-cover ring-1 ring-slate-200" />
            <button
              type="button"
              onClick={clearImage}
              aria-label="Fjern bildet"
              className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white shadow"
            >
              <XIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
        {offer !== null && (
          <div className="relative mb-2">
            <input
              autoFocus
              inputMode="numeric"
              maxLength={9}
              value={offer}
              onChange={(e) => setOffer(e.target.value.replace(/\D/g, ""))}
              aria-label="Ditt bud i kroner"
              placeholder="Ditt bud"
              className="h-11 w-full rounded-xl border border-slate-200 px-3.5 pr-12 font-mono-data text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono-data text-xs text-slate-500">kr</span>
          </div>
        )}
        <div className="flex items-end gap-2">
          {c.role === "buyer" && (
            <button
              type="button"
              onClick={() => setOffer(offer === null ? "" : null)}
              aria-pressed={offer !== null}
              className="flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 aria-pressed:border-accent aria-pressed:bg-accent/10"
            >
              <TagIcon className="h-4 w-4" aria-hidden="true" />
              Bud
            </button>
          )}
          <input ref={picker} type="file" accept="image/*" onChange={pick} className="hidden" />
          <button
            type="button"
            onClick={() => picker.current?.click()}
            aria-label="Legg ved bilde"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-50"
          >
            <ImageIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && window.matchMedia("(pointer: fine)").matches) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            maxLength={2000}
            placeholder={image ? "Skriv noe til bildet (valgfritt)" : "Skriv en melding"}
            aria-label="Melding"
            className="max-h-40 min-h-11 flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-2.5 text-[15px] outline-none [field-sizing:content] focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <button
            type="submit"
            disabled={sending || (!text.trim() && !image)}
            aria-label="Send"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary/90 disabled:opacity-40"
          >
            <SendIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </form>

      {zoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Bilde"
          onClick={() => setZoom(null)}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom} alt="Bilde i meldingen" className="max-h-full max-w-full rounded-lg object-contain" />
          <button
            type="button"
            onClick={() => setZoom(null)}
            aria-label="Lukk"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white"
          >
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
