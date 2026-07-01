import { describe, expect, it } from "vitest";
import { getAffirmativeInadAnswers, INADMISSIBILITY_QUESTIONS } from "./inadmissibilityQuestions";
import type { CaseBackground } from "./schemas";

const baseInad: Pick<
  CaseBackground,
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
  | "inadMyUscisDetalle"
  | "inadGrupoMilitar"
  | "inadFraudeMigratorio"
  | "inadTrastornoFisicoMental"
  | "inadEnfermedadPublica"
  | "inadAdictoDrogas"
> = {
  inadDetencionTrafico: "no",
  inadCometidoDelito: "no",
  inadInmunidadDiplomatica: "no",
  inadProstitucionTrafico: "no",
  inadAyudaIngresoIlegal: "no",
  inadTerrorismo: "no",
  inadFondosTerrorismo: "no",
  inadAsociacionTerrorista: "no",
  inadEspionaje: "no",
  inadPartidoComunista: "no",
  inadParticipadoPersecucion: "no",
  inadProcedimientoRemocion: "no",
  inadDenegadoVisa: "no",
  inadVisaT: "no",
  inadMyUscis: "no",
  inadMyUscisDetalle: "",
  inadGrupoMilitar: "no",
  inadFraudeMigratorio: "no",
  inadTrastornoFisicoMental: "no",
  inadEnfermedadPublica: "no",
  inadAdictoDrogas: "no",
};

describe("getAffirmativeInadAnswers", () => {
  it("devuelve array vacio cuando todas las respuestas son no", () => {
    expect(getAffirmativeInadAnswers(baseInad as CaseBackground)).toEqual([]);
  });

  it("incluye solo preguntas con respuesta si", () => {
    const rows = getAffirmativeInadAnswers({
      ...baseInad,
      inadCometidoDelito: "si",
      inadProcedimientoRemocion: "si",
      inadDenegadoVisa: "no_sabe",
    } as CaseBackground);

    expect(rows).toHaveLength(2);
    expect(rows[0]?.number).toBe(2);
    expect(rows[1]?.number).toBe(12);
  });

  it("detecta myUSCIS afirmativo e incluye detalle", () => {
    const rows = getAffirmativeInadAnswers({
      ...baseInad,
      inadMyUscis: "si",
      inadMyUscisDetalle: "Correo: usuario@ejemplo.com",
    } as CaseBackground);

    expect(rows).toHaveLength(1);
    expect(rows[0]?.number).toBe(15);
    expect(rows[0]?.detail).toBe("Correo: usuario@ejemplo.com");
  });

  it("catalogo tiene 20 preguntas numeradas del 1 al 20", () => {
    expect(INADMISSIBILITY_QUESTIONS).toHaveLength(20);
    expect(INADMISSIBILITY_QUESTIONS.map((q) => q.number)).toEqual(
      Array.from({ length: 20 }, (_, i) => i + 1)
    );
  });
});
