import "server-only";

/**
 * Vipps Login (OpenID Connect). Slås på med VIPPS_LOGIN=true når Vipps Login er aktivert i
 * portal.vippsmobilepay.com og denne adressen er lagt inn som redirect URI:
 *   {NEXT_PUBLIC_SITE_URL}/auth/vipps/callback
 */
// Egne nøkler for innlogging (VIPPS_LOGIN_CLIENT_ID/SECRET) når Vipps Login er på et annet salgssted enn betaling.
// Uten dem brukes betalingsnøklene.
const clientId = () => process.env.VIPPS_LOGIN_CLIENT_ID || process.env.VIPPS_CLIENT_ID;
const clientSecret = () => process.env.VIPPS_LOGIN_CLIENT_SECRET || process.env.VIPPS_CLIENT_SECRET;

export const hasVippsLogin = () => process.env.VIPPS_LOGIN === "true" && Boolean(clientId() && clientSecret());

const base = () => (process.env.VIPPS_TEST === "true" ? "https://apitest.vipps.no" : "https://api.vipps.no");
export const redirectUri = (origin: string) => `${process.env.NEXT_PUBLIC_SITE_URL ?? origin}/auth/vipps/callback`;

type Discovery = { authorization_endpoint: string; token_endpoint: string; userinfo_endpoint: string };
let discovery: Promise<Discovery> | null = null;

function discover() {
  discovery ??= fetch(`${base()}/access-management-1.0/access/.well-known/openid-configuration`)
    .then((r) => {
      if (!r.ok) throw new Error(`Vipps discovery ${r.status}`);
      return r.json();
    })
    .catch((e) => {
      discovery = null;
      throw e;
    });
  return discovery;
}

export async function authorizeUrl({ state, nonce, origin }: { state: string; nonce: string; origin: string }) {
  const d = await discover();
  const u = new URL(d.authorization_endpoint);
  u.search = new URLSearchParams({
    client_id: clientId()!,
    response_type: "code",
    // Bare det vi bruker: navn, e-post og poststed (fra adressen; gateadressen lagres ikke)
    scope: process.env.VIPPS_HENT_TELEFON === "1" ? "openid name email phoneNumber" : "openid name email",
    state,
    nonce,
    redirect_uri: redirectUri(origin),
  }).toString();
  return u.toString();
}

export type VippsUser = { sub: string; name: string; email: string | null; emailVerified: boolean; phone: string | null };


/** «KONGSBERG» → «Kongsberg», «MO I RANA» → «Mo i Rana». */

/** Bytter koden fra Vipps mot brukerens bekreftede navn, telefon og e-post. */
export async function exchangeCode({ code, nonce, origin }: { code: string; nonce: string; origin: string }): Promise<VippsUser> {
  const d = await discover();
  const basic = Buffer.from(`${clientId()}:${clientSecret()}`).toString("base64");
  const res = await fetch(d.token_endpoint, {
    method: "POST",
    headers: { authorization: `Basic ${basic}`, "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri(origin) }),
    cache: "no-store",
  });
  const token = await res.json().catch(() => ({}));
  if (!res.ok || !token.access_token) throw new Error(`Vipps token ${res.status}: ${JSON.stringify(token)}`);

  // id_token kommer direkte fra Vipps over TLS; vi sjekker at nonce stemmer med den vi sendte.
  const claims = token.id_token ? JSON.parse(Buffer.from(String(token.id_token).split(".")[1], "base64url").toString()) : {};
  if (claims.nonce !== nonce) throw new Error("Vipps nonce stemmer ikke");

  const info = await fetch(d.userinfo_endpoint, { headers: { authorization: `Bearer ${token.access_token}` }, cache: "no-store" });
  const u = await info.json().catch(() => ({}));
  if (!info.ok || !u.sub) throw new Error(`Vipps userinfo ${info.status}`);
  return {
    sub: String(u.sub),
    name: [u.given_name, u.family_name].filter(Boolean).join(" ") || u.name || "",
    email: u.email ? String(u.email).toLowerCase() : null,
    emailVerified: Boolean(u.email_verified),
    // Telefonnummeret brukes til Vipps-knappen når selgeren har godtatt et bud. Lagres som sifre, f.eks. 4740105742.
    phone: u.phone_number ? String(u.phone_number).replace(/\D/g, "") || null : null,
  };
}
