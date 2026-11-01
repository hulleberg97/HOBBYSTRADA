import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

const KEY = "vipps_webhook";
export type WebhookSetting = { id: string; secret: string; url: string; createdAt: string };

export async function readWebhookSetting(db: SupabaseClient): Promise<WebhookSetting | null> {
  const { data } = await db.from("site_settings").select("value").eq("key", KEY).maybeSingle();
  return (data?.value as WebhookSetting | null) ?? null;
}

export async function saveWebhookSetting(db: SupabaseClient, value: WebhookSetting | null) {
  if (!value) return db.from("site_settings").delete().eq("key", KEY);
  return db.from("site_settings").upsert({ key: KEY, value, updated_at: new Date().toISOString() });
}

/**
 * Kontrollerer signaturen Vipps sender med hver webhook-melding (HMAC-SHA256 over metode, sti, dato, vert og
 * innholdets sha256). Returnerer false hvis noe mangler eller ikke stemmer.
 */
export function verifyWebhook(req: Request, body: string, secret: string) {
  const auth = req.headers.get("authorization") ?? "";
  const date = req.headers.get("x-ms-date") ?? "";
  const contentHash = req.headers.get("x-ms-content-sha256") ?? "";
  const host = req.headers.get("host") ?? "";
  const m = auth.match(/^HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=(.+)$/);
  if (!m || !date || !contentHash || !host) return false;
  const expectedHash = createHash("sha256").update(body, "utf8").digest("base64");
  if (!safeEqual(expectedHash, contentHash)) return false;
  const url = new URL(req.url);
  const signed = `POST\n${url.pathname}${url.search}\n${date};${host};${contentHash}`;
  const expected = createHmac("sha256", secret).update(signed, "utf8").digest("base64");
  return safeEqual(expected, m[1]);
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
