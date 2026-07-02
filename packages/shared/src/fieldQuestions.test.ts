import { describe, expect, it } from "vitest";
import {
  formatQuestion,
  getArrayFieldQuestion,
  getFieldQuestion,
} from "./fieldQuestions";

describe("fieldQuestions", () => {
  it("formatea preguntas con signos de interrogación", () => {
    expect(formatQuestion("Cuál es el primer nombre del cliente")).toBe(
      "¿Cuál es el primer nombre del cliente?"
    );
    expect(formatQuestion("¿Cuál es el primer nombre del cliente?")).toBe(
      "¿Cuál es el primer nombre del cliente?"
    );
  });

  it("devuelve pregunta para campos escalares", () => {
    expect(getFieldQuestion("personalData.nombres")).toBe(
      "¿Cuál es el primer nombre del cliente?"
    );
    expect(getFieldQuestion("contact.telefono")).toBe(
      "¿Cuál es el teléfono de contacto del cliente?"
    );
  });

  it("devuelve pregunta para campos repetibles", () => {
    expect(getArrayFieldQuestion("hijos", "nombres", 0)).toBe(
      "¿Cuál es el primer nombre del hijo 1 del cliente?"
    );
    expect(getFieldQuestion("family.hijos.1.apellidoPaterno")).toBe(
      "¿Cuál es el apellido paterno del hijo 2 del cliente?"
    );
  });

  it("usa acentos y referencia al cliente de forma consistente", () => {
    expect(getFieldQuestion("family.nombresPadre")).toContain("padre del cliente");
    expect(getFieldQuestion("address.ciudad")).toMatch(/¿En qué ciudad/);
    expect(getFieldQuestion("caseBackground.empleoNombre")).toMatch(/empleador actual/);
  });
});
