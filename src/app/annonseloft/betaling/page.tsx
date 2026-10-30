import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon, ClockIcon, XIcon } from "lucide-react";
import { adminClient } from "@/lib/supabase-admin";
import { settleBoost, type SettleResult } from "@/lib/settle-boost";
import { AutoRefresh } from "@/components/AutoRefresh";
import { BoostSuccess } from "@/components/BoostSuccess";
import { activeBoost, type BoostKey } from "@/lib/boosts";
import { fromRow } from "@/lib/listings";
import { getUser, isAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Betaling", robots: { index: false } };
export const dynamic = "force-dynamic";

const COPY: Record<SettleResult, { title: string; text: string; Icon: typeof CheckIcon; tone: string }> = {
  paid: { title: "Betalingen er gjennomført", text: "Løftet er aktivert. Du finner annonsen under Min side.", Icon: CheckIcon, tone: "bg-emerald-600" },
  waiting: {
    title: "Venter på Vipps",
    text: "Vi har ikke fått bekreftelse fra Vipps ennå. Siden oppdaterer seg selv straks betalingen er registrert.",
    Icon: ClockIcon,
    tone: "bg-accent",
  },
  cancelled: { title: "Betalingen ble avbrutt", text: "Ingenting er trukket. Du kan prøve igjen når du vil.", Icon: XIcon, tone: "bg-slate-700" },
  unknown: { title: "Fant ikke bestillingen", text: "Ta kontakt med oss hvis du har betalt, så ordner vi det.", Icon: XIcon, tone: "bg-slate-700" },
};

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ ordre?: string }> }) {
  const id = (await searchParams).ordre ?? "";
  const db = adminClient();
  let result: SettleResult = "unknown";
  // Bare den som bestilte (eller admin) kan se og avslutte bestillingen
  const user = await getUser();
  const { data: owner } = db && /^[0-9a-f-]{36}$/.test(id) ? await db.from("boost_orders").select("user_id").eq("id", id).maybeSingle() : { data: null };
  const allowed = Boolean(owner && user && (owner.user_id === user.id || isAdmin(user)));
  if (db && allowed) {
    try {
      result = await settleBoost(db, id);
    } catch (e) {
      console.error(e);
      result = "waiting";
    }
  }
  if (result === "paid" && db) {
    const { data: order } = await db.from("boost_orders").select("plan, listings(*)").eq("id", id).maybeSingle();
    const row = order?.listings as unknown as Record<string, string | null> | null;
    if (order && row) {
      return (
        <div className="px-4 py-16 sm:py-24">
          <BoostSuccess plan={order.plan as BoostKey} until={activeBoost(row)?.until ?? null} listing={fromRow(row as never)} />
        </div>
      );
    }
  }
  const c = COPY[result];
  return (
    <div className="container-custom py-24">
      {result === "waiting" && <AutoRefresh />}
      <div className="mx-auto max-w-md rounded-md border border-border bg-white p-8 text-center">
        <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white ${c.tone}`}>
          <c.Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight">{c.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/account" className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white">
            Til Min side
          </Link>
          {result === "cancelled" && (
            <Link href="/annonseloft" className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm font-semibold">
              Prøv igjen
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
