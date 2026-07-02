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
  const bioCallId = "vega-morales-roberto-20250702";
  const generatedAt = new Date(2025, 6, 2); // 2025-07-02 local

  it("usa bioCallId como carpeta en Storage", () => {
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
      "bio-calls/vega-morales-roberto-20250702/biocall-vega-morales-roberto-20250702.pdf"
    );
    expect(result.downloadFilename).toBe("BioCall-Vega-Morales-Roberto-2025-07-02.pdf");
  });

  it("maneja acentos en apellidos", () => {
    const result = buildBioCallPdfNames({
      bioCallId: "garcia-lopez-maria-20250702",
      personalData: {
        apellidoPaterno: "García",
        apellidoMaterno: "López",
        nombres: "María",
      },
      generatedAt,
    });

    expect(result.storagePath).toBe(
      "bio-calls/garcia-lopez-maria-20250702/biocall-garcia-lopez-maria-20250702.pdf"
    );
    expect(result.downloadFilename).toBe("BioCall-Garcia-Lopez-Maria-2025-07-02.pdf");
  });

  it("usa fallback cliente cuando faltan nombres", () => {
    const result = buildBioCallPdfNames({
      bioCallId: "cliente-20250702",
      personalData: {
        apellidoPaterno: "",
        apellidoMaterno: "",
        nombres: "",
      },
      generatedAt,
    });

    expect(result.storagePath).toBe("bio-calls/cliente-20250702/biocall-cliente-20250702.pdf");
    expect(result.downloadFilename).toBe("BioCall-Cliente-2025-07-02.pdf");
  });

  it("soporta sufijo de colision en el id", () => {
    const result = buildBioCallPdfNames({
      bioCallId: "vega-morales-roberto-20250702-02",
      personalData: {
        apellidoPaterno: "Vega",
        apellidoMaterno: "Morales",
        nombres: "Roberto",
      },
      generatedAt,
    });

    expect(result.storagePath).toBe(
      "bio-calls/vega-morales-roberto-20250702-02/biocall-vega-morales-roberto-20250702-02.pdf"
    );
  });
});
