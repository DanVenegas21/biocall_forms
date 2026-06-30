import type { BioCallFieldError } from "@biocall/shared";
import { BIO_CALL_SECTIONS } from "@biocall/shared";

function hasNonEmptyString(...values: string[]): boolean {
  return values.some((v) => v.trim() !== "");
}

/**
 * True solo si el usuario escribio o selecciono algo real.
 * Ignora defaults del formulario (ej. inad*=no en caso vacio).
 */
export function hasMeaningfulFormInput(data: {
  personalData: Record<string, string>;
  contact: Record<string, string>;
  address: Record<string, string | unknown[]> & {
    direccionesAnteriores: unknown[];
  };
  documents: Record<string, string>;
  family: Record<string, string | unknown[]> & {
    matrimoniosPrevios: unknown[];
    hijos: unknown[];
  };
  caseBackground: {
    viajes: unknown[];
    detencionesInmi: unknown[];
    arrestosPolicia: unknown[];
    empleosAnteriores: unknown[];
    foias: Record<string, { solicitar: string; motivo: string }>;
    [key: string]: string | unknown[] | Record<string, { solicitar: string; motivo: string }>;
  };
}): boolean {
  if (hasNonEmptyString(...Object.values(data.personalData))) return true;
  if (hasNonEmptyString(...Object.values(data.contact))) return true;

  const ad = data.address;
  if (
    hasNonEmptyString(
      ad.calleNumero as string,
      ad.aptoSuite as string,
      ad.ciudad as string,
      ad.estado as string,
      ad.codigoPostal as string,
      ad.fechaIngreso as string,
      ad.resididoOtrosLugares as string
    )
  ) {
    return true;
  }
  if (ad.direccionesAnteriores.length > 0) return true;

  if (hasNonEmptyString(...Object.values(data.documents))) return true;

  const fam = data.family;
  if (
    hasNonEmptyString(
      ...Object.entries(fam)
        .filter(([key]) => key !== "matrimoniosPrevios" && key !== "hijos")
        .map(([, value]) => (typeof value === "string" ? value : ""))
    )
  ) {
    return true;
  }
  if (fam.matrimoniosPrevios.length > 0 || fam.hijos.length > 0) return true;

  const cb = data.caseBackground;
  if (
    cb.viajes.length > 0 ||
    cb.detencionesInmi.length > 0 ||
    cb.arrestosPolicia.length > 0 ||
    cb.empleosAnteriores.length > 0
  ) {
    return true;
  }

  const inadKeys = [
    "inadDetencionTrafico",
    "inadCometidoDelito",
    "inadInmunidadDiplomatica",
    "inadProstitucionTrafico",
    "inadAyudaIngresoIlegal",
    "inadTerrorismo",
    "inadFondosTerrorismo",
    "inadAsociacionTerrorista",
    "inadEspionaje",
    "inadPartidoComunista",
    "inadParticipadoPersecucion",
    "inadProcedimientoRemocion",
    "inadDenegadoVisa",
    "inadVisaT",
    "inadGrupoMilitar",
    "inadFraudeMigratorio",
    "inadTrastornoFisicoMental",
    "inadEnfermedadPublica",
    "inadAdictoDrogas",
  ] as const;

  if (
    hasNonEmptyString(
      cb.viajesComentarios as string,
      cb.detenidoInmigracion as string,
      cb.arrestadoPolicia as string,
      cb.empleoNombre as string,
      cb.empleoOcupacion as string,
      cb.empleoDireccionCalle as string,
      cb.empleoDireccionApto as string,
      cb.empleoDireccionCiudad as string,
      cb.empleoDireccionEstado as string,
      cb.empleoDireccionZip as string,
      cb.empleoFechaIngreso as string,
      cb.empleoFechaSalida as string,
      cb.empleoOtrosLugares as string,
      cb.declaradoCiudadano as string,
      cb.falsaDeclaracionLugar as string,
      cb.falsaDeclaracionFecha as string,
      cb.falsaDeclaracionComo as string,
      cb.falsaDeclaracionIntencion as string,
      cb.falsaDeclaracionDetalle as string,
      cb.documentosPendientes as string,
      cb.correosPendientes as string
    )
  ) {
    return true;
  }

  if (inadKeys.some((key) => cb[key] === "si")) return true;
  const inadMyUscis = cb.inadMyUscis;
  if (
    typeof inadMyUscis === "string" &&
    inadMyUscis !== "no" &&
    inadMyUscis.trim() !== ""
  ) {
    return true;
  }

  if (
    Object.values(cb.foias).some(
      (item) => item.solicitar === "si" || item.motivo.trim() !== ""
    )
  ) {
    return true;
  }

  return false;
}

export function getFieldError(
  errors: Record<string, string> | undefined,
  path: string
): string | undefined {
  return errors?.[path];
}

export function applyServerFieldErrors(
  fieldErrors: BioCallFieldError[] | undefined
): Record<string, string> {
  if (!fieldErrors?.length) return {};
  return Object.fromEntries(fieldErrors.map((e) => [e.path, e.message]));
}

const PATH_SECTION_MAP: Record<string, string> = {
  personalData: "datos-personales",
  contact: "contacto",
  address: "domicilio",
  documents: "documentos",
  family: "familia",
  caseBackground: "caso",
};

export function scrollToFirstFieldError(errors: Record<string, string>) {
  const firstPath = Object.keys(errors)[0];
  if (!firstPath) return;

  const sectionKey = firstPath.split(".")[0];
  const sectionId = PATH_SECTION_MAP[sectionKey];
  if (!sectionId) return;

  const sectionEl = document.getElementById(sectionId);
  if (sectionEl) {
    sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const fieldId = firstPath.replace(/\./g, "-");
  const fieldEl = document.getElementById(fieldId);
  fieldEl?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function validationSummaryMessage(count: number): string {
  return count === 1
    ? "Hay 1 error. Revisa el campo marcado en rojo."
    : `Hay ${count} errores. Revisa los campos marcados en rojo.`;
}

export { BIO_CALL_SECTIONS };
