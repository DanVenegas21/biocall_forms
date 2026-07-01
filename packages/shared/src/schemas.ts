import { z } from "zod";
import {
  optionalPersonName,
  personName,
  optionalIsoDatePast,
  optionalIsoDateFuture,
  isoDatePast,
  freeTextDate,
  freeText,
  shortText,
  email,
  requiredEmail,
  phone,
  requiredPhone,
  postalCode,
  requiredPostalCode,
  yesNo,
  yesNoParcial,
  yesNoSabe,
  passportNumber,
  aNumber,
  ssn,
  eadNumber,
  sexo,
  estadoCivil,
  maxText,
} from "./validation/fields";

function isBlank(value: string): boolean {
  return value.trim() === "";
}

function addIssue(
  ctx: z.RefinementCtx,
  path: (string | number)[],
  message: string
) {
  ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });
}

export const personalDataSchema = z.object({
  nombres: personName,
  apellidoPaterno: personName,
  apellidoMaterno: optionalPersonName,
  fechaNacimiento: z
    .string()
    .trim()
    .refine((v) => isBlank(v) || isoDatePast.safeParse(v).success, {
      message: "Ingresa una fecha valida entre 1900 y hoy (formato AAAA-MM-DD).",
    }),
  ciudadNacimiento: shortText,
  estadoNacimiento: shortText,
  paisNacimiento: shortText,
  sexo,
  estadoCivil,
  nacionalidad: personName,
  comprendeIngles: yesNoParcial,
  idiomaPreferido: shortText,
  hablaOtroIdioma: yesNo,
  especificarIdioma: shortText,
  otrosNombres: shortText,
});

export const contactSchema = z.object({
  telefono: phone,
  correoElectronico: email,
});

export const direccionAnteriorSchema = z.object({
  calleNumero: shortText,
  aptoSuite: shortText,
  ciudad: shortText,
  estado: shortText,
  codigoPostal: postalCode,
  fechaDesde: freeTextDate,
  fechaHasta: freeTextDate,
});

export const addressSchema = z
  .object({
    calleNumero: shortText,
    aptoSuite: shortText,
    ciudad: shortText,
    estado: shortText,
    codigoPostal: postalCode,
    fechaIngreso: freeTextDate,
    resididoOtrosLugares: yesNo,
    direccionesAnteriores: z.array(direccionAnteriorSchema),
  })
  .superRefine((data, ctx) => {
    if (data.resididoOtrosLugares === "si" && data.direccionesAnteriores.length === 0) {
      addIssue(ctx, ["direccionesAnteriores"], "Agrega al menos una direccion anterior.");
    }
  });

export const documentsSchema = z
  .object({
    tienePasaporte: yesNo,
    pasaportePendiente: yesNo,
    numeroPasaporte: passportNumber,
    paisEmision: shortText,
    fechaEmision: optionalIsoDatePast,
    fechaExpiracion: optionalIsoDateFuture,
    tieneANumber: yesNoSabe,
    aNumberValue: aNumber,
    aNumberOrigen: shortText,
    tieneSSN: yesNo,
    ssnValue: ssn,
    tieneEAD: yesNo,
    eadValue: eadNumber,
  })
  .superRefine((data, ctx) => {
    if (data.tienePasaporte === "si" && data.pasaportePendiente !== "si") {
      if (isBlank(data.numeroPasaporte)) {
        addIssue(ctx, ["numeroPasaporte"], "Ingresa el numero de pasaporte.");
      }
      if (isBlank(data.paisEmision)) {
        addIssue(ctx, ["paisEmision"], "Ingresa el pais de emision.");
      }
      if (isBlank(data.fechaEmision)) {
        addIssue(ctx, ["fechaEmision"], "Ingresa la fecha de emision.");
      }
      if (isBlank(data.fechaExpiracion)) {
        addIssue(ctx, ["fechaExpiracion"], "Ingresa la fecha de expiracion.");
      }
    }
    if (data.tieneANumber === "si" && isBlank(data.aNumberValue)) {
      addIssue(ctx, ["aNumberValue"], "Ingresa el A-Number.");
    }
    if (data.tieneSSN === "si" && isBlank(data.ssnValue)) {
      addIssue(ctx, ["ssnValue"], "Ingresa el SSN.");
    }
    if (data.tieneEAD === "si" && isBlank(data.eadValue)) {
      addIssue(ctx, ["eadValue"], "Ingresa el numero de EAD.");
    }
  });

export const hijoSchema = z.object({
  nombres: personName,
  apellidoPaterno: personName,
  apellidoMaterno: optionalPersonName,
  fechaNacimiento: z
    .string()
    .trim()
    .refine((v) => isBlank(v) || isoDatePast.safeParse(v).success, {
      message: "Ingresa una fecha valida entre 1900 y hoy (formato AAAA-MM-DD).",
    }),
  lugarNacimiento: shortText,
  lugarResidencia: shortText,
});

export const matrimonioPrevioSchema = z.object({
  nombresExConyuge: personName,
  apellidoPaternoExConyuge: personName,
  apellidoMaternoExConyuge: optionalPersonName,
  fechaLugarMatrimonio: freeTextDate,
  fechaLugarNacimiento: freeTextDate,
  fechaLugarDivorcio: freeTextDate,
});

export const familySchema = z
  .object({
    tieneConyuge: yesNo,
    nombresConyuge: personName,
    apellidoPaternoConyuge: personName,
    apellidoMaternoConyuge: optionalPersonName,
    fechaLugarMatrimonioConyuge: freeTextDate,
    fechaLugarNacimientoConyuge: freeTextDate,
    nombresPadre: personName,
    apellidoPaternoPadre: personName,
    apellidoMaternoPadre: optionalPersonName,
    nombresMadre: personName,
    apellidoPaternoMadre: personName,
    apellidoMaternoMadre: optionalPersonName,
    casado: yesNo,
    previamenteCasado: yesNo,
    matrimoniosPrevios: z.array(matrimonioPrevioSchema),
    tieneHijos: yesNo,
    hijos: z.array(hijoSchema),
  })
  .superRefine((data, ctx) => {
    if (data.tieneConyuge === "si") {
      if (isBlank(data.nombresConyuge)) {
        addIssue(ctx, ["nombresConyuge"], "Ingresa el nombre del conyuge.");
      }
      if (isBlank(data.apellidoPaternoConyuge)) {
        addIssue(ctx, ["apellidoPaternoConyuge"], "Ingresa el apellido paterno del conyuge.");
      }
    }
    if (data.tieneHijos === "si") {
      if (data.hijos.length === 0) {
        addIssue(ctx, ["hijos"], "Agrega al menos un hijo.");
      }
      data.hijos.forEach((hijo, index) => {
        if (isBlank(hijo.nombres)) {
          addIssue(ctx, ["hijos", index, "nombres"], "Ingresa el nombre del hijo.");
        }
        if (!isBlank(hijo.fechaNacimiento) && !isoDatePast.safeParse(hijo.fechaNacimiento).success) {
          addIssue(
            ctx,
            ["hijos", index, "fechaNacimiento"],
            "Ingresa una fecha valida entre 1900 y hoy."
          );
        }
      });
    }
  });

export const viajeSchema = z.object({
  fechaEntrada: freeTextDate,
  formaEntrada: shortText,
  lugarEntrada: shortText,
  fechaSalida: freeTextDate,
  fueDetenido: yesNo,
  detallesDetencion: freeText,
});

export const empleoAnteriorSchema = z.object({
  empresa: shortText,
  puesto: shortText,
  direccionCalle: shortText,
  direccionApto: shortText,
  direccionCiudad: shortText,
  direccionEstado: shortText,
  direccionZip: postalCode,
  fechaDesde: freeTextDate,
  fechaHasta: freeTextDate,
});

export const detencionInmiSchema = z.object({
  lugar: shortText,
  fecha: freeTextDate,
  autoridad: shortText,
  ordenDeportacion: yesNoSabe,
  sancionCastigo: yesNoSabe,
  regresoVoluntario: yesNoSabe,
  fotosHuellas: yesNoSabe,
  citaCorte: yesNoSabe,
});

export const arrestoPoliciaSchema = z.object({
  paisCiudadEstado: shortText,
  fecha: freeTextDate,
  motivo: shortText,
  autoridad: shortText,
  disposicion: shortText,
});

export const foiaItemSchema = z.object({
  solicitar: yesNo,
  motivo: shortText,
});

export const caseBackgroundSchema = z
  .object({
    viajes: z.array(viajeSchema),
    viajesComentarios: freeText,
    detenidoInmigracion: yesNo,
    detencionesInmi: z.array(detencionInmiSchema),
    arrestadoPolicia: yesNo,
    arrestosPolicia: z.array(arrestoPoliciaSchema),
    empleoNombre: shortText,
    empleoOcupacion: shortText,
    empleoDireccionCalle: shortText,
    empleoDireccionApto: shortText,
    empleoDireccionCiudad: shortText,
    empleoDireccionEstado: shortText,
    empleoDireccionZip: postalCode,
    empleoFechaIngreso: freeTextDate,
    empleoFechaSalida: freeTextDate,
    empleoOtrosLugares: yesNo,
    empleosAnteriores: z.array(empleoAnteriorSchema),
    inadDetencionTrafico: yesNoSabe,
    inadCometidoDelito: yesNoSabe,
    inadInmunidadDiplomatica: yesNoSabe,
    inadProstitucionTrafico: yesNoSabe,
    inadAyudaIngresoIlegal: yesNoSabe,
    inadTerrorismo: yesNoSabe,
    inadFondosTerrorismo: yesNoSabe,
    inadAsociacionTerrorista: yesNoSabe,
    inadEspionaje: yesNoSabe,
    inadPartidoComunista: yesNoSabe,
    inadParticipadoPersecucion: yesNoSabe,
    inadProcedimientoRemocion: yesNoSabe,
    inadDenegadoVisa: yesNoSabe,
    inadVisaT: yesNoSabe,
    inadMyUscis: yesNoSabe,
    inadMyUscisDetalle: z.string().trim().max(200, { message: "Maximo 200 caracteres." }).default(""),
    inadGrupoMilitar: yesNoSabe,
    inadFraudeMigratorio: yesNoSabe,
    inadTrastornoFisicoMental: yesNoSabe,
    inadEnfermedadPublica: yesNoSabe,
    inadAdictoDrogas: yesNoSabe,
    declaradoCiudadano: yesNo,
    falsaDeclaracionLugar: shortText,
    falsaDeclaracionFecha: freeTextDate,
    falsaDeclaracionComo: shortText,
    falsaDeclaracionIntencion: shortText,
    falsaDeclaracionDetalle: freeText,
    foias: z.object({
      uscis: foiaItemSchema,
      ice: foiaItemSchema,
      cbp: foiaItemSchema,
      eoir: foiaItemSchema,
      fbi: foiaItemSchema,
      policia: foiaItemSchema,
    }),
    documentosPendientes: maxText(2000),
    correosPendientes: maxText(2000),
  })
  .superRefine((data, ctx) => {
    if (data.detenidoInmigracion === "si" && data.detencionesInmi.length === 0) {
      addIssue(ctx, ["detencionesInmi"], "Agrega al menos una detencion por inmigracion.");
    }
    if (data.arrestadoPolicia === "si" && data.arrestosPolicia.length === 0) {
      addIssue(ctx, ["arrestosPolicia"], "Agrega al menos un arresto policial.");
    }
    if (data.empleoOtrosLugares === "si" && data.empleosAnteriores.length === 0) {
      addIssue(ctx, ["empleosAnteriores"], "Agrega al menos un empleo anterior.");
    }

    const foiaAgencies = ["uscis", "ice", "cbp", "eoir", "fbi", "policia"] as const;
    for (const agency of foiaAgencies) {
      const item = data.foias[agency];
      if (item.solicitar === "si" && isBlank(item.motivo)) {
        addIssue(
          ctx,
          ["foias", agency, "motivo"],
          "Indica el motivo de la solicitud FOIA."
        );
      }
    }
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

/** Validacion estricta para guardar en BD (campos NOT NULL del esquema SQL). */
export const bioCallSaveSchema = bioCallSchema.superRefine((data, ctx) => {
  const pd = data.personalData;
  if (isBlank(pd.nombres)) {
    addIssue(ctx, ["personalData", "nombres"], "Este campo es obligatorio.");
  }
  if (isBlank(pd.apellidoPaterno)) {
    addIssue(ctx, ["personalData", "apellidoPaterno"], "Este campo es obligatorio.");
  }
  if (isBlank(pd.fechaNacimiento)) {
    addIssue(ctx, ["personalData", "fechaNacimiento"], "La fecha de nacimiento es obligatoria.");
  } else if (!isoDatePast.safeParse(pd.fechaNacimiento).success) {
    addIssue(
      ctx,
      ["personalData", "fechaNacimiento"],
      "Ingresa una fecha valida entre 1900 y hoy (formato AAAA-MM-DD)."
    );
  }
  if (isBlank(pd.nacionalidad)) {
    addIssue(ctx, ["personalData", "nacionalidad"], "Este campo es obligatorio.");
  }

  if (!requiredPhone.safeParse(data.contact.telefono).success) {
    addIssue(ctx, ["contact", "telefono"], "El telefono es obligatorio.");
  }
  if (!requiredEmail.safeParse(data.contact.correoElectronico).success) {
    addIssue(ctx, ["contact", "correoElectronico"], "El correo electronico es obligatorio.");
  }

  const addr = data.address;
  if (isBlank(addr.calleNumero)) {
    addIssue(ctx, ["address", "calleNumero"], "Este campo es obligatorio.");
  }
  if (isBlank(addr.ciudad)) {
    addIssue(ctx, ["address", "ciudad"], "Este campo es obligatorio.");
  }
  if (isBlank(addr.estado)) {
    addIssue(ctx, ["address", "estado"], "Este campo es obligatorio.");
  }
  if (!requiredPostalCode.safeParse(addr.codigoPostal).success) {
    addIssue(ctx, ["address", "codigoPostal"], "El codigo postal es obligatorio.");
  }
});

export type PersonalData = z.infer<typeof personalDataSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Address = z.infer<typeof addressSchema>;
export type Documents = z.infer<typeof documentsSchema>;
export type Family = z.infer<typeof familySchema>;
export type CaseBackground = z.infer<typeof caseBackgroundSchema>;
export type BioCall = z.infer<typeof bioCallSchema>;
