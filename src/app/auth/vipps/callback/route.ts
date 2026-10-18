import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { serverClient } from "@/lib/supabase";
import { adminClient } from "@/lib/supabase-admin";
import { exchangeCode, hasVippsLogin, type VippsUser } from "@/lib/vipps-login";
import type { SupabaseClient } from "@supabase/supabase-js";

async function saveProfile(db: SupabaseClient, userId: string, v: VippsUser) {
  const { error } = await db
    .from("profiles")
    .upsert({ id: userId, vipps_sub: v.sub, verified_name: v.name, phone: v.phone, verified_at: new Date().toISOString() });
  if (error) throw new Error(`Kunne ikke lagre profil: ${error.message}`);
  await db.from("listings").update({ seller_verified: true }).eq("owner_id", userId);
  // Stedet fra Vipps fylles inn hvis kontoen ikke har et fra før.
  const { data } = await db.auth.admin.getUserById(userId);
  const meta = data.user?.user_metadata ?? {};
  if (v.city && !meta.location) await db.auth.admin.updateUserById(userId, { user_metadata: { ...meta, location: v.city } });
}

/** Vipps sender brukeren hit etter innlogging. Logger inn, lager konto første gang, eller kobler Vipps til innlogget konto. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const fail = (reason: string) => NextResponse.redirect(new URL(`/auth/login?feil=${reason}`, url.origin));
  if (!hasVippsLogin()) return fail("vipps");

  const store = await cookies();
  const saved = JSON.parse(store.get("vipps_oidc")?.value ?? "{}");
  store.delete({ name: "vipps_oidc", path: "/auth/vipps" });
  const code = url.searchParams.get("code");
  if (!code || !saved.state || url.searchParams.get("state") !== saved.state) return fail("vipps");

  const db = adminClient();
  const auth = await serverClient();
  if (!db || !auth) return fail("vipps");

  try {
    const v = await exchangeCode({ code, nonce: saved.nonce, origin: url.origin });
    const { data: linked } = await db.from("profiles").select("id").eq("vipps_sub", v.sub).maybeSingle();
    const current = await getUser();

    // Innlogget: koble Vipps til kontoen
    if (current) {
      if (linked && linked.id !== current.id) return fail("vipps-koblet");
      await saveProfile(db, current.id, v);
      return NextResponse.redirect(new URL(`${saved.next}${saved.next.includes("?") ? "&" : "?"}vipps=ok`, url.origin));
    }

    // Ikke innlogget: finn kontoen (koblet før, eller samme bekreftede e-post), ellers lag en ny
    let email: string;
    if (linked) {
      const { data } = await db.auth.admin.getUserById(linked.id);
      if (!data.user?.email) return fail("vipps");
      email = data.user.email;
    } else {
      email = v.emailVerified && v.email ? v.email : `vipps-${v.sub}@brukere.hobbystrada.no`;
      await db.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { username: v.name.split(" ")[0] || "Samler", name: v.name, ...(v.city ? { location: v.city } : {}) },
      }); // feiler stille hvis kontoen finnes fra før – da logger vi inn på den
    }

    const { data: link, error: linkError } = await db.auth.admin.generateLink({ type: "magiclink", email });
    if (linkError || !link.user) throw new Error(linkError?.message ?? "Fant ikke brukeren");
    await saveProfile(db, link.user.id, v);
    const { error: otpError } = await auth.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: "magiclink" });
    if (otpError) throw new Error(otpError.message);

    return NextResponse.redirect(new URL(saved.next, url.origin));
  } catch (e) {
    console.error("Vipps-innlogging feilet", e);
    return fail("vipps");
  }
}
