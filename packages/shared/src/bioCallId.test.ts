import { describe, expect, it } from "vitest";
import { buildBioCallIdBase, buildBioCallIdCandidate } from "./bioCallId";

const createdAt = new Date(2025, 6, 2); // 2025-07-02 local

describe("buildBioCallIdBase", () => {
  it("genera slug con apellidos, primer nombre y fecha", () => {
    expect(
      buildBioCallIdBase({
        personalData: {
          apellidoPaterno: "Vega",
          apellidoMaterno: "Morales",
          nombres: "Roberto Carlos",
        },
        createdAt,
      })
    ).toBe("vega-morales-roberto-20250702");
  });

  it("normaliza acentos", () => {
    expect(
      buildBioCallIdBase({
        personalData: {
          apellidoPaterno: "García",
          apellidoMaterno: "López",
          nombres: "María",
        },
        createdAt,
      })
    ).toBe("garcia-lopez-maria-20250702");
  });

  it("usa fallback cliente sin nombres", () => {
    expect(
      buildBioCallIdBase({
        personalData: {
          apellidoPaterno: "",
          apellidoMaterno: "",
          nombres: "",
        },
        createdAt,
      })
    ).toBe("cliente-20250702");
  });
});

describe("buildBioCallIdCandidate", () => {
  const base = "vega-morales-roberto-20250702";

  it("devuelve base en el primer intento", () => {
    expect(buildBioCallIdCandidate(base, 1)).toBe(base);
  });

  it("agrega sufijo numerico en colisiones", () => {
    expect(buildBioCallIdCandidate(base, 2)).toBe("vega-morales-roberto-20250702-02");
    expect(buildBioCallIdCandidate(base, 3)).toBe("vega-morales-roberto-20250702-03");
  });
});
