import type { BioCall, BioCallRecord, BioCallStatus } from "@biocall/shared";
import { prisma } from "./client";

function nullToEmpty(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function formatDate(value: Date | null | undefined): string {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
}

/**
 * Nombres guardados concatenados en BD: se devuelven en `nombres` sin separar apellidos.
 * Round-trip fiel pendiente de migracion a columnas separadas.
 */
function concatenatedName(full: string | null | undefined): {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
} {
  return {
    nombres: nullToEmpty(full),
    apellidoPaterno: "",
    apellidoMaterno: "",
  };
}

const bioCallInclude = {
  personalData: true,
  contact: true,
  address: true,
  previousAddresses: { orderBy: { sortOrder: "asc" as const } },
  documents: true,
  family: true,
  children: { orderBy: { sortOrder: "asc" as const } },
  previousMarriages: { orderBy: { sortOrder: "asc" as const } },
  caseBackground: true,
  trips: { orderBy: { sortOrder: "asc" as const } },
  immigrationDetentions: { orderBy: { sortOrder: "asc" as const } },
  policeArrests: { orderBy: { sortOrder: "asc" as const } },
  previousEmployments: { orderBy: { sortOrder: "asc" as const } },
} as const;

export async function getBioCall(id: string): Promise<BioCallRecord | null> {
  const record = await prisma.bioCall.findUnique({
    where: { id },
    include: bioCallInclude,
  });

  if (!record?.personalData || !record.contact || !record.address || !record.caseBackground) {
    return null;
  }

  const pd = record.personalData;
  const contact = record.contact;
  const addr = record.address;
  const doc = record.documents;
  const fam = record.family;
  const cb = record.caseBackground;
  const padre = concatenatedName(fam?.nombrePadre);
  const madre = concatenatedName(fam?.nombreMadre);

  const data: BioCall = {
    personalData: {
      nombres: nullToEmpty(pd.nombres),
      apellidoPaterno: nullToEmpty(pd.apellidoPaterno),
      apellidoMaterno: nullToEmpty(pd.apellidoMaterno),
      fechaNacimiento: formatDate(pd.fechaNacimiento),
      ciudadNacimiento: nullToEmpty(pd.ciudadNacimiento),
      estadoNacimiento: nullToEmpty(pd.estadoNacimiento),
      paisNacimiento: nullToEmpty(pd.paisNacimiento),
      sexo: nullToEmpty(pd.sexo),
      estadoCivil: nullToEmpty(pd.estadoCivil),
      nacionalidad: nullToEmpty(pd.nacionalidad),
      comprendeIngles: nullToEmpty(pd.comprendeIngles),
      idiomaPreferido: nullToEmpty(pd.idiomaPreferido),
      hablaOtroIdioma: nullToEmpty(pd.hablaOtroIdioma),
      especificarIdioma: nullToEmpty(pd.especificarIdioma),
      otrosNombres: nullToEmpty(pd.otrosNombres),
    },
    contact: {
      telefono: nullToEmpty(contact.telefono),
      correoElectronico: nullToEmpty(contact.correoElectronico),
    },
    address: {
      calleNumero: nullToEmpty(addr.calleNumero),
      aptoSuite: nullToEmpty(addr.aptoSuite),
      ciudad: nullToEmpty(addr.ciudad),
      estado: nullToEmpty(addr.estado),
      codigoPostal: nullToEmpty(addr.codigoPostal),
      pais: nullToEmpty(addr.pais),
      fechaIngreso: nullToEmpty(addr.fechaIngreso),
      resididoOtrosLugares: nullToEmpty(addr.resididoOtrosLugares),
      direccionesAnteriores: record.previousAddresses.map((item) => ({
        calleNumero: nullToEmpty(item.calleNumero),
        aptoSuite: nullToEmpty(item.aptoSuite),
        ciudad: nullToEmpty(item.ciudad),
        estado: nullToEmpty(item.estado),
        codigoPostal: nullToEmpty(item.codigoPostal),
        pais: nullToEmpty(item.pais),
        fechaDesde: nullToEmpty(item.fechaDesde),
        fechaHasta: nullToEmpty(item.fechaHasta),
      })),
    },
    documents: {
      tienePasaporte: nullToEmpty(doc?.tienePasaporte),
      pasaportePendiente: nullToEmpty(doc?.pasaportePendiente),
      numeroPasaporte: nullToEmpty(doc?.numeroPasaporte),
      paisEmision: nullToEmpty(doc?.paisEmision),
      fechaEmision: formatDate(doc?.fechaEmision),
      fechaExpiracion: formatDate(doc?.fechaExpiracion),
      tieneANumber: nullToEmpty(doc?.tieneANumber),
      aNumberValue: nullToEmpty(doc?.aNumberValue),
      aNumberOrigen: nullToEmpty(doc?.aNumberOrigen),
      tieneSSN: nullToEmpty(doc?.tieneSSN),
      ssnValue: nullToEmpty(doc?.ssnValue),
      tieneEAD: nullToEmpty(doc?.tieneEAD),
      eadValue: nullToEmpty(doc?.eadValue),
    },
    family: {
      tieneConyuge: nullToEmpty(fam?.tieneConyuge),
      nombresConyuge: nullToEmpty(fam?.nombresConyuge),
      apellidoPaternoConyuge: nullToEmpty(fam?.apellidoPaternoConyuge),
      apellidoMaternoConyuge: nullToEmpty(fam?.apellidoMaternoConyuge),
      fechaLugarMatrimonioConyuge: nullToEmpty(fam?.fechaLugarMatrimonioConyuge),
      fechaLugarNacimientoConyuge: nullToEmpty(fam?.fechaLugarNacimientoConyuge),
      nombresPadre: padre.nombres,
      apellidoPaternoPadre: padre.apellidoPaterno,
      apellidoMaternoPadre: padre.apellidoMaterno,
      nombresMadre: madre.nombres,
      apellidoPaternoMadre: madre.apellidoPaterno,
      apellidoMaternoMadre: madre.apellidoMaterno,
      casado: nullToEmpty(fam?.casado),
      previamenteCasado: nullToEmpty(fam?.previamenteCasado),
      matrimoniosPrevios: record.previousMarriages.map((item) => {
        const ex = concatenatedName(item.nombreExConyuge);
        return {
          nombresExConyuge: ex.nombres,
          apellidoPaternoExConyuge: ex.apellidoPaterno,
          apellidoMaternoExConyuge: ex.apellidoMaterno,
          fechaLugarMatrimonio: nullToEmpty(item.fechaLugarMatrimonio),
          fechaLugarNacimiento: nullToEmpty(item.fechaLugarNacimiento),
          fechaLugarDivorcio: nullToEmpty(item.fechaLugarDivorcio),
        };
      }),
      tieneHijos: nullToEmpty(fam?.tieneHijos),
      hijos: record.children.map((item) => {
        const hijo = concatenatedName(item.nombre);
        return {
          nombres: hijo.nombres,
          apellidoPaterno: hijo.apellidoPaterno,
          apellidoMaterno: hijo.apellidoMaterno,
          fechaNacimiento: nullToEmpty(item.fechaNacimiento),
          lugarNacimiento: nullToEmpty(item.lugarNacimiento),
          lugarResidencia: nullToEmpty(item.lugarResidencia),
        };
      }),
    },
    caseBackground: {
      viajes: record.trips.map((item) => ({
        fechaEntrada: nullToEmpty(item.fechaEntrada),
        formaEntrada: nullToEmpty(item.formaEntrada),
        lugarEntrada: nullToEmpty(item.lugarEntrada),
        fechaSalida: nullToEmpty(item.fechaSalida),
        fueDetenido: nullToEmpty(item.fueDetenido),
        detallesDetencion: nullToEmpty(item.detallesDetencion),
      })),
      viajesComentarios: nullToEmpty(cb.viajesComentarios),
      detenidoInmigracion: nullToEmpty(cb.detenidoInmigracion),
      detencionesInmi: record.immigrationDetentions.map((item) => ({
        lugar: nullToEmpty(item.lugar),
        fecha: nullToEmpty(item.fecha),
        autoridad: nullToEmpty(item.autoridad),
        ordenDeportacion: nullToEmpty(item.ordenDeportacion),
        sancionCastigo: nullToEmpty(item.sancionCastigo),
        regresoVoluntario: nullToEmpty(item.regresoVoluntario),
        fotosHuellas: nullToEmpty(item.fotosHuellas),
        citaCorte: nullToEmpty(item.citaCorte),
      })),
      arrestadoPolicia: nullToEmpty(cb.arrestadoPolicia),
      arrestosPolicia: record.policeArrests.map((item) => ({
        paisCiudadEstado: nullToEmpty(item.paisCiudadEstado),
        fecha: nullToEmpty(item.fecha),
        motivo: nullToEmpty(item.motivo),
        autoridad: nullToEmpty(item.autoridad),
        disposicion: nullToEmpty(item.disposicion),
      })),
      empleoNombre: nullToEmpty(cb.empleoNombre),
      empleoOcupacion: nullToEmpty(cb.empleoOcupacion),
      empleoDireccionCalle: nullToEmpty(cb.empleoDireccionCalle),
      empleoDireccionApto: nullToEmpty(cb.empleoDireccionApto),
      empleoDireccionCiudad: nullToEmpty(cb.empleoDireccionCiudad),
      empleoDireccionEstado: nullToEmpty(cb.empleoDireccionEstado),
      empleoDireccionZip: nullToEmpty(cb.empleoDireccionZip),
      empleoDireccionPais: nullToEmpty(cb.empleoDireccionPais),
      empleoFechaIngreso: nullToEmpty(cb.empleoFechaIngreso),
      empleoFechaSalida: nullToEmpty(cb.empleoFechaSalida),
      empleoOtrosLugares: nullToEmpty(cb.empleoOtrosLugares),
      empleosAnteriores: record.previousEmployments.map((item) => ({
        empresa: nullToEmpty(item.empresa),
        puesto: nullToEmpty(item.puesto),
        direccionCalle: nullToEmpty(item.direccionCalle),
        direccionApto: nullToEmpty(item.direccionApto),
        direccionCiudad: nullToEmpty(item.direccionCiudad),
        direccionEstado: nullToEmpty(item.direccionEstado),
        direccionZip: nullToEmpty(item.direccionZip),
        direccionPais: nullToEmpty(item.direccionPais),
        fechaDesde: nullToEmpty(item.fechaDesde),
        fechaHasta: nullToEmpty(item.fechaHasta),
      })),
      inadDetencionTrafico: nullToEmpty(cb.inadDetencionTrafico),
      inadCometidoDelito: nullToEmpty(cb.inadCometidoDelito),
      inadInmunidadDiplomatica: nullToEmpty(cb.inadInmunidadDiplomatica),
      inadProstitucionTrafico: nullToEmpty(cb.inadProstitucionTrafico),
      inadAyudaIngresoIlegal: nullToEmpty(cb.inadAyudaIngresoIlegal),
      inadTerrorismo: nullToEmpty(cb.inadTerrorismo),
      inadFondosTerrorismo: nullToEmpty(cb.inadFondosTerrorismo),
      inadAsociacionTerrorista: nullToEmpty(cb.inadAsociacionTerrorista),
      inadEspionaje: nullToEmpty(cb.inadEspionaje),
      inadPartidoComunista: nullToEmpty(cb.inadPartidoComunista),
      inadParticipadoPersecucion: nullToEmpty(cb.inadParticipadoPersecucion),
      inadProcedimientoRemocion: nullToEmpty(cb.inadProcedimientoRemocion),
      inadDenegadoVisa: nullToEmpty(cb.inadDenegadoVisa),
      inadVisaT: nullToEmpty(cb.inadVisaT),
      inadMyUscis: nullToEmpty(cb.inadMyUscis),
      inadMyUscisDetalle: nullToEmpty(cb.inadMyUscisDetalle),
      inadGrupoMilitar: nullToEmpty(cb.inadGrupoMilitar),
      inadFraudeMigratorio: nullToEmpty(cb.inadFraudeMigratorio),
      inadTrastornoFisicoMental: nullToEmpty(cb.inadTrastornoFisicoMental),
      inadEnfermedadPublica: nullToEmpty(cb.inadEnfermedadPublica),
      inadAdictoDrogas: nullToEmpty(cb.inadAdictoDrogas),
      declaradoCiudadano: nullToEmpty(cb.declaradoCiudadano),
      falsaDeclaracionLugar: nullToEmpty(cb.falsaDeclaracionLugar),
      falsaDeclaracionFecha: nullToEmpty(cb.falsaDeclaracionFecha),
      falsaDeclaracionComo: nullToEmpty(cb.falsaDeclaracionComo),
      falsaDeclaracionIntencion: nullToEmpty(cb.falsaDeclaracionIntencion),
      falsaDeclaracionDetalle: nullToEmpty(cb.falsaDeclaracionDetalle),
      foias: {
        uscis: {
          solicitar: nullToEmpty(cb.foiaUscisSolicitar),
          motivo: nullToEmpty(cb.foiaUscisMotivo),
        },
        ice: {
          solicitar: nullToEmpty(cb.foiaIceSolicitar),
          motivo: nullToEmpty(cb.foiaIceMotivo),
        },
        cbp: {
          solicitar: nullToEmpty(cb.foiaCbpSolicitar),
          motivo: nullToEmpty(cb.foiaCbpMotivo),
        },
        eoir: {
          solicitar: nullToEmpty(cb.foiaEoirSolicitar),
          motivo: nullToEmpty(cb.foiaEoirMotivo),
        },
        fbi: {
          solicitar: nullToEmpty(cb.foiaFbiSolicitar),
          motivo: nullToEmpty(cb.foiaFbiMotivo),
        },
        policia: {
          solicitar: nullToEmpty(cb.foiaPoliciaSolicitar),
          motivo: nullToEmpty(cb.foiaPoliciaMotivo),
        },
      },
      documentosPendientes: nullToEmpty(cb.documentosPendientes),
      correosPendientes: nullToEmpty(cb.correosPendientes),
    },
  };

  return {
    id: record.id,
    status: record.status as BioCallStatus,
    data,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
