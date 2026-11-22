/**
 * BRYTER: hvor merket «Eksempelannonse» vises på forsiden (telefon og PC).
 * «alle»:     på kortene i karusellen/kortraden og på annonsekortene (slik det var til og med 22. november).
 * «annonser»: ikke i karusellen/kortraden, men fortsatt på annonsekortene lenger ned.
 * «ingen»:    ikke på noen kort på forsiden.
 * Merket står uansett på selve annonsesiden, i markedet og i søk. Kortene er HOBBYSTRADAs egne og ikke til salgs,
 * så valget bør være avklart med juridisk rådgiver (Låvli).
 */
export const EKS_MERKE_FORSIDE = "ingen" as "alle" | "annonser" | "ingen";

/** Merket på kortene i karusellen på telefon og i kortraden på PC. */
export const EKS_I_KARUSELL = EKS_MERKE_FORSIDE === "alle";
/** Merket på annonsekortene på forsiden. */
export const EKS_PA_ANNONSEKORT = EKS_MERKE_FORSIDE !== "ingen";
