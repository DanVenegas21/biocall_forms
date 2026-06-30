import type { Prisma } from "@prisma/client";
import type { BioCall } from "@biocall/shared";
import { prisma } from "./client";

function emptyToNull(value: string | undefined | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function parseOptionalDate(value: string): Date | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseRequiredDate(value: string): Date {
  const parsed = parseOptionalDate(value);
  if (!parsed) {
    throw new Error(`Fecha invalida: ${value}`);
  }
  return parsed;
}

function childId(bioCallId: string, prefix: string, index: number): string {
  return `${bioCallId}_${prefix}_${index}`;
}

function fullName(...parts: (string | undefined | null)[]): string {
  return parts.map((part) => part?.trim() ?? "").filter(Boolean).join(" ");
}

function mapCaseBackground(
  cb: BioCall["caseBackground"]
): Omit<Prisma.BioCallCaseBackgroundUncheckedCreateWithoutBioCallInput, "bioCallId"> {
  const { foias } = cb;
  return {
    viajesComentarios: emptyToNull(cb.viajesComentarios),
    detenidoInmigracion: emptyToNull(cb.detenidoInmigracion),
    arrestadoPolicia: emptyToNull(cb.arrestadoPolicia),
    empleoNombre: emptyToNull(cb.empleoNombre),
    empleoOcupacion: emptyToNull(cb.empleoOcupacion),
    empleoDireccionCalle: emptyToNull(cb.empleoDireccionCalle),
    empleoDireccionApto: emptyToNull(cb.empleoDireccionApto),
    empleoDireccionCiudad: emptyToNull(cb.empleoDireccionCiudad),
    empleoDireccionEstado: emptyToNull(cb.empleoDireccionEstado),
    empleoDireccionZip: emptyToNull(cb.empleoDireccionZip),
    empleoFechaIngreso: emptyToNull(cb.empleoFechaIngreso),
    empleoFechaSalida: emptyToNull(cb.empleoFechaSalida),
    empleoOtrosLugares: emptyToNull(cb.empleoOtrosLugares),
    inadDetencionTrafico: cb.inadDetencionTrafico || "no",
    inadCometidoDelito: cb.inadCometidoDelito || "no",
    inadInmunidadDiplomatica: cb.inadInmunidadDiplomatica || "no",
    inadProstitucionTrafico: cb.inadProstitucionTrafico || "no",
    inadAyudaIngresoIlegal: cb.inadAyudaIngresoIlegal || "no",
    inadTerrorismo: cb.inadTerrorismo || "no",
    inadFondosTerrorismo: cb.inadFondosTerrorismo || "no",
    inadAsociacionTerrorista: cb.inadAsociacionTerrorista || "no",
    inadEspionaje: cb.inadEspionaje || "no",
    inadPartidoComunista: cb.inadPartidoComunista || "no",
    inadParticipadoPersecucion: cb.inadParticipadoPersecucion || "no",
    inadProcedimientoRemocion: cb.inadProcedimientoRemocion || "no",
    inadDenegadoVisa: cb.inadDenegadoVisa || "no",
    inadVisaT: cb.inadVisaT || "no",
    inadMyUscis: cb.inadMyUscis || "no",
    inadGrupoMilitar: cb.inadGrupoMilitar || "no",
    inadFraudeMigratorio: cb.inadFraudeMigratorio || "no",
    inadTrastornoFisicoMental: cb.inadTrastornoFisicoMental || "no",
    inadEnfermedadPublica: cb.inadEnfermedadPublica || "no",
    inadAdictoDrogas: cb.inadAdictoDrogas || "no",
    declaradoCiudadano: emptyToNull(cb.declaradoCiudadano),
    falsaDeclaracionLugar: emptyToNull(cb.falsaDeclaracionLugar),
    falsaDeclaracionFecha: emptyToNull(cb.falsaDeclaracionFecha),
    falsaDeclaracionComo: emptyToNull(cb.falsaDeclaracionComo),
    falsaDeclaracionIntencion: emptyToNull(cb.falsaDeclaracionIntencion),
    falsaDeclaracionDetalle: emptyToNull(cb.falsaDeclaracionDetalle),
    foiaUscisSolicitar: foias.uscis.solicitar || "no",
    foiaUscisMotivo: emptyToNull(foias.uscis.motivo),
    foiaIceSolicitar: foias.ice.solicitar || "no",
    foiaIceMotivo: emptyToNull(foias.ice.motivo),
    foiaCbpSolicitar: foias.cbp.solicitar || "no",
    foiaCbpMotivo: emptyToNull(foias.cbp.motivo),
    foiaEoirSolicitar: foias.eoir.solicitar || "no",
    foiaEoirMotivo: emptyToNull(foias.eoir.motivo),
    foiaFbiSolicitar: foias.fbi.solicitar || "no",
    foiaFbiMotivo: emptyToNull(foias.fbi.motivo),
    foiaPoliciaSolicitar: foias.policia.solicitar || "no",
    foiaPoliciaMotivo: emptyToNull(foias.policia.motivo),
    documentosPendientes: emptyToNull(cb.documentosPendientes),
    correosPendientes: emptyToNull(cb.correosPendientes),
  };
}

function mapBioCallToCreateInput(
  bioCallId: string,
  data: BioCall
): Prisma.BioCallCreateInput {
  const pd = data.personalData;
  const addr = data.address;
  const doc = data.documents;
  const fam = data.family;
  const cb = data.caseBackground;

  return {
    id: bioCallId,
    personalData: {
      create: {
        nombres: pd.nombres.trim() || "Pendiente",
        apellidoPaterno: pd.apellidoPaterno.trim() || "Pendiente",
        apellidoMaterno: emptyToNull(pd.apellidoMaterno),
        otrosNombres: emptyToNull(pd.otrosNombres),
        fechaNacimiento: parseRequiredDate(pd.fechaNacimiento),
        ciudadNacimiento: emptyToNull(pd.ciudadNacimiento),
        estadoNacimiento: emptyToNull(pd.estadoNacimiento),
        paisNacimiento: emptyToNull(pd.paisNacimiento),
        sexo: emptyToNull(pd.sexo),
        estadoCivil: emptyToNull(pd.estadoCivil),
        nacionalidad: pd.nacionalidad.trim() || "Pendiente",
        comprendeIngles: emptyToNull(pd.comprendeIngles),
        idiomaPreferido: emptyToNull(pd.idiomaPreferido),
        hablaOtroIdioma: emptyToNull(pd.hablaOtroIdioma),
        especificarIdioma: emptyToNull(pd.especificarIdioma),
      },
    },
    contact: {
      create: {
        telefono: data.contact.telefono.trim() || "Pendiente",
        correoElectronico: data.contact.correoElectronico.trim() || "pendiente@ejemplo.com",
      },
    },
    address: {
      create: {
        calleNumero: addr.calleNumero.trim() || "Pendiente",
        aptoSuite: emptyToNull(addr.aptoSuite),
        ciudad: addr.ciudad.trim() || "Pendiente",
        estado: addr.estado.trim() || "Pendiente",
        codigoPostal: addr.codigoPostal.trim() || "00000",
        fechaIngreso: emptyToNull(addr.fechaIngreso),
        resididoOtrosLugares: emptyToNull(addr.resididoOtrosLugares),
      },
    },
    previousAddresses: {
      create: addr.direccionesAnteriores.map((item, index) => ({
        id: childId(bioCallId, "addr", index),
        sortOrder: index,
        calleNumero: emptyToNull(item.calleNumero),
        aptoSuite: emptyToNull(item.aptoSuite),
        ciudad: emptyToNull(item.ciudad),
        estado: emptyToNull(item.estado),
        codigoPostal: emptyToNull(item.codigoPostal),
        fechaDesde: emptyToNull(item.fechaDesde),
        fechaHasta: emptyToNull(item.fechaHasta),
      })),
    },
    documents: {
      create: {
        tienePasaporte: emptyToNull(doc.tienePasaporte),
        pasaportePendiente: emptyToNull(doc.pasaportePendiente),
        numeroPasaporte: emptyToNull(doc.numeroPasaporte),
        paisEmision: emptyToNull(doc.paisEmision),
        fechaEmision: parseOptionalDate(doc.fechaEmision),
        fechaExpiracion: parseOptionalDate(doc.fechaExpiracion),
        tieneANumber: emptyToNull(doc.tieneANumber),
        aNumberValue: emptyToNull(doc.aNumberValue),
        aNumberOrigen: emptyToNull(doc.aNumberOrigen),
        tieneSSN: emptyToNull(doc.tieneSSN),
        ssnValue: emptyToNull(doc.ssnValue),
        tieneEAD: emptyToNull(doc.tieneEAD),
        eadValue: emptyToNull(doc.eadValue),
      },
    },
    family: {
      create: {
        tieneConyuge: emptyToNull(fam.tieneConyuge),
        nombresConyuge: emptyToNull(fam.nombresConyuge),
        apellidoPaternoConyuge: emptyToNull(fam.apellidoPaternoConyuge),
        apellidoMaternoConyuge: emptyToNull(fam.apellidoMaternoConyuge),
        fechaLugarMatrimonioConyuge: emptyToNull(fam.fechaLugarMatrimonioConyuge),
        fechaLugarNacimientoConyuge: emptyToNull(fam.fechaLugarNacimientoConyuge),
        nombrePadre: emptyToNull(
          fullName(fam.nombresPadre, fam.apellidoPaternoPadre, fam.apellidoMaternoPadre)
        ),
        nombreMadre: emptyToNull(
          fullName(fam.nombresMadre, fam.apellidoPaternoMadre, fam.apellidoMaternoMadre)
        ),
        casado: emptyToNull(fam.casado),
        previamenteCasado: emptyToNull(fam.previamenteCasado),
        tieneHijos: emptyToNull(fam.tieneHijos),
      },
    },
    children: {
      create: fam.hijos.map((item, index) => ({
        id: childId(bioCallId, "child", index),
        sortOrder: index,
        nombre: emptyToNull(
          fullName(item.nombres, item.apellidoPaterno, item.apellidoMaterno)
        ),
        fechaNacimiento: emptyToNull(item.fechaNacimiento),
        lugarNacimiento: emptyToNull(item.lugarNacimiento),
        lugarResidencia: emptyToNull(item.lugarResidencia),
      })),
    },
    previousMarriages: {
      create: fam.matrimoniosPrevios.map((item, index) => ({
        id: childId(bioCallId, "marr", index),
        sortOrder: index,
        nombreExConyuge: emptyToNull(
          fullName(
            item.nombresExConyuge,
            item.apellidoPaternoExConyuge,
            item.apellidoMaternoExConyuge
          )
        ),
        fechaLugarMatrimonio: emptyToNull(item.fechaLugarMatrimonio),
        fechaLugarNacimiento: emptyToNull(item.fechaLugarNacimiento),
        fechaLugarDivorcio: emptyToNull(item.fechaLugarDivorcio),
      })),
    },
    caseBackground: {
      create: mapCaseBackground(cb),
    },
    trips: {
      create: cb.viajes.map((item, index) => ({
        id: childId(bioCallId, "trip", index),
        sortOrder: index,
        fechaEntrada: emptyToNull(item.fechaEntrada),
        formaEntrada: emptyToNull(item.formaEntrada),
        lugarEntrada: emptyToNull(item.lugarEntrada),
        fechaSalida: emptyToNull(item.fechaSalida),
        fueDetenido: emptyToNull(item.fueDetenido),
        detallesDetencion: emptyToNull(item.detallesDetencion),
      })),
    },
    immigrationDetentions: {
      create: cb.detencionesInmi.map((item, index) => ({
        id: childId(bioCallId, "det", index),
        sortOrder: index,
        lugar: emptyToNull(item.lugar),
        fecha: emptyToNull(item.fecha),
        autoridad: emptyToNull(item.autoridad),
        ordenDeportacion: emptyToNull(item.ordenDeportacion),
        sancionCastigo: emptyToNull(item.sancionCastigo),
        regresoVoluntario: emptyToNull(item.regresoVoluntario),
        fotosHuellas: emptyToNull(item.fotosHuellas),
        citaCorte: emptyToNull(item.citaCorte),
      })),
    },
    policeArrests: {
      create: cb.arrestosPolicia.map((item, index) => ({
        id: childId(bioCallId, "arr", index),
        sortOrder: index,
        paisCiudadEstado: emptyToNull(item.paisCiudadEstado),
        fecha: emptyToNull(item.fecha),
        motivo: emptyToNull(item.motivo),
        autoridad: emptyToNull(item.autoridad),
        disposicion: emptyToNull(item.disposicion),
      })),
    },
    previousEmployments: {
      create: cb.empleosAnteriores.map((item, index) => ({
        id: childId(bioCallId, "emp", index),
        sortOrder: index,
        empresa: emptyToNull(item.empresa),
        puesto: emptyToNull(item.puesto),
        direccionCalle: emptyToNull(item.direccionCalle),
        direccionApto: emptyToNull(item.direccionApto),
        direccionCiudad: emptyToNull(item.direccionCiudad),
        direccionEstado: emptyToNull(item.direccionEstado),
        direccionZip: emptyToNull(item.direccionZip),
        fechaDesde: emptyToNull(item.fechaDesde),
        fechaHasta: emptyToNull(item.fechaHasta),
      })),
    },
  };
}

async function replaceListChildren(bioCallId: string, data: BioCall): Promise<void> {
  await prisma.$transaction([
    prisma.bioCallPreviousAddress.deleteMany({ where: { bioCallId } }),
    prisma.bioCallChild.deleteMany({ where: { bioCallId } }),
    prisma.bioCallPreviousMarriage.deleteMany({ where: { bioCallId } }),
    prisma.bioCallTrip.deleteMany({ where: { bioCallId } }),
    prisma.bioCallImmigrationDetention.deleteMany({ where: { bioCallId } }),
    prisma.bioCallPoliceArrest.deleteMany({ where: { bioCallId } }),
    prisma.bioCallPreviousEmployment.deleteMany({ where: { bioCallId } }),
  ]);

  const addr = data.address;
  const fam = data.family;
  const cb = data.caseBackground;

  if (addr.direccionesAnteriores.length > 0) {
    await prisma.bioCallPreviousAddress.createMany({
      data: addr.direccionesAnteriores.map((item, index) => ({
        id: childId(bioCallId, "addr", index),
        bioCallId,
        sortOrder: index,
        calleNumero: emptyToNull(item.calleNumero),
        aptoSuite: emptyToNull(item.aptoSuite),
        ciudad: emptyToNull(item.ciudad),
        estado: emptyToNull(item.estado),
        codigoPostal: emptyToNull(item.codigoPostal),
        fechaDesde: emptyToNull(item.fechaDesde),
        fechaHasta: emptyToNull(item.fechaHasta),
      })),
    });
  }

  if (fam.hijos.length > 0) {
    await prisma.bioCallChild.createMany({
      data: fam.hijos.map((item, index) => ({
        id: childId(bioCallId, "child", index),
        bioCallId,
        sortOrder: index,
        nombre: emptyToNull(
          fullName(item.nombres, item.apellidoPaterno, item.apellidoMaterno)
        ),
        fechaNacimiento: emptyToNull(item.fechaNacimiento),
        lugarNacimiento: emptyToNull(item.lugarNacimiento),
        lugarResidencia: emptyToNull(item.lugarResidencia),
      })),
    });
  }

  if (fam.matrimoniosPrevios.length > 0) {
    await prisma.bioCallPreviousMarriage.createMany({
      data: fam.matrimoniosPrevios.map((item, index) => ({
        id: childId(bioCallId, "marr", index),
        bioCallId,
        sortOrder: index,
        nombreExConyuge: emptyToNull(
          fullName(
            item.nombresExConyuge,
            item.apellidoPaternoExConyuge,
            item.apellidoMaternoExConyuge
          )
        ),
        fechaLugarMatrimonio: emptyToNull(item.fechaLugarMatrimonio),
        fechaLugarNacimiento: emptyToNull(item.fechaLugarNacimiento),
        fechaLugarDivorcio: emptyToNull(item.fechaLugarDivorcio),
      })),
    });
  }

  if (cb.viajes.length > 0) {
    await prisma.bioCallTrip.createMany({
      data: cb.viajes.map((item, index) => ({
        id: childId(bioCallId, "trip", index),
        bioCallId,
        sortOrder: index,
        fechaEntrada: emptyToNull(item.fechaEntrada),
        formaEntrada: emptyToNull(item.formaEntrada),
        lugarEntrada: emptyToNull(item.lugarEntrada),
        fechaSalida: emptyToNull(item.fechaSalida),
        fueDetenido: emptyToNull(item.fueDetenido),
        detallesDetencion: emptyToNull(item.detallesDetencion),
      })),
    });
  }

  if (cb.detencionesInmi.length > 0) {
    await prisma.bioCallImmigrationDetention.createMany({
      data: cb.detencionesInmi.map((item, index) => ({
        id: childId(bioCallId, "det", index),
        bioCallId,
        sortOrder: index,
        lugar: emptyToNull(item.lugar),
        fecha: emptyToNull(item.fecha),
        autoridad: emptyToNull(item.autoridad),
        ordenDeportacion: emptyToNull(item.ordenDeportacion),
        sancionCastigo: emptyToNull(item.sancionCastigo),
        regresoVoluntario: emptyToNull(item.regresoVoluntario),
        fotosHuellas: emptyToNull(item.fotosHuellas),
        citaCorte: emptyToNull(item.citaCorte),
      })),
    });
  }

  if (cb.arrestosPolicia.length > 0) {
    await prisma.bioCallPoliceArrest.createMany({
      data: cb.arrestosPolicia.map((item, index) => ({
        id: childId(bioCallId, "arr", index),
        bioCallId,
        sortOrder: index,
        paisCiudadEstado: emptyToNull(item.paisCiudadEstado),
        fecha: emptyToNull(item.fecha),
        motivo: emptyToNull(item.motivo),
        autoridad: emptyToNull(item.autoridad),
        disposicion: emptyToNull(item.disposicion),
      })),
    });
  }

  if (cb.empleosAnteriores.length > 0) {
    await prisma.bioCallPreviousEmployment.createMany({
      data: cb.empleosAnteriores.map((item, index) => ({
        id: childId(bioCallId, "emp", index),
        bioCallId,
        sortOrder: index,
        empresa: emptyToNull(item.empresa),
        puesto: emptyToNull(item.puesto),
        direccionCalle: emptyToNull(item.direccionCalle),
        direccionApto: emptyToNull(item.direccionApto),
        direccionCiudad: emptyToNull(item.direccionCiudad),
        direccionEstado: emptyToNull(item.direccionEstado),
        direccionZip: emptyToNull(item.direccionZip),
        fechaDesde: emptyToNull(item.fechaDesde),
        fechaHasta: emptyToNull(item.fechaHasta),
      })),
    });
  }
}

export async function saveBioCall(
  data: BioCall,
  existingId?: string
): Promise<{ id: string }> {
  if (existingId) {
    const exists = await prisma.bioCall.findUnique({ where: { id: existingId } });
    if (!exists) {
      throw new Error(`Bio Call no encontrada: ${existingId}`);
    }

    const pd = data.personalData;
    const addr = data.address;
    const doc = data.documents;
    const fam = data.family;
    const cb = data.caseBackground;

    await prisma.$transaction([
      prisma.bioCallPersonalData.upsert({
        where: { bioCallId: existingId },
        create: {
          bioCallId: existingId,
          nombres: pd.nombres.trim() || "Pendiente",
          apellidoPaterno: pd.apellidoPaterno.trim() || "Pendiente",
          apellidoMaterno: emptyToNull(pd.apellidoMaterno),
          otrosNombres: emptyToNull(pd.otrosNombres),
          fechaNacimiento: parseRequiredDate(pd.fechaNacimiento),
          ciudadNacimiento: emptyToNull(pd.ciudadNacimiento),
          estadoNacimiento: emptyToNull(pd.estadoNacimiento),
          paisNacimiento: emptyToNull(pd.paisNacimiento),
          sexo: emptyToNull(pd.sexo),
          estadoCivil: emptyToNull(pd.estadoCivil),
          nacionalidad: pd.nacionalidad.trim() || "Pendiente",
          comprendeIngles: emptyToNull(pd.comprendeIngles),
          idiomaPreferido: emptyToNull(pd.idiomaPreferido),
          hablaOtroIdioma: emptyToNull(pd.hablaOtroIdioma),
          especificarIdioma: emptyToNull(pd.especificarIdioma),
        },
        update: {
          nombres: pd.nombres.trim() || "Pendiente",
          apellidoPaterno: pd.apellidoPaterno.trim() || "Pendiente",
          apellidoMaterno: emptyToNull(pd.apellidoMaterno),
          otrosNombres: emptyToNull(pd.otrosNombres),
          fechaNacimiento: parseRequiredDate(pd.fechaNacimiento),
          ciudadNacimiento: emptyToNull(pd.ciudadNacimiento),
          estadoNacimiento: emptyToNull(pd.estadoNacimiento),
          paisNacimiento: emptyToNull(pd.paisNacimiento),
          sexo: emptyToNull(pd.sexo),
          estadoCivil: emptyToNull(pd.estadoCivil),
          nacionalidad: pd.nacionalidad.trim() || "Pendiente",
          comprendeIngles: emptyToNull(pd.comprendeIngles),
          idiomaPreferido: emptyToNull(pd.idiomaPreferido),
          hablaOtroIdioma: emptyToNull(pd.hablaOtroIdioma),
          especificarIdioma: emptyToNull(pd.especificarIdioma),
        },
      }),
      prisma.bioCallContact.upsert({
        where: { bioCallId: existingId },
        create: {
          bioCallId: existingId,
          telefono: data.contact.telefono.trim() || "Pendiente",
          correoElectronico: data.contact.correoElectronico.trim() || "pendiente@ejemplo.com",
        },
        update: {
          telefono: data.contact.telefono.trim() || "Pendiente",
          correoElectronico: data.contact.correoElectronico.trim() || "pendiente@ejemplo.com",
        },
      }),
      prisma.bioCallAddress.upsert({
        where: { bioCallId: existingId },
        create: {
          bioCallId: existingId,
          calleNumero: addr.calleNumero.trim() || "Pendiente",
          aptoSuite: emptyToNull(addr.aptoSuite),
          ciudad: addr.ciudad.trim() || "Pendiente",
          estado: addr.estado.trim() || "Pendiente",
          codigoPostal: addr.codigoPostal.trim() || "00000",
          fechaIngreso: emptyToNull(addr.fechaIngreso),
          resididoOtrosLugares: emptyToNull(addr.resididoOtrosLugares),
        },
        update: {
          calleNumero: addr.calleNumero.trim() || "Pendiente",
          aptoSuite: emptyToNull(addr.aptoSuite),
          ciudad: addr.ciudad.trim() || "Pendiente",
          estado: addr.estado.trim() || "Pendiente",
          codigoPostal: addr.codigoPostal.trim() || "00000",
          fechaIngreso: emptyToNull(addr.fechaIngreso),
          resididoOtrosLugares: emptyToNull(addr.resididoOtrosLugares),
        },
      }),
      prisma.bioCallDocuments.upsert({
        where: { bioCallId: existingId },
        create: {
          bioCallId: existingId,
          tienePasaporte: emptyToNull(doc.tienePasaporte),
          pasaportePendiente: emptyToNull(doc.pasaportePendiente),
          numeroPasaporte: emptyToNull(doc.numeroPasaporte),
          paisEmision: emptyToNull(doc.paisEmision),
          fechaEmision: parseOptionalDate(doc.fechaEmision),
          fechaExpiracion: parseOptionalDate(doc.fechaExpiracion),
          tieneANumber: emptyToNull(doc.tieneANumber),
          aNumberValue: emptyToNull(doc.aNumberValue),
          aNumberOrigen: emptyToNull(doc.aNumberOrigen),
          tieneSSN: emptyToNull(doc.tieneSSN),
          ssnValue: emptyToNull(doc.ssnValue),
          tieneEAD: emptyToNull(doc.tieneEAD),
          eadValue: emptyToNull(doc.eadValue),
        },
        update: {
          tienePasaporte: emptyToNull(doc.tienePasaporte),
          pasaportePendiente: emptyToNull(doc.pasaportePendiente),
          numeroPasaporte: emptyToNull(doc.numeroPasaporte),
          paisEmision: emptyToNull(doc.paisEmision),
          fechaEmision: parseOptionalDate(doc.fechaEmision),
          fechaExpiracion: parseOptionalDate(doc.fechaExpiracion),
          tieneANumber: emptyToNull(doc.tieneANumber),
          aNumberValue: emptyToNull(doc.aNumberValue),
          aNumberOrigen: emptyToNull(doc.aNumberOrigen),
          tieneSSN: emptyToNull(doc.tieneSSN),
          ssnValue: emptyToNull(doc.ssnValue),
          tieneEAD: emptyToNull(doc.tieneEAD),
          eadValue: emptyToNull(doc.eadValue),
        },
      }),
      prisma.bioCallFamily.upsert({
        where: { bioCallId: existingId },
        create: {
          bioCallId: existingId,
          tieneConyuge: emptyToNull(fam.tieneConyuge),
          nombresConyuge: emptyToNull(fam.nombresConyuge),
          apellidoPaternoConyuge: emptyToNull(fam.apellidoPaternoConyuge),
          apellidoMaternoConyuge: emptyToNull(fam.apellidoMaternoConyuge),
          fechaLugarMatrimonioConyuge: emptyToNull(fam.fechaLugarMatrimonioConyuge),
          fechaLugarNacimientoConyuge: emptyToNull(fam.fechaLugarNacimientoConyuge),
          nombrePadre: emptyToNull(
            fullName(fam.nombresPadre, fam.apellidoPaternoPadre, fam.apellidoMaternoPadre)
          ),
          nombreMadre: emptyToNull(
            fullName(fam.nombresMadre, fam.apellidoPaternoMadre, fam.apellidoMaternoMadre)
          ),
          casado: emptyToNull(fam.casado),
          previamenteCasado: emptyToNull(fam.previamenteCasado),
          tieneHijos: emptyToNull(fam.tieneHijos),
        },
        update: {
          tieneConyuge: emptyToNull(fam.tieneConyuge),
          nombresConyuge: emptyToNull(fam.nombresConyuge),
          apellidoPaternoConyuge: emptyToNull(fam.apellidoPaternoConyuge),
          apellidoMaternoConyuge: emptyToNull(fam.apellidoMaternoConyuge),
          fechaLugarMatrimonioConyuge: emptyToNull(fam.fechaLugarMatrimonioConyuge),
          fechaLugarNacimientoConyuge: emptyToNull(fam.fechaLugarNacimientoConyuge),
          nombrePadre: emptyToNull(
            fullName(fam.nombresPadre, fam.apellidoPaternoPadre, fam.apellidoMaternoPadre)
          ),
          nombreMadre: emptyToNull(
            fullName(fam.nombresMadre, fam.apellidoPaternoMadre, fam.apellidoMaternoMadre)
          ),
          casado: emptyToNull(fam.casado),
          previamenteCasado: emptyToNull(fam.previamenteCasado),
          tieneHijos: emptyToNull(fam.tieneHijos),
        },
      }),
      prisma.bioCallCaseBackground.upsert({
        where: { bioCallId: existingId },
        create: { bioCallId: existingId, ...mapCaseBackground(cb) },
        update: mapCaseBackground(cb),
      }),
    ]);

    await replaceListChildren(existingId, data);
    return { id: existingId };
  }

  const bioCallId = crypto.randomUUID();
  await prisma.bioCall.create({
    data: mapBioCallToCreateInput(bioCallId, data),
  });
  return { id: bioCallId };
}

export async function recordGeneratedPdf(params: {
  bioCallId: string;
  storagePath: string;
  templateVersion: string;
  fileSizeBytes: number;
}): Promise<{ id: string; generatedAt: Date }> {
  const pdfId = crypto.randomUUID();

  await prisma.$transaction([
    prisma.bioCallGeneratedPdf.updateMany({
      where: { bioCallId: params.bioCallId, isCurrent: true },
      data: { isCurrent: false },
    }),
    prisma.bioCallGeneratedPdf.create({
      data: {
        id: pdfId,
        bioCallId: params.bioCallId,
        storagePath: params.storagePath,
        templateVersion: params.templateVersion,
        fileSizeBytes: params.fileSizeBytes,
        isCurrent: true,
      },
    }),
  ]);

  const record = await prisma.bioCallGeneratedPdf.findUniqueOrThrow({
    where: { id: pdfId },
  });
  return { id: pdfId, generatedAt: record.generatedAt };
}

export async function getCurrentPdfRecord(bioCallId: string) {
  return prisma.bioCallGeneratedPdf.findFirst({
    where: { bioCallId, isCurrent: true },
    orderBy: { generatedAt: "desc" },
  });
}
