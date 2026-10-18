type Meta = Record<string, unknown> | undefined;

/** Fullt navn fra registreringen eller Vipps, ellers brukernavn eller e-post. */
export function displayName(meta: Meta, email = "") {
  const full = [meta?.first_name, meta?.last_name].filter(Boolean).join(" ").trim();
  return full || (meta?.name as string) || (meta?.username as string) || email;
}
