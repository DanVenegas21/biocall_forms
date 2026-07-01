import type { CaseBackground } from "./schemas";

/** Campos del cuestionario de inadmisibilidad en caseBackground. */
export type InadQuestionField =
  | "inadDetencionTrafico"
  | "inadCometidoDelito"
  | "inadInmunidadDiplomatica"
  | "inadProstitucionTrafico"
  | "inadAyudaIngresoIlegal"
  | "inadTerrorismo"
  | "inadFondosTerrorismo"
  | "inadAsociacionTerrorista"
  | "inadEspionaje"
  | "inadPartidoComunista"
  | "inadParticipadoPersecucion"
  | "inadProcedimientoRemocion"
  | "inadDenegadoVisa"
  | "inadVisaT"
  | "inadMyUscis"
  | "inadGrupoMilitar"
  | "inadFraudeMigratorio"
  | "inadTrastornoFisicoMental"
  | "inadEnfermedadPublica"
  | "inadAdictoDrogas";

export interface InadmissibilityQuestion {
  number: number;
  field: InadQuestionField;
  question: string;
}

export interface AffirmativeInadAnswer {
  number: number;
  question: string;
  answer: "si";
  /** Detalle opcional (p. ej. credenciales myUSCIS). */
  detail?: string;
}

/**
 * Preguntas del cuestionario de seguridad e inadmisibilidad (orden del formulario).
 * Textos alineados con CaseSection.tsx.
 */
export const INADMISSIBILITY_QUESTIONS: readonly InadmissibilityQuestion[] = [
  {
    number: 1,
    field: "inadDetencionTrafico",
    question:
      "¿Tiene historial de detenciones de tráfico que hayan requerido ir a corte (tickets de exceso de velocidad, DUI/manejar ebrio, etc.)?",
  },
  {
    number: 2,
    field: "inadCometidoDelito",
    question:
      "¿Ha cometido algún delito, sido arrestado, acusado, condenado, recibido sentencia suspendida, estado en prisión, o recibido algún perdón o amnistía?",
  },
  {
    number: 3,
    field: "inadInmunidadDiplomatica",
    question: "¿Ha ejercido inmunidad diplomática para evitar ser procesado en los Estados Unidos?",
  },
  {
    number: 4,
    field: "inadProstitucionTrafico",
    question:
      "¿Ha estado involucrado en prostitución, actividades comerciales ilegales, o tráfico de sustancias controladas?",
  },
  {
    number: 5,
    field: "inadAyudaIngresoIlegal",
    question: "¿Ha ayudado a alguna persona a ingresar ilegalmente a los Estados Unidos?",
  },
  {
    number: 6,
    field: "inadTerrorismo",
    question:
      "¿Alguna vez ha cometido, planeado, participado o conspirado en actividades ilegales o de carácter terrorista?",
  },
  {
    number: 7,
    field: "inadFondosTerrorismo",
    question:
      "¿Ha recolectado información o fondos para actividades como secuestro, sabotaje, asesinato o uso de armas peligrosas?",
  },
  {
    number: 8,
    field: "inadAsociacionTerrorista",
    question:
      "¿Ha sido miembro, solicitado apoyo o estado asociado con una organización terrorista o grupo armado violento?",
  },
  {
    number: 9,
    field: "inadEspionaje",
    question:
      "¿Tiene la intención de participar en actividades como espionaje o actividades ilegales contra el gobierno de EE. UU.?",
  },
  {
    number: 10,
    field: "inadPartidoComunista",
    question:
      "¿Ha sido miembro del partido comunista o de algún partido totalitario en su país o el extranjero?",
  },
  {
    number: 11,
    field: "inadParticipadoPersecucion",
    question:
      "¿Ha participado en la persecución, tortura, asesinato, desplazamiento forzoso o coerción sexual de personas en asociación con el régimen nazi o similares?",
  },
  {
    number: 12,
    field: "inadProcedimientoRemocion",
    question:
      "¿Ha tenido procedimientos de remoción, exclusión, rescisión o deportación iniciados o pendientes en su contra en EE. UU.?",
  },
  {
    number: 13,
    field: "inadDenegadoVisa",
    question: "¿Le ha sido denegada alguna vez una visa o admisión a los Estados Unidos?",
  },
  {
    number: 14,
    field: "inadVisaT",
    question: "¿Alguna vez ha solicitado o le han otorgado una Visa T?",
  },
  {
    number: 15,
    field: "inadMyUscis",
    question:
      "¿Tiene cuenta de myUSCIS? En caso afirmativo, proporcione correo electrónico, contraseña, preguntas de seguridad y código de recuperación.",
  },
  {
    number: 16,
    field: "inadGrupoMilitar",
    question:
      "¿Ha participado en actos de violencia, coerción religiosa o ha sido parte de algún grupo militar, paramilitar o grupo de detención?",
  },
  {
    number: 17,
    field: "inadFraudeMigratorio",
    question:
      "¿Ha participado en actividades ilegales de armas, fraude migratorio, evitación del servicio militar o retención ilegal de un niño con ciudadanía estadounidense?",
  },
  {
    number: 18,
    field: "inadTrastornoFisicoMental",
    question:
      "¿Ha tenido o tiene algún trastorno físico o mental que pueda representar un riesgo para su seguridad o la de la propiedad?",
  },
  {
    number: 19,
    field: "inadEnfermedadPublica",
    question: "¿Tiene alguna enfermedad transmisible de importancia para la salud pública?",
  },
  {
    number: 20,
    field: "inadAdictoDrogas",
    question: "¿Ha sido en algún momento abusador o adicto a las drogas?",
  },
] as const;

function isAffirmative(field: InadQuestionField, cb: CaseBackground): boolean {
  if (field === "inadMyUscis") {
    return cb.inadMyUscis === "si";
  }
  return cb[field] === "si";
}

/** Respuestas afirmativas (solo «si») del cuestionario de inadmisibilidad. */
export function getAffirmativeInadAnswers(cb: CaseBackground): AffirmativeInadAnswer[] {
  const rows: AffirmativeInadAnswer[] = [];

  for (const item of INADMISSIBILITY_QUESTIONS) {
    if (!isAffirmative(item.field, cb)) {
      continue;
    }

    const row: AffirmativeInadAnswer = {
      number: item.number,
      question: item.question,
      answer: "si",
    };

    if (item.field === "inadMyUscis") {
      const detail = cb.inadMyUscisDetalle?.trim();
      if (detail) {
        row.detail = detail;
      }
    }

    rows.push(row);
  }

  return rows;
}
