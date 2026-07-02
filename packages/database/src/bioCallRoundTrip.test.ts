import { describe, expect, it } from "vitest";
import { bioCallSchema } from "@biocall/shared";
import { getBioCall, saveBioCall } from "./index";
import bc001 from "../../pdf/src/__fixtures__/bc_001.json";

const hasDatabase = Boolean(process.env.DATABASE_URL?.trim());

describe.skipIf(!hasDatabase)("saveBioCall / getBioCall round-trip", () => {
  it("conserva nombres de hijos separados", async () => {
    const data = bioCallSchema.parse(bc001);
    const { id } = await saveBioCall(data);
    const record = await getBioCall(id);

    expect(record).not.toBeNull();
    expect(record!.data.family.hijos[0]).toMatchObject({
      nombres: "Luis",
      apellidoPaterno: "Perez",
      apellidoMaterno: "Lopez",
    });
    expect(record!.data.family.nombresPadre).toBe("Pedro");
    expect(record!.data.family.apellidoPaternoPadre).toBe("Perez");
    expect(record!.data.family.fechaMatrimonioConyuge).toBe("Junio 2008");
    expect(record!.data.family.lugarMatrimonioConyuge).toBe("Ciudad de Mexico");
    expect(record!.data.family.fechaNacimientoConyuge).toBe("Enero 1982");
    expect(record!.data.family.lugarNacimientoConyuge).toBe("Guadalajara, Mexico");
  }, 20000);
});
