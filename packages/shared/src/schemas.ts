import { z } from "zod";

/**
 * Esquemas Zod de la Bio Call — alineados con BioCallForm.tsx y las secciones
 * del frontend (Formulario_front).
 */

const yesNoSchema = z.enum(["si", "no"]).or(z.literal(""));

export const personalDataSchema = z.object({
  nombres: z.string(),
  apellidoPaterno: z.string(),
  apellidoMaterno: z.string(),
  fechaNacimiento: z.string(),
  lugarNacimiento: z.string(),
  sexo: z.string(),
  estadoCivil: z.string(),
  nacionalidad: z.string(),
  comprendeIngles: z.enum(["si", "no", "parcial", ""]),
  idiomaPreferido: z.string(),
  hablaOtroIdioma: yesNoSchema,
  especificarIdioma: z.string(),
  otrosNombres: z.string(),
});

export const contactSchema = z.object({
  telefono: z.string(),
  correoElectronico: z.string(),
});

export const addressSchema = z.object({
  direccionCompleta: z.string(),
  fechaIngreso: z.string(),
});

export const documentsSchema = z.object({
  tienePasaporte: yesNoSchema,
  pasaportePendiente: z.string(),
  numeroPasaporte: z.string(),
  paisEmision: z.string(),
  fechaEmision: z.string(),
  fechaExpiracion: z.string(),
  tieneANumber: z.enum(["si", "no", "no_sabe", ""]),
  aNumberValue: z.string(),
  aNumberOrigen: z.string(),
  tieneSSN: yesNoSchema,
  ssnValue: z.string(),
  tieneEAD: yesNoSchema,
  eadValue: z.string(),
});

export const familySchema = z.object({
  tieneConyuge: yesNoSchema,
  nombresConyuge: z.string(),
  apellidoPaternoConyuge: z.string(),
  apellidoMaternoConyuge: z.string(),
  tieneHijos: yesNoSchema,
  cantidadHijos: z.union([z.number(), z.literal("")]),
});

export const caseBackgroundSchema = z.object({
  fechaEntrada: z.string(),
  formaEntrada: z.string(),
  lugarEntrada: z.string(),
  detenidoAlIngresar: yesNoSchema,
  detenidoInmigracion: yesNoSchema,
  cantidadDetencionesInmi: z.union([z.number(), z.literal("")]),
  detallesDetencionesInmi: z.string(),
  inmiFotosHuellas: yesNoSchema,
  inmiOrdenDeportacion: yesNoSchema,
  inmiCitaCorte: yesNoSchema,
  inmiRegresoVoluntario: yesNoSchema,
  inmiCastigoSancion: yesNoSchema,
  arrestadoPolicia: yesNoSchema,
  cantidadArrestosPoli: z.union([z.number(), z.literal("")]),
  explicacionArresto: z.string(),
  arrestoMotivo: z.string(),
  arrestoFecha: z.string(),
  arrestoLugar: z.string(),
  arrestoPasoNocheCarcel: yesNoSchema,
  arrestoPagoFianza: z.enum(["si", "no", "no_aplica", ""]),
  arrestoMontoFianza: z.string(),
  arrestoResolucion: z.string(),
  declaradoCiudadano: yesNoSchema,
  foiaRequerir: z.string(),
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
