import { describe, expect, it } from "vitest";
import { readSplitName } from "./nameFields";

describe("readSplitName", () => {
  it("devuelve columnas separadas cuando existen", () => {
    expect(
      readSplitName("Diego Francisco", "Vega", "Hernandez", "Diego Francisco Vega Hernandez")
    ).toEqual({
      nombres: "Diego Francisco",
      apellidoPaterno: "Vega",
      apellidoMaterno: "Hernandez",
    });
  });

  it("usa legacy concatenado cuando no hay columnas separadas", () => {
    expect(readSplitName(null, null, null, "Diego Francisco Vega Hernandez")).toEqual({
      nombres: "Diego Francisco Vega Hernandez",
      apellidoPaterno: "",
      apellidoMaterno: "",
    });
  });

  it("prefiere columnas separadas aunque exista legacy", () => {
    expect(readSplitName("Luis", "Perez", "Lopez", "Luis Perez Lopez")).toEqual({
      nombres: "Luis",
      apellidoPaterno: "Perez",
      apellidoMaterno: "Lopez",
    });
  });
});
