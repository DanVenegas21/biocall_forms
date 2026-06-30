import { z } from "zod";

/**
 * Esquemas Zod de la Bio Call.
 */

export const personalDataSchema = z.object({
  nombres: z.string(),
  apellidoPaterno: z.string(),
  apellidoMaterno: z.string(),
  fechaNacimiento: z.string(),
  ciudadNacimiento: z.string(),
  estadoNacimiento: z.string(),
  paisNacimiento: z.string(),
  sexo: z.string(),
  estadoCivil: z.string(),
  nacionalidad: z.string(),
  comprendeIngles: z.string(),
  idiomaPreferido: z.string(),
  hablaOtroIdioma: z.string(),
  especificarIdioma: z.string(),
  otrosNombres: z.string(),
});

export const contactSchema = z.object({
  telefono: z.string(),
  correoElectronico: z.string(),
});

export const direccionAnteriorSchema = z.object({
  calleNumero: z.string(),
  aptoSuite: z.string(),
  ciudad: z.string(),
  estado: z.string(),
  codigoPostal: z.string(),
  fechaDesde: z.string(),
  fechaHasta: z.string(),
});

export const addressSchema = z.object({
  calleNumero: z.string(),
  aptoSuite: z.string(),
  ciudad: z.string(),
  estado: z.string(),
  codigoPostal: z.string(),
  fechaIngreso: z.string(),
  resididoOtrosLugares: z.string(),
  direccionesAnteriores: z.array(direccionAnteriorSchema),
});

export const documentsSchema = z.object({
  tienePasaporte: z.string(),
  pasaportePendiente: z.string(),
  numeroPasaporte: z.string(),
  paisEmision: z.string(),
  fechaEmision: z.string(),
  fechaExpiracion: z.string(),
  tieneANumber: z.string(),
  aNumberValue: z.string(),
  aNumberOrigen: z.string(),
  tieneSSN: z.string(),
  ssnValue: z.string(),
  tieneEAD: z.string(),
  eadValue: z.string(),
});

export const hijoSchema = z.object({
  nombres: z.string(),
  apellidoPaterno: z.string(),
  apellidoMaterno: z.string(),
  fechaNacimiento: z.string(),
  lugarNacimiento: z.string(),
  lugarResidencia: z.string(),
});

export const matrimonioPrevioSchema = z.object({
  nombresExConyuge: z.string(),
  apellidoPaternoExConyuge: z.string(),
  apellidoMaternoExConyuge: z.string(),
  fechaLugarMatrimonio: z.string(),
  fechaLugarNacimiento: z.string(),
  fechaLugarDivorcio: z.string(),
});

export const familySchema = z.object({
  tieneConyuge: z.string(),
  nombresConyuge: z.string(),
  apellidoPaternoConyuge: z.string(),
  apellidoMaternoConyuge: z.string(),
  fechaLugarMatrimonioConyuge: z.string(),
  fechaLugarNacimientoConyuge: z.string(),
  nombresPadre: z.string(),
  apellidoPaternoPadre: z.string(),
  apellidoMaternoPadre: z.string(),
  nombresMadre: z.string(),
  apellidoPaternoMadre: z.string(),
  apellidoMaternoMadre: z.string(),
  casado: z.string(),
  previamenteCasado: z.string(),
  matrimoniosPrevios: z.array(matrimonioPrevioSchema),
  tieneHijos: z.string(),
  hijos: z.array(hijoSchema),
});

export const viajeSchema = z.object({
  fechaEntrada: z.string(),
  formaEntrada: z.string(),
  lugarEntrada: z.string(),
  fechaSalida: z.string(),
  fueDetenido: z.string(),
  detallesDetencion: z.string(),
});

export const empleoAnteriorSchema = z.object({
  empresa: z.string(),
  puesto: z.string(),
  direccionCalle: z.string(),
  direccionApto: z.string(),
  direccionCiudad: z.string(),
  direccionEstado: z.string(),
  direccionZip: z.string(),
  fechaDesde: z.string(),
  fechaHasta: z.string(),
});

export const detencionInmiSchema = z.object({
  lugar: z.string(),
  fecha: z.string(),
  autoridad: z.string(),
  ordenDeportacion: z.string(),
  sancionCastigo: z.string(),
  regresoVoluntario: z.string(),
  fotosHuellas: z.string(),
  citaCorte: z.string(),
});

export const arrestoPoliciaSchema = z.object({
  paisCiudadEstado: z.string(),
  fecha: z.string(),
  motivo: z.string(),
  autoridad: z.string(),
  disposicion: z.string(),
});

export const foiaItemSchema = z.object({
  solicitar: z.string(),
  motivo: z.string(),
});

export const caseBackgroundSchema = z.object({
  viajes: z.array(viajeSchema),
  viajesComentarios: z.string(),
  detenidoInmigracion: z.string(),
  detencionesInmi: z.array(detencionInmiSchema),
  arrestadoPolicia: z.string(),
  arrestosPolicia: z.array(arrestoPoliciaSchema),
  empleoNombre: z.string(),
  empleoOcupacion: z.string(),
  empleoDireccionCalle: z.string(),
  empleoDireccionApto: z.string(),
  empleoDireccionCiudad: z.string(),
  empleoDireccionEstado: z.string(),
  empleoDireccionZip: z.string(),
  empleoFechaIngreso: z.string(),
  empleoFechaSalida: z.string(),
  empleoOtrosLugares: z.string(),
  empleosAnteriores: z.array(empleoAnteriorSchema),
  inadDetencionTrafico: z.string(),
  inadCometidoDelito: z.string(),
  inadInmunidadDiplomatica: z.string(),
  inadProstitucionTrafico: z.string(),
  inadAyudaIngresoIlegal: z.string(),
  inadTerrorismo: z.string(),
  inadFondosTerrorismo: z.string(),
  inadAsociacionTerrorista: z.string(),
  inadEspionaje: z.string(),
  inadPartidoComunista: z.string(),
  inadParticipadoPersecucion: z.string(),
  inadProcedimientoRemocion: z.string(),
  inadDenegadoVisa: z.string(),
  inadVisaT: z.string(),
  inadMyUscis: z.string(),
  inadGrupoMilitar: z.string(),
  inadFraudeMigratorio: z.string(),
  inadTrastornoFisicoMental: z.string(),
  inadEnfermedadPublica: z.string(),
  inadAdictoDrogas: z.string(),
  declaradoCiudadano: z.string(),
  falsaDeclaracionLugar: z.string(),
  falsaDeclaracionFecha: z.string(),
  falsaDeclaracionComo: z.string(),
  falsaDeclaracionIntencion: z.string(),
  falsaDeclaracionDetalle: z.string(),
  foias: z.object({
    uscis: foiaItemSchema,
    ice: foiaItemSchema,
    cbp: foiaItemSchema,
    eoir: foiaItemSchema,
    fbi: foiaItemSchema,
    policia: foiaItemSchema,
  }),
  documentosPendientes: z.string(),
  correosPendientes: z.string(),
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

