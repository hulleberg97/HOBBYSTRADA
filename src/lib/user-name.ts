type Meta = Record<string, unknown> | undefined;

/** Fullt navn fra registreringen eller Vipps, ellers brukernavn eller delen før @ (navnet kan vises for andre, e-posten skal ikke). */
export function displayName(meta: Meta, email = "") {
  const full = [meta?.first_name, meta?.last_name].filter(Boolean).join(" ").trim();
  return full || (meta?.name as string) || (meta?.username as string) || email.split("@")[0];
}
