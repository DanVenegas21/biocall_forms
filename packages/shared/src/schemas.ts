import { z } from "zod";

/**
 * Esquemas Zod de la Bio Call. Esqueleto inicial: cada seccion define un objeto
 * que el siguiente integrante completara con los campos reales de captura.
 */

export const personalDataSchema = z.object({
  // TODO: nombre, fecha de nacimiento, nacionalidad, etc.
});

export const contactSchema = z.object({
  // TODO: telefono, correo, contacto alterno.
});

export const addressSchema = z.object({
  // TODO: calle, ciudad, estado, codigo postal, tiempo de residencia.
});

export const documentsSchema = z.object({
  // TODO: identificaciones, numeros de expediente y migratorios.
});

export const familySchema = z.object({
  // TODO: nucleo familiar y dependientes economicos.
});

export const caseBackgroundSchema = z.object({
  // TODO: contexto legal y detalles del caso.
});

/** Esquema raiz de la Bio Call que agrupa todas las secciones. */
export const bioCallSchema = z.object({
  personalData: personalDataSchema,
  contact: contactSchema,
  address: addressSchema,
  documents: documentsSchema,
  family: familySchema,
  caseBackground: caseBackgroundSchema,
});

export type PersonalData = z.infer<typeof personalDataSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Address = z.infer<typeof addressSchema>;
export type Documents = z.infer<typeof documentsSchema>;
export type Family = z.infer<typeof familySchema>;
export type CaseBackground = z.infer<typeof caseBackgroundSchema>;
export type BioCall = z.infer<typeof bioCallSchema>;
