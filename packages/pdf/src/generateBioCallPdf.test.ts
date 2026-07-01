import { describe, expect, it } from "vitest";
import pdfParse from "pdf-parse";
import { bioCallSchema } from "@biocall/shared";
import { generateBioCallPdf } from "./generateBioCallPdf";
import bc001 from "./__fixtures__/bc_001.json";
import bcAllNoInad from "./__fixtures__/bc_all_no_inad.json";

describe("generateBioCallPdf", () => {
  it("genera un buffer PDF no vacio", async () => {
    const data = bioCallSchema.parse(bc001);
    const buffer = await generateBioCallPdf(data);
    expect(buffer.length).toBeGreaterThan(1000);
    expect(buffer.subarray(0, 4).toString()).toBe("%PDF");
  });

  it("incluye datos clave del cliente bc_001", async () => {
    const data = bioCallSchema.parse(bc001);
    const buffer = await generateBioCallPdf(data);
    const parsed = await pdfParse(buffer);
    const text = parsed.text;

    expect(text).toContain("Juan Carlos");
    expect(text).toContain("Ciudad de Mexico");
    expect(text).toContain("Datos personales");
    expect(text).toContain("Empresa Ejemplo S.A.");
    expect(text).toContain("Patrulla fronteriza");
    expect(text).toContain("Junio 2008, Ciudad de Mexico");
    expect(text).toContain("Enero 1982, Guadalajara, Mexico");
    expect(text).toContain("Documentos y correos");
    expect(text).toContain("pendientes");
    expect(text).toContain("Acta de nacimiento, taxes 2024");
    expect(text).toContain("Enviar link del portal");
    expect(text).toContain("— Hijo 1 —");
    expect(text).toContain("¿Cual es el nombre del hijo 1?");
    expect(text).toContain("¿Cual es el apellido paterno del hijo 1?");
    expect(text).toContain("Plantilla v1.8");
    expect(text).toContain("Nombres del padre");
    expect(text).toContain("Pedro");
  });

  it("muestra tabla de inadmisibilidad solo con respuestas afirmativas", async () => {
    const data = bioCallSchema.parse(bc001);
    const buffer = await generateBioCallPdf(data);
    const text = (await pdfParse(buffer)).text;

    expect(text).toContain("Cuestionario de inadmisibilidad");
    expect(text).toContain("Pregunta");
    expect(text).toContain("Respuesta");
    expect(text).toMatch(/procedimientos de remoci/i);
    expect(text).toMatch(/S[\u00edi]/);
    expect(text).not.toContain("Detencion por trafico:");
    expect(text).not.toContain("Fraude migratorio:");
  });

  it("muestra resumen cuando no hay respuestas afirmativas en inadmisibilidad", async () => {
    const data = bioCallSchema.parse(bcAllNoInad);
    const buffer = await generateBioCallPdf(data);
    const text = (await pdfParse(buffer)).text;

    expect(text).toContain("Cuestionario de inadmisibilidad");
    expect(text).toContain("Sin respuestas afirmativas en el cuestionario de inadmisibilidad.");
    expect(text).not.toContain("procedimientos de remoci");
    expect(text).not.toContain("Detencion por trafico:");
  });
});
