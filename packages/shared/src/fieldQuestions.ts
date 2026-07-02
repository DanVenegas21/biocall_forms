/**
 * Preguntas en español para todos los campos de Bio Call.
 * Fuente única para PDF, formulario y mensajes de validación.
 */
import { INADMISSIBILITY_QUESTIONS } from "./inadmissibilityQuestions";

/** Normaliza texto a pregunta con signos de interrogación. */
export function formatQuestion(text: string): string {
  const trimmed = text.trim().replace(/^[¿\s]+/, "").replace(/[?\s]+$/, "");
  return `¿${trimmed}?`;
}

const INAD_FIELD_QUESTIONS = Object.fromEntries(
  INADMISSIBILITY_QUESTIONS.map((item) => [
    `caseBackground.${item.field}`,
    item.question.replace(/^[¿\s]+/, "").replace(/[?\s]+$/, ""),
  ])
);

/** Preguntas para campos escalares (sin signos ¿?). */
export const FIELD_QUESTIONS: Record<string, string> = {
  "personalData.nombres": "Cuál es el primer nombre del cliente",
  "personalData.segundoNombre": "Cuál es el segundo nombre del cliente",
  "personalData.apellidoPaterno": "Cuál es el apellido paterno del cliente",
  "personalData.apellidoMaterno": "Cuál es el apellido materno del cliente",
  "personalData.otrosNombres":
    "Cuáles son los otros nombres utilizados por el cliente (alias, nombres anteriores o variaciones)",
  "personalData.fechaNacimiento": "Cuál es la fecha de nacimiento del cliente",
  "personalData.ciudadNacimiento": "En qué ciudad nació el cliente",
  "personalData.estadoNacimiento": "En qué estado o provincia nació el cliente",
  "personalData.paisNacimiento": "En qué país nació el cliente",
  "personalData.sexo": "Cuál es el sexo del cliente",
  "personalData.estadoCivil": "Cuál es el estado civil del cliente",
  "personalData.nacionalidad": "Cuál es la nacionalidad del cliente",
  "personalData.comprendeIngles": "El cliente comprende inglés",
  "personalData.idiomaPreferido": "Cuál es el idioma preferido del cliente",
  "personalData.hablaOtroIdioma": "El cliente habla otro idioma además del preferido",
  "personalData.especificarIdioma": "Cuál es el otro idioma que habla el cliente",
  "contact.telefono": "Cuál es el teléfono de contacto del cliente",
  "contact.correoElectronico": "Cuál es el correo electrónico del cliente",
  "address.calleNumero": "Cuál es la calle y número del domicilio actual del cliente",
  "address.aptoSuite": "Cuál es el apartamento o suite del domicilio actual del cliente",
  "address.ciudad": "En qué ciudad reside actualmente el cliente",
  "address.estado": "En qué estado o provincia reside actualmente el cliente",
  "address.codigoPostal": "Cuál es el código postal del domicilio actual del cliente",
  "address.pais": "En qué país reside actualmente el cliente",
  "address.fechaIngreso": "Desde cuándo vive el cliente en este domicilio",
  "address.resididoOtrosLugares": "El cliente ha residido en otros lugares",
  "documents.tienePasaporte": "El cliente cuenta con pasaporte",
  "documents.pasaportePendiente": "El pasaporte del cliente está pendiente de entrega o renovación",
  "documents.numeroPasaporte": "Cuál es el número de pasaporte del cliente",
  "documents.paisEmision": "En qué país se emitió el pasaporte del cliente",
  "documents.fechaEmision": "Cuál es la fecha de emisión del pasaporte del cliente",
  "documents.fechaExpiracion": "Cuál es la fecha de expiración del pasaporte del cliente",
  "documents.tieneANumber": "El cliente tiene número A (A-Number)",
  "documents.aNumberValue": "Cuál es el número A (A-Number) del cliente",
  "documents.aNumberOrigen": "Cuál es el origen del número A (A-Number) del cliente",
  "documents.tieneSSN": "El cliente tiene número de Seguro Social (SSN)",
  "documents.ssnValue": "Cuál es el número de Seguro Social (SSN) del cliente",
  "documents.tieneEAD": "El cliente tiene documento de autorización de empleo (EAD)",
  "documents.eadValue": "Cuál es el número del documento EAD del cliente",
  "family.tieneConyuge": "El cliente tiene cónyuge",
  "family.nombresConyuge": "Cuál es el primer nombre del cónyuge del cliente",
  "family.segundoNombreConyuge": "Cuál es el segundo nombre del cónyuge del cliente",
  "family.apellidoPaternoConyuge": "Cuál es el apellido paterno del cónyuge del cliente",
  "family.apellidoMaternoConyuge": "Cuál es el apellido materno del cónyuge del cliente",
  "family.fechaLugarMatrimonioConyuge":
    "Cuándo y dónde se celebró el matrimonio del cliente con su cónyuge actual",
  "family.fechaLugarNacimientoConyuge":
    "Cuándo y dónde nació el cónyuge actual del cliente",
  "family.nombresPadre": "Cuál es el primer nombre del padre del cliente",
  "family.segundoNombrePadre": "Cuál es el segundo nombre del padre del cliente",
  "family.apellidoPaternoPadre": "Cuál es el apellido paterno del padre del cliente",
  "family.apellidoMaternoPadre": "Cuál es el apellido materno del padre del cliente",
  "family.nombresMadre": "Cuál es el primer nombre de la madre del cliente",
  "family.segundoNombreMadre": "Cuál es el segundo nombre de la madre del cliente",
  "family.apellidoPaternoMadre": "Cuál es el apellido paterno de la madre del cliente",
  "family.apellidoMaternoMadre": "Cuál es el apellido materno de la madre del cliente",
  "family.casado": "El cliente está casado actualmente",
  "family.previamenteCasado": "El cliente estuvo casado previamente",
  "family.tieneHijos": "El cliente tiene hijos",
  "caseBackground.viajesComentarios":
    "Cuáles son los comentarios adicionales del cliente sobre sus viajes",
  "caseBackground.detenidoInmigracion":
    "El cliente ha sido detenido por inmigración alguna vez",
  "caseBackground.arrestadoPolicia":
    "El cliente ha sido arrestado por la policía alguna vez",
  "caseBackground.empleoNombre": "Cuál es el nombre del empleador actual del cliente",
  "caseBackground.empleoOcupacion": "Cuál es la ocupación o puesto actual del cliente",
  "caseBackground.empleoDireccionCalle":
    "Cuál es la calle y número del empleo actual del cliente",
  "caseBackground.empleoDireccionApto":
    "Cuál es el apartamento o suite del empleo actual del cliente",
  "caseBackground.empleoDireccionCiudad": "En qué ciudad está el empleo actual del cliente",
  "caseBackground.empleoDireccionEstado":
    "En qué estado o provincia está el empleo actual del cliente",
  "caseBackground.empleoDireccionZip":
    "Cuál es el código postal del empleo actual del cliente",
  "caseBackground.empleoDireccionPais": "En qué país está el empleo actual del cliente",
  "caseBackground.empleoFechaIngreso": "Desde cuándo trabaja el cliente en su empleo actual",
  "caseBackground.empleoFechaSalida": "Hasta cuándo trabajó el cliente en su empleo actual",
  "caseBackground.empleoOtrosLugares":
    "El cliente ha laborado en otros lugares en los últimos cinco años",
  "caseBackground.inadMyUscisDetalle":
    "Cuáles son los detalles de la cuenta myUSCIS del cliente",
  "caseBackground.declaradoCiudadano":
    "El cliente se ha declarado ciudadano de los Estados Unidos sin serlo",
  "caseBackground.falsaDeclaracionLugar":
    "Dónde declaró el cliente ser ciudadano de los Estados Unidos",
  "caseBackground.falsaDeclaracionFecha":
    "Cuándo declaró el cliente ser ciudadano de los Estados Unidos",
  "caseBackground.falsaDeclaracionComo":
    "Cómo o en qué documento declaró el cliente ser ciudadano de los Estados Unidos",
  "caseBackground.falsaDeclaracionIntencion":
    "Cuál era la intención del cliente al declararse ciudadano de los Estados Unidos",
  "caseBackground.falsaDeclaracionDetalle":
    "Cuáles son los detalles adicionales de la falsa declaración de ciudadanía del cliente",
  "caseBackground.documentosPendientes":
    "Qué documentos están pendientes de recibir del cliente",
  "caseBackground.correosPendientes":
    "Qué correos o comunicaciones están pendientes con el cliente",
  "caseBackground.foias.uscis.solicitar": "Se debe solicitar FOIA a USCIS",
  "caseBackground.foias.uscis.motivo": "Cuál es el motivo de la solicitud FOIA a USCIS",
  "caseBackground.foias.ice.solicitar": "Se debe solicitar FOIA a ICE",
  "caseBackground.foias.ice.motivo": "Cuál es el motivo de la solicitud FOIA a ICE",
  "caseBackground.foias.cbp.solicitar": "Se debe solicitar FOIA a CBP",
  "caseBackground.foias.cbp.motivo": "Cuál es el motivo de la solicitud FOIA a CBP",
  "caseBackground.foias.eoir.solicitar": "Se debe solicitar FOIA a EOIR",
  "caseBackground.foias.eoir.motivo": "Cuál es el motivo de la solicitud FOIA a EOIR",
  "caseBackground.foias.fbi.solicitar": "Se debe solicitar FOIA al FBI",
  "caseBackground.foias.fbi.motivo": "Cuál es el motivo de la solicitud FOIA al FBI",
  "caseBackground.foias.policia.solicitar": "Se debe solicitar FOIA a la policía",
  "caseBackground.foias.policia.motivo": "Cuál es el motivo de la solicitud FOIA a la policía",
  ...INAD_FIELD_QUESTIONS,
};

const ARRAY_ITEM_LABELS: Record<string, string> = {
  direccionesAnteriores: "domicilio anterior",
  hijos: "hijo",
  matrimoniosPrevios: "matrimonio previo",
  viajes: "viaje",
  detencionesInmi: "detención por inmigración",
  arrestosPolicia: "arresto policial",
  empleosAnteriores: "empleo anterior",
};

type ArrayQuestionBuilder = (index: number) => string;

const ARRAY_FIELD_QUESTION_BUILDERS: Record<string, Record<string, ArrayQuestionBuilder>> = {
  direccionesAnteriores: {
    calleNumero: (n) =>
      `Cuál es la calle y número del domicilio anterior ${n} del cliente`,
    aptoSuite: (n) =>
      `Cuál es el apartamento o suite del domicilio anterior ${n} del cliente`,
    ciudad: (n) => `En qué ciudad estaba el domicilio anterior ${n} del cliente`,
    estado: (n) => `En qué estado o provincia estaba el domicilio anterior ${n} del cliente`,
    codigoPostal: (n) =>
      `Cuál es el código postal del domicilio anterior ${n} del cliente`,
    pais: (n) => `En qué país estaba el domicilio anterior ${n} del cliente`,
    fechaDesde: (n) => `Desde cuándo vivió el cliente en el domicilio anterior ${n}`,
    fechaHasta: (n) => `Hasta cuándo vivió el cliente en el domicilio anterior ${n}`,
  },
  matrimoniosPrevios: {
    nombresExConyuge: (n) =>
      `Cuál es el primer nombre del ex cónyuge del matrimonio previo ${n} del cliente`,
    segundoNombreExConyuge: (n) =>
      `Cuál es el segundo nombre del ex cónyuge del matrimonio previo ${n} del cliente`,
    apellidoPaternoExConyuge: (n) =>
      `Cuál es el apellido paterno del ex cónyuge del matrimonio previo ${n} del cliente`,
    apellidoMaternoExConyuge: (n) =>
      `Cuál es el apellido materno del ex cónyuge del matrimonio previo ${n} del cliente`,
    fechaLugarMatrimonio: (n) =>
      `Cuándo y dónde se celebró el matrimonio previo ${n} del cliente`,
    fechaLugarNacimiento: (n) =>
      `Cuándo y dónde nació el ex cónyuge del matrimonio previo ${n} del cliente`,
    fechaLugarDivorcio: (n) =>
      `Cuándo y dónde se disolvió el matrimonio previo ${n} del cliente`,
  },
  hijos: {
    nombres: (n) => `Cuál es el primer nombre del hijo ${n} del cliente`,
    segundoNombre: (n) => `Cuál es el segundo nombre del hijo ${n} del cliente`,
    apellidoPaterno: (n) => `Cuál es el apellido paterno del hijo ${n} del cliente`,
    apellidoMaterno: (n) => `Cuál es el apellido materno del hijo ${n} del cliente`,
    fechaNacimiento: (n) => `Cuál es la fecha de nacimiento del hijo ${n} del cliente`,
    lugarNacimiento: (n) => `Dónde nació el hijo ${n} del cliente`,
    lugarResidencia: (n) => `Dónde reside el hijo ${n} del cliente`,
  },
  viajes: {
    fechaEntrada: (n) => `Cuándo fue la entrada del viaje ${n} del cliente`,
    formaEntrada: (n) => `De qué forma ingresó el cliente en el viaje ${n}`,
    lugarEntrada: (n) => `Por dónde ingresó el cliente en el viaje ${n}`,
    fechaSalida: (n) => `Cuándo fue la salida del viaje ${n} del cliente`,
    fueDetenido: (n) => `El cliente fue detenido durante el viaje ${n}`,
    detallesDetencion: (n) =>
      `Cuáles fueron los detalles de la detención durante el viaje ${n} del cliente`,
  },
  detencionesInmi: {
    lugar: (n) => `Dónde ocurrió la detención por inmigración ${n} del cliente`,
    fecha: (n) => `Cuándo ocurrió la detención por inmigración ${n} del cliente`,
    autoridad: (n) =>
      `Qué autoridad realizó la detención por inmigración ${n} del cliente`,
    ordenDeportacion: (n) =>
      `Hubo orden de deportación o remoción en la detención por inmigración ${n} del cliente`,
    sancionCastigo: (n) =>
      `Hubo sanción o castigo migratorio en la detención por inmigración ${n} del cliente`,
    regresoVoluntario: (n) =>
      `Hubo salida o regreso voluntario en la detención por inmigración ${n} del cliente`,
    fotosHuellas: (n) =>
      `Se tomaron fotografías o huellas en la detención por inmigración ${n} del cliente`,
    citaCorte: (n) =>
      `Hubo cita en corte por la detención por inmigración ${n} del cliente`,
  },
  arrestosPolicia: {
    paisCiudadEstado: (n) =>
      `En qué país, ciudad y estado ocurrió el arresto policial ${n} del cliente`,
    fecha: (n) => `Cuándo ocurrió el arresto policial ${n} del cliente`,
    motivo: (n) => `Cuál fue el motivo del arresto policial ${n} del cliente`,
    autoridad: (n) => `Qué autoridad realizó el arresto policial ${n} del cliente`,
    disposicion: (n) => `Cuál fue la disposición del arresto policial ${n} del cliente`,
  },
  empleosAnteriores: {
    empresa: (n) => `Cuál es el nombre de la empresa del empleo anterior ${n} del cliente`,
    puesto: (n) => `Cuál fue el puesto del empleo anterior ${n} del cliente`,
    direccionCalle: (n) =>
      `Cuál es la calle y número del empleo anterior ${n} del cliente`,
    direccionApto: (n) =>
      `Cuál es el apartamento o suite del empleo anterior ${n} del cliente`,
    direccionCiudad: (n) => `En qué ciudad estaba el empleo anterior ${n} del cliente`,
    direccionEstado: (n) =>
      `En qué estado o provincia estaba el empleo anterior ${n} del cliente`,
    direccionZip: (n) => `Cuál es el código postal del empleo anterior ${n} del cliente`,
    direccionPais: (n) => `En qué país estaba el empleo anterior ${n} del cliente`,
    fechaDesde: (n) => `Desde cuándo trabajó el cliente en el empleo anterior ${n}`,
    fechaHasta: (n) => `Hasta cuándo trabajó el cliente en el empleo anterior ${n}`,
  },
};

/** Etiqueta corta para encabezados de bloques repetibles en PDF (ej. "Hijo 1"). */
export function getArrayItemBlockLabel(arrayKey: string, index: number): string {
  const base = ARRAY_ITEM_LABELS[arrayKey] ?? arrayKey;
  const label = base.charAt(0).toUpperCase() + base.slice(1);
  return `${label} ${index + 1}`;
}

/** Pregunta formateada para un campo repetible (índice base 0). */
export function getArrayFieldQuestion(
  arrayKey: string,
  field: string,
  index: number
): string {
  const builder = ARRAY_FIELD_QUESTION_BUILDERS[arrayKey]?.[field];
  if (builder) {
    return formatQuestion(builder(index + 1));
  }
  const itemLabel = ARRAY_ITEM_LABELS[arrayKey] ?? arrayKey;
  return formatQuestion(`${field} del ${itemLabel} ${index + 1} del cliente`);
}

/** Pregunta formateada para un path de validación (ej. personalData.nombres). */
export function getFieldQuestion(path: string): string {
  if (FIELD_QUESTIONS[path]) {
    return formatQuestion(FIELD_QUESTIONS[path]);
  }

  const arrayMatch = path.match(/^(.+)\.(\w+)\.(\d+)\.(\w+)$/);
  if (arrayMatch) {
    const [, , arrayKey, index, field] = arrayMatch;
    return getArrayFieldQuestion(arrayKey, field, Number(index));
  }

  const parts = path.split(".");
  const last = parts[parts.length - 1];
  const parent = parts[parts.length - 2];
  if (parent && ARRAY_FIELD_QUESTION_BUILDERS[parent]?.[last]) {
    return formatQuestion(ARRAY_FIELD_QUESTION_BUILDERS[parent][last](1));
  }

  return formatQuestion(last.replace(/([A-Z])/g, " $1").trim());
}
