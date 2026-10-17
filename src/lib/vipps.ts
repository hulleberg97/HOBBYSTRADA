import "server-only";

/**
 * Vipps ePayment API. Krever en Vipps MobilePay-avtale (vippsmobilepay.com → Bedrift).
 * Nøklene finnes i portal.vippsmobilepay.com → Utvikler.
 */
const env = () => ({
  clientId: process.env.VIPPS_CLIENT_ID,
  clientSecret: process.env.VIPPS_CLIENT_SECRET,
  subscriptionKey: process.env.VIPPS_SUBSCRIPTION_KEY,
  msn: process.env.VIPPS_MSN,
  base: process.env.VIPPS_TEST === "true" ? "https://apitest.vipps.no" : "https://api.vipps.no",
});

export const hasVipps = () => {
  const e = env();
  return Boolean(e.clientId && e.clientSecret && e.subscriptionKey && e.msn);
};

function headers(extra: Record<string, string> = {}) {
  const e = env();
  return {
    "Ocp-Apim-Subscription-Key": e.subscriptionKey!,
    "Merchant-Serial-Number": e.msn!,
    "Vipps-System-Name": "hobbystrada",
    "Vipps-System-Version": "1.0.0",
    "content-type": "application/json",
    ...extra,
  };
}

async function token() {
  const e = env();
  const res = await fetch(`${e.base}/accesstoken/get`, {
    method: "POST",
    headers: headers({ client_id: e.clientId!, client_secret: e.clientSecret! }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Vipps-innlogging feilet (${res.status})`);
  return (await res.json()).access_token as string;
}

async function call(path: string, init: { method?: string; body?: unknown; idempotencyKey?: string } = {}) {
  const auth = await token();
  const res = await fetch(`${env().base}/epayment/v1${path}`, {
    method: init.method ?? "GET",
    headers: headers({
      authorization: `Bearer ${auth}`,
      ...(init.idempotencyKey ? { "Idempotency-Key": init.idempotencyKey } : {}),
    }),
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Vipps svarte ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

/** Starter en betaling og returnerer adressen kunden sendes til. */
export async function createPayment({
  reference,
  amount,
  description,
  returnUrl,
}: {
  reference: string;
  amount: number;
  description: string;
  returnUrl: string;
}) {
  const data = await call("/payments", {
    method: "POST",
    idempotencyKey: reference,
    body: {
      amount: { currency: "NOK", value: Math.round(amount * 100) },
      paymentMethod: { type: "WALLET" },
      reference,
      returnUrl,
      userFlow: "WEB_REDIRECT",
      paymentDescription: description.slice(0, 100),
    },
  });
  return data.redirectUrl as string;
}

export type VippsState = "CREATED" | "AUTHORIZED" | "ABORTED" | "EXPIRED" | "TERMINATED";

export async function getPayment(reference: string) {
  const data = await call(`/payments/${reference}`);
  return { state: data.state as VippsState, captured: Number(data.aggregate?.capturedAmount?.value ?? 0) };
}

/** Trekker beløpet. Annonseløft leveres med en gang, så vi trekker straks betalingen er godkjent. */
export async function capturePayment(reference: string, amount: number) {
  await call(`/payments/${reference}/capture`, {
    method: "POST",
    idempotencyKey: `${reference}-capture`,
    body: { modificationAmount: { currency: "NOK", value: Math.round(amount * 100) } },
  });
}
