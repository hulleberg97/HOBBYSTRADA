/**
 * BRYTER: hvor merket «Eksempelannonse» vises på forsiden.
 * «alle»:     på kortene i karusellen og på annonsekortene (slik det var til og med 22. november).
 * «annonser»: ikke i karusellen på telefon, men fortsatt på annonsekortene lenger ned. Valgt av eieren 22. november.
 * «ingen»:    heller ikke på annonsekortene på forsiden.
 * Kortraden på PC viser alltid merket. Merket står uansett på selve annonsesiden, i markedet og i søk. Kortene er HOBBYSTRADAs egne og ikke til salgs,
 * så valget bør være avklart med juridisk rådgiver (Låvli).
 */
export const EKS_MERKE_FORSIDE = "annonser" as "alle" | "annonser" | "ingen";

/** Merket på kortene i karusellen på telefon. */
export const EKS_I_KARUSELL = EKS_MERKE_FORSIDE === "alle";
/** Merket på annonsekortene på forsiden. */
export const EKS_PA_ANNONSEKORT = EKS_MERKE_FORSIDE !== "ingen";
