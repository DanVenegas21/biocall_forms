import { describe, expect, it } from "vitest";
import { buildBioCallPdfNames, slugifyNamePart } from "./pdfNaming";

describe("slugifyNamePart", () => {
  it("normaliza acentos y espacios", () => {
    expect(slugifyNamePart("  José María  ")).toBe("jose-maria");
    expect(slugifyNamePart("Niño")).toBe("nino");
  });

  it("devuelve cadena vacia para valores en blanco", () => {
    expect(slugifyNamePart("")).toBe("");
    expect(slugifyNamePart("   ")).toBe("");
    expect(slugifyNamePart(undefined)).toBe("");
  });
});

describe("buildBioCallPdfNames", () => {
  const bioCallId = "a3f8c2e1-4b5d-6e7f-8a9b-0c1d2e3f4a5b";
  const generatedAt = new Date(2025, 6, 2); // 2025-07-02 local

  it("genera rutas legibles con apellidos y primer nombre", () => {
    const result = buildBioCallPdfNames({
      bioCallId,
      personalData: {
        apellidoPaterno: "Vega",
        apellidoMaterno: "Morales",
        nombres: "Roberto Carlos",
      },
      generatedAt,
    });

    expect(result.storagePath).toBe(
      "bio-calls/vega-morales-roberto-a3f8c2e1/biocall-vega-morales-roberto-20250702.pdf"
    );
    expect(result.downloadFilename).toBe("BioCall-Vega-Morales-Roberto-2025-07-02.pdf");
  });

  it("maneja acentos en apellidos", () => {
    const result = buildBioCallPdfNames({
      bioCallId,
      personalData: {
        apellidoPaterno: "García",
        apellidoMaterno: "López",
        nombres: "María",
      },
      generatedAt,
    });

    expect(result.storagePath).toContain("garcia-lopez-maria");
    expect(result.downloadFilename).toBe("BioCall-Garcia-Lopez-Maria-2025-07-02.pdf");
  });

  it("usa fallback cliente cuando faltan nombres", () => {
    const result = buildBioCallPdfNames({
      bioCallId,
      personalData: {
        apellidoPaterno: "",
        apellidoMaterno: "",
        nombres: "",
      },
      generatedAt,
    });

    expect(result.storagePath).toBe(
      "bio-calls/cliente-a3f8c2e1/biocall-cliente-20250702.pdf"
    );
    expect(result.downloadFilename).toBe("BioCall-Cliente-2025-07-02.pdf");
  });

  it("incluye sufijo unico del UUID en la carpeta", () => {
    const otherId = "b1c2d3e4-1111-2222-3333-444455556666";
    const result = buildBioCallPdfNames({
      bioCallId: otherId,
      personalData: {
        apellidoPaterno: "Vega",
        apellidoMaterno: "Morales",
        nombres: "Roberto",
      },
      generatedAt,
    });

    expect(result.storagePath).toContain("b1c2d3e4");
    expect(result.storagePath).not.toContain(otherId);
  });
});
