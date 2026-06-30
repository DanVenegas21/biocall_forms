import { describe, expect, it } from "vitest";
import { validateBioCall } from "./formatErrors";

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

const basePayload = {
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
    tieneANumber: "no",
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
  caseBackground: emptyCaseBackground,
};

describe("validateBioCall", () => {
  it("acepta datos validos", () => {
    const result = validateBioCall(basePayload);
    expect(result.ok).toBe(true);
  });

  it("rechaza nombre con numeros", () => {
    const result = validateBioCall({
      ...basePayload,
      personalData: { ...basePayload.personalData, nombres: "Natalia 4" },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorMap["personalData.nombres"]).toBeTruthy();
    }
  });

  it("rechaza apellido con simbolos", () => {
    const result = validateBioCall({
      ...basePayload,
      personalData: { ...basePayload.personalData, apellidoPaterno: "Reyes_" },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorMap["personalData.apellidoPaterno"]).toBeTruthy();
    }
  });

  it("rechaza fecha de nacimiento fuera de rango", () => {
    const result = validateBioCall({
      ...basePayload,
      personalData: { ...basePayload.personalData, fechaNacimiento: "0001-01-01" },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorMap["personalData.fechaNacimiento"]).toBeTruthy();
    }
  });

  it("rechaza correo sin formato valido", () => {
    const result = validateBioCall({
      ...basePayload,
      contact: { ...basePayload.contact, correoElectronico: "maquinadefuego134" },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorMap["contact.correoElectronico"]).toBeTruthy();
    }
  });

  it("rechaza codigo postal invalido", () => {
    const result = validateBioCall({
      ...basePayload,
      address: {
        ...basePayload.address,
        codigoPostal: "78000598762518526+56+",
      },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorMap["address.codigoPostal"]).toBeTruthy();
    }
  });

  it("permite fecha de ingreso en texto libre", () => {
    const result = validateBioCall({
      ...basePayload,
      address: { ...basePayload.address, fechaIngreso: "Ayer" },
    });
    expect(result.ok).toBe(true);
  });

  it("rechaza documentos pendientes que exceden el maximo", () => {
    const result = validateBioCall({
      ...basePayload,
      caseBackground: {
        ...emptyCaseBackground,
        documentosPendientes: "x".repeat(2001),
      },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorMap["caseBackground.documentosPendientes"]).toBeTruthy();
    }
  });

  it("rechaza fecha de matrimonio del conyuge demasiado larga", () => {
    const result = validateBioCall({
      ...basePayload,
      family: {
        ...basePayload.family,
        tieneConyuge: "si",
        nombresConyuge: "Ana",
        apellidoPaternoConyuge: "Lopez",
        fechaLugarMatrimonioConyuge: "x".repeat(101),
      },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorMap["family.fechaLugarMatrimonioConyuge"]).toBeTruthy();
    }
  });
});
