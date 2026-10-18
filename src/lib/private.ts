/** Lukket modus: når SITE_PASSWORD er satt, må besøkende skrive passordet før de ser nettsiden. */
export const ACCESS_COOKIE = "hs_tilgang";

export const sitePassword = () => process.env.SITE_PASSWORD || "";

/** Verdien som lagres i informasjonskapselen. Bytter du passord, må alle skrive det nye. */
export async function accessToken(password: string) {
  const data = new TextEncoder().encode(`hobbystrada:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}
