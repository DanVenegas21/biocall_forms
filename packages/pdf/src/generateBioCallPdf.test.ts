import { describe, expect, it } from "vitest";
import pdfParse from "pdf-parse";
import { bioCallSchema } from "@biocall/shared";
import { generateBioCallPdf } from "./generateBioCallPdf";
import bc001 from "./__fixtures__/bc_001.json";

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
  });
});
