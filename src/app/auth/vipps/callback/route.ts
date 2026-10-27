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
    .upsert({ id: userId, vipps_sub: v.sub, verified_name: v.name, verified_at: new Date().toISOString() });
  if (error) throw new Error(`Kunne ikke lagre profil: ${error.message}`);
  const firstName = v.name.split(" ")[0];
  await db.from("listings").update({ seller_verified: true, ...(firstName ? { seller_name: firstName } : {}) }).eq("owner_id", userId);
  // Stedet fra Vipps fylles inn hvis kontoen ikke har et fra før.
  const { data } = await db.auth.admin.getUserById(userId);
  const meta = data.user?.user_metadata ?? {};
  const fresh: Record<string, unknown> = { ...meta, name: v.name || meta.name, username: v.name.split(" ")[0] || meta.username, ...(v.city && !meta.location ? { location: v.city } : {}) };
  delete fresh.inactivity_warned_at; // innlogging nullstiller varselet om sletting av inaktiv konto
  if (JSON.stringify(fresh) !== JSON.stringify(meta)) await db.auth.admin.updateUserById(userId, { user_metadata: fresh });
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
    // Utestengte brukere kan ikke logge inn eller lage ny konto
    const { data: blocked } = await db.from("blocked_users").select("vipps_sub").eq("vipps_sub", v.sub).maybeSingle();
    if (blocked) return fail("utestengt");
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
      // Ny konto: brukeren må ha bekreftet at de er over 18 (egenerklæring på innloggingssiden)
      if (!saved.adult) return fail("alder");
      email = v.emailVerified && v.email ? v.email : `vipps-${v.sub}@brukere.hobbystrada.no`;
      await db.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { username: v.name.split(" ")[0] || "Samler", name: v.name, adult: true, adult_confirmed_at: new Date().toISOString(), ...(v.city ? { location: v.city } : {}) },
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
