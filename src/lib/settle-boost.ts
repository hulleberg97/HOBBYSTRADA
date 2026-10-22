import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { activateBoost } from "./activate-boost";
import { capturePayment, getPayment, hasVipps } from "./vipps";

export type SettleResult = "paid" | "waiting" | "cancelled" | "unknown";

/** Sjekker Vipps-status for en bestilling. Er den godkjent, trekkes beløpet og løftet aktiveres. */
export async function settleBoost(db: SupabaseClient, orderId: string): Promise<SettleResult> {
  const { data: order } = await db.from("boost_orders").select("id, amount, status").eq("id", orderId).maybeSingle();
  if (!order) return "unknown";
  if (order.status === "paid") return "paid";
  if (order.status === "cancelled") return "cancelled";
  if (!hasVipps()) return "waiting";

  const payment = await getPayment(order.id);
  if (payment.state === "AUTHORIZED") {
    if (payment.captured < Math.round(Number(order.amount) * 100)) await capturePayment(order.id, Number(order.amount));
    await activateBoost(db, order.id);
    return "paid";
  }
  if (["ABORTED", "EXPIRED", "TERMINATED"].includes(payment.state)) {
    await db.from("boost_orders").update({ status: "cancelled" }).eq("id", order.id);
    return "cancelled";
  }
  return "waiting";
}

/**
 * Sjekker alle ubetalte bestillinger mot Vipps (eventuelt bare for én bruker). Fanger opp betalinger der kunden
 * ikke kom tilbake til siden, eller kom tilbake før Vipps hadde registrert betalingen. Returnerer antall aktiverte.
 */
export async function settlePending(db: SupabaseClient, userId?: string) {
  if (!hasVipps()) return 0;
  let q = db.from("boost_orders").select("id").eq("status", "pending").gt("created_at", new Date(Date.now() - 3 * 864e5).toISOString());
  if (userId) q = q.eq("user_id", userId);
  const { data } = await q;
  const results = await Promise.all((data ?? []).map((o) => settleBoost(db, o.id).catch(() => "waiting" as const)));
  return results.filter((r) => r === "paid").length;
}
