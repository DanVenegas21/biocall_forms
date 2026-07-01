import { describe, expect, it } from "vitest";
import { normalizeBioCallPayload } from "../normalizeBioCallPayload";
import { bioCallSchema } from "../schemas";
import { validateBioCallSave } from "./formatErrors";

const emptyCaseBackground = {
  viajes: [],
  viajesComentarios: "",
  detenidoInmigracion: "no",
  detencionesInmi: [],
  arrestadoPolicia: "no",
  arrestosPolicia: [],
  empleoNombre: "",
  empleoOcupacion: "",
  empleoDireccionCalle: "",
  empleoDireccionApto: "",
  empleoDireccionCiudad: "",
  empleoDireccionEstado: "",
  empleoDireccionZip: "",
  empleoDireccionPais: "",
  empleoFechaIngreso: "",
  empleoFechaSalida: "",
  empleoOtrosLugares: "no",
  empleosAnteriores: [],
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
  declaradoCiudadano: "no",
  falsaDeclaracionLugar: "",
  falsaDeclaracionFecha: "",
  falsaDeclaracionComo: "",
  falsaDeclaracionIntencion: "",
  falsaDeclaracionDetalle: "",
  foias: {
    uscis: { solicitar: "no", motivo: "" },
    ice: { solicitar: "no", motivo: "" },
    cbp: { solicitar: "no", motivo: "" },
    eoir: { solicitar: "no", motivo: "" },
    fbi: { solicitar: "no", motivo: "" },
    policia: { solicitar: "no", motivo: "" },
  },
  documentosPendientes: "",
  correosPendientes: "",
};

const saveReadyPayload = {
  personalData: {
    nombres: "Natalia Hilda",
    apellidoPaterno: "Reyes",
    apellidoMaterno: "Gonzalez",
    fechaNacimiento: "1985-03-14",
    ciudadNacimiento: "Tamaulipas",
    estadoNacimiento: "",
    paisNacimiento: "Mexico",
    sexo: "Femenino",
    estadoCivil: "Casado(a)",
    nacionalidad: "Mexicana",
    comprendeIngles: "no",
    idiomaPreferido: "Espanol",
    hablaOtroIdioma: "no",
    especificarIdioma: "NO",
    otrosNombres: "NATALIA REYES",
  },
  contact: {
    telefono: "423-353-0235",
    correoElectronico: "natalia.reyes@ejemplo.com",
  },
  address: {
    calleNumero: "2058 Autumn Lane",
    aptoSuite: "",
    ciudad: "Morristown",
    estado: "Tennessee",
    codigoPostal: "37814",
    pais: "Estados Unidos",
    fechaIngreso: "Mayo 2023",
    resididoOtrosLugares: "no",
    direccionesAnteriores: [],
  },
  documents: {
    tienePasaporte: "no",
    pasaportePendiente: "no",
    numeroPasaporte: "",
    paisEmision: "",
    fechaEmision: "",
    fechaExpiracion: "",
    tieneANumber: "no_sabe",
    aNumberValue: "",
    aNumberOrigen: "",
    tieneSSN: "no",
    ssnValue: "",
    tieneEAD: "no",
    eadValue: "",
  },
  family: {
    tieneConyuge: "no",
    nombresConyuge: "",
    apellidoPaternoConyuge: "",
    apellidoMaternoConyuge: "",
    fechaLugarMatrimonioConyuge: "",
    fechaLugarNacimientoConyuge: "",
    nombresPadre: "",
    apellidoPaternoPadre: "",
    apellidoMaternoPadre: "",
    nombresMadre: "",
    apellidoPaternoMadre: "",
    apellidoMaternoMadre: "",
    casado: "no",
    previamenteCasado: "no",
    matrimoniosPrevios: [],
    tieneHijos: "no",
    hijos: [],
  },
  caseBackground: {
    ...emptyCaseBackground,
    inadDetencionTrafico: "no_sabe",
  },
};

describe("validateBioCallSave", () => {
  it("acepta payload completo con no_sabe y expiracion futura", () => {
    const payload = {
      ...saveReadyPayload,
      documents: {
        ...saveReadyPayload.documents,
        tienePasaporte: "si",
        pasaportePendiente: "no",
        numeroPasaporte: "G71234567",
        paisEmision: "Mexico",
        fechaEmision: "2018-04-12",
        fechaExpiracion: "2028-04-12",
      },
    };
    const result = validateBioCallSave(payload);
    expect(result.ok).toBe(true);
  });

  it("rechaza fecha de nacimiento vacia al guardar", () => {
    const result = validateBioCallSave({
      ...saveReadyPayload,
      personalData: { ...saveReadyPayload.personalData, fechaNacimiento: "" },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorMap["personalData.fechaNacimiento"]).toBeTruthy();
    }
  });
});

describe("bioCallSchema fechas de pasaporte", () => {
  it("acepta fecha de expiracion futura", () => {
    const result = bioCallSchema.safeParse({
      ...saveReadyPayload,
      documents: {
        ...saveReadyPayload.documents,
        fechaExpiracion: "2028-04-12",
      },
    });
    expect(result.success).toBe(true);
  });
});

describe("normalizeBioCallPayload", () => {
  it("mueve credenciales myUSCIS a inadMyUscisDetalle", () => {
    const normalized = normalizeBioCallPayload({
      ...saveReadyPayload,
      caseBackground: {
        ...emptyCaseBackground,
        inadMyUscis: "usuario@email.com / pass123",
      },
    }) as typeof saveReadyPayload;

    expect(normalized.caseBackground.inadMyUscis).toBe("si");
    expect(normalized.caseBackground.inadMyUscisDetalle).toBe("usuario@email.com / pass123");

    const parsed = bioCallSchema.safeParse(normalized);
    expect(parsed.success).toBe(true);
  });
});
