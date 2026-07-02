import type { Prisma } from "@prisma/client";
import type { BioCall } from "@biocall/shared";
import { prisma } from "./client";

export class SaveBioCallValidationError extends Error {
  readonly fieldPath: string;

  constructor(fieldPath: string, message: string) {
    super(message);
    this.name = "SaveBioCallValidationError";
    this.fieldPath = fieldPath;
  }
}

function emptyToNull(value: string | undefined | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function requireTrimmed(value: string, fieldPath: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new SaveBioCallValidationError(fieldPath, "Este campo es obligatorio.");
  }
  return trimmed;
}

function parseOptionalDate(value: string, fieldPath: string): Date | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    throw new SaveBioCallValidationError(fieldPath, `Fecha invalida: ${value}`);
  }
  return parsed;
}

function parseRequiredDate(value: string, fieldPath: string): Date {
  const parsed = parseOptionalDate(value, fieldPath);
  if (!parsed) {
    throw new SaveBioCallValidationError(fieldPath, "La fecha es obligatoria.");
  }
  return parsed;
}

function yesNoOrDefault(value: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "no";
}

function childId(bioCallId: string, prefix: string, index: number): string {
  return `${bioCallId}_${prefix}_${index}`;
}

function mapParentFields(fam: BioCall["family"]) {
  return {
    nombresPadre: emptyToNull(fam.nombresPadre),
    segundoNombrePadre: emptyToNull(fam.segundoNombrePadre),
    apellidoPaternoPadre: emptyToNull(fam.apellidoPaternoPadre),
    apellidoMaternoPadre: emptyToNull(fam.apellidoMaternoPadre),
    nombresMadre: emptyToNull(fam.nombresMadre),
    segundoNombreMadre: emptyToNull(fam.segundoNombreMadre),
    apellidoPaternoMadre: emptyToNull(fam.apellidoPaternoMadre),
    apellidoMaternoMadre: emptyToNull(fam.apellidoMaternoMadre),
  };
}

function mapChildFields(item: BioCall["family"]["hijos"][number]) {
  return {
    nombres: emptyToNull(item.nombres),
    segundoNombre: emptyToNull(item.segundoNombre),
    apellidoPaterno: emptyToNull(item.apellidoPaterno),
    apellidoMaterno: emptyToNull(item.apellidoMaterno),
    fechaNacimiento: emptyToNull(item.fechaNacimiento),
    lugarNacimiento: emptyToNull(item.lugarNacimiento),
    lugarResidencia: emptyToNull(item.lugarResidencia),
  };
}

function mapPreviousMarriageFields(item: BioCall["family"]["matrimoniosPrevios"][number]) {
  return {
    nombresExConyuge: emptyToNull(item.nombresExConyuge),
    segundoNombreExConyuge: emptyToNull(item.segundoNombreExConyuge),
    apellidoPaternoExConyuge: emptyToNull(item.apellidoPaternoExConyuge),
    apellidoMaternoExConyuge: emptyToNull(item.apellidoMaternoExConyuge),
    fechaLugarMatrimonio: emptyToNull(item.fechaLugarMatrimonio),
    fechaLugarNacimiento: emptyToNull(item.fechaLugarNacimiento),
    fechaLugarDivorcio: emptyToNull(item.fechaLugarDivorcio),
  };
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
    empleoDireccionPais: emptyToNull(cb.empleoDireccionPais),
    empleoFechaIngreso: emptyToNull(cb.empleoFechaIngreso),
    empleoFechaSalida: emptyToNull(cb.empleoFechaSalida),
    empleoOtrosLugares: emptyToNull(cb.empleoOtrosLugares),
    inadDetencionTrafico: yesNoOrDefault(cb.inadDetencionTrafico),
    inadCometidoDelito: yesNoOrDefault(cb.inadCometidoDelito),
    inadInmunidadDiplomatica: yesNoOrDefault(cb.inadInmunidadDiplomatica),
    inadProstitucionTrafico: yesNoOrDefault(cb.inadProstitucionTrafico),
    inadAyudaIngresoIlegal: yesNoOrDefault(cb.inadAyudaIngresoIlegal),
    inadTerrorismo: yesNoOrDefault(cb.inadTerrorismo),
    inadFondosTerrorismo: yesNoOrDefault(cb.inadFondosTerrorismo),
    inadAsociacionTerrorista: yesNoOrDefault(cb.inadAsociacionTerrorista),
    inadEspionaje: yesNoOrDefault(cb.inadEspionaje),
    inadPartidoComunista: yesNoOrDefault(cb.inadPartidoComunista),
    inadParticipadoPersecucion: yesNoOrDefault(cb.inadParticipadoPersecucion),
    inadProcedimientoRemocion: yesNoOrDefault(cb.inadProcedimientoRemocion),
    inadDenegadoVisa: yesNoOrDefault(cb.inadDenegadoVisa),
    inadVisaT: yesNoOrDefault(cb.inadVisaT),
    inadMyUscis: yesNoOrDefault(cb.inadMyUscis),
    inadMyUscisDetalle: emptyToNull(cb.inadMyUscisDetalle),
    inadGrupoMilitar: yesNoOrDefault(cb.inadGrupoMilitar),
    inadFraudeMigratorio: yesNoOrDefault(cb.inadFraudeMigratorio),
    inadTrastornoFisicoMental: yesNoOrDefault(cb.inadTrastornoFisicoMental),
    inadEnfermedadPublica: yesNoOrDefault(cb.inadEnfermedadPublica),
    inadAdictoDrogas: yesNoOrDefault(cb.inadAdictoDrogas),
    declaradoCiudadano: emptyToNull(cb.declaradoCiudadano),
    falsaDeclaracionLugar: emptyToNull(cb.falsaDeclaracionLugar),
    falsaDeclaracionFecha: emptyToNull(cb.falsaDeclaracionFecha),
    falsaDeclaracionComo: emptyToNull(cb.falsaDeclaracionComo),
    falsaDeclaracionIntencion: emptyToNull(cb.falsaDeclaracionIntencion),
    falsaDeclaracionDetalle: emptyToNull(cb.falsaDeclaracionDetalle),
    foiaUscisSolicitar: yesNoOrDefault(foias.uscis.solicitar),
    foiaUscisMotivo: emptyToNull(foias.uscis.motivo),
    foiaIceSolicitar: yesNoOrDefault(foias.ice.solicitar),
    foiaIceMotivo: emptyToNull(foias.ice.motivo),
    foiaCbpSolicitar: yesNoOrDefault(foias.cbp.solicitar),
    foiaCbpMotivo: emptyToNull(foias.cbp.motivo),
    foiaEoirSolicitar: yesNoOrDefault(foias.eoir.solicitar),
    foiaEoirMotivo: emptyToNull(foias.eoir.motivo),
    foiaFbiSolicitar: yesNoOrDefault(foias.fbi.solicitar),
    foiaFbiMotivo: emptyToNull(foias.fbi.motivo),
    foiaPoliciaSolicitar: yesNoOrDefault(foias.policia.solicitar),
    foiaPoliciaMotivo: emptyToNull(foias.policia.motivo),
    documentosPendientes: emptyToNull(cb.documentosPendientes),
    correosPendientes: emptyToNull(cb.correosPendientes),
  };
}

function mapPersonalDataFields(pd: BioCall["personalData"]) {
  return {
    nombres: requireTrimmed(pd.nombres, "personalData.nombres"),
    segundoNombre: emptyToNull(pd.segundoNombre),
    apellidoPaterno: requireTrimmed(pd.apellidoPaterno, "personalData.apellidoPaterno"),
    apellidoMaterno: emptyToNull(pd.apellidoMaterno),
    otrosNombres: emptyToNull(pd.otrosNombres),
    fechaNacimiento: parseRequiredDate(pd.fechaNacimiento, "personalData.fechaNacimiento"),
    ciudadNacimiento: emptyToNull(pd.ciudadNacimiento),
    estadoNacimiento: emptyToNull(pd.estadoNacimiento),
    paisNacimiento: emptyToNull(pd.paisNacimiento),
    sexo: emptyToNull(pd.sexo),
    estadoCivil: emptyToNull(pd.estadoCivil),
    nacionalidad: requireTrimmed(pd.nacionalidad, "personalData.nacionalidad"),
    comprendeIngles: emptyToNull(pd.comprendeIngles),
    idiomaPreferido: emptyToNull(pd.idiomaPreferido),
    hablaOtroIdioma: emptyToNull(pd.hablaOtroIdioma),
    especificarIdioma: emptyToNull(pd.especificarIdioma),
  };
}

function mapContactFields(contact: BioCall["contact"]) {
  return {
    telefono: requireTrimmed(contact.telefono, "contact.telefono"),
    correoElectronico: requireTrimmed(contact.correoElectronico, "contact.correoElectronico"),
  };
}

function mapAddressFields(addr: BioCall["address"]) {
  return {
    calleNumero: requireTrimmed(addr.calleNumero, "address.calleNumero"),
    aptoSuite: emptyToNull(addr.aptoSuite),
    ciudad: requireTrimmed(addr.ciudad, "address.ciudad"),
    estado: requireTrimmed(addr.estado, "address.estado"),
    codigoPostal: requireTrimmed(addr.codigoPostal, "address.codigoPostal"),
    pais: emptyToNull(addr.pais),
    fechaIngreso: emptyToNull(addr.fechaIngreso),
    resididoOtrosLugares: emptyToNull(addr.resididoOtrosLugares),
  };
}

function mapDocumentsFields(doc: BioCall["documents"]) {
  return {
    tienePasaporte: emptyToNull(doc.tienePasaporte),
    pasaportePendiente: emptyToNull(doc.pasaportePendiente),
    numeroPasaporte: emptyToNull(doc.numeroPasaporte),
    paisEmision: emptyToNull(doc.paisEmision),
    fechaEmision: parseOptionalDate(doc.fechaEmision, "documents.fechaEmision"),
    fechaExpiracion: parseOptionalDate(doc.fechaExpiracion, "documents.fechaExpiracion"),
    tieneANumber: emptyToNull(doc.tieneANumber),
    aNumberValue: emptyToNull(doc.aNumberValue),
    aNumberOrigen: emptyToNull(doc.aNumberOrigen),
    tieneSSN: emptyToNull(doc.tieneSSN),
    ssnValue: emptyToNull(doc.ssnValue),
    tieneEAD: emptyToNull(doc.tieneEAD),
    eadValue: emptyToNull(doc.eadValue),
  };
}

async function touchBioCallRoot(bioCallId: string): Promise<void> {
  await prisma.bioCall.update({
    where: { id: bioCallId },
    data: { updatedAt: new Date() },
  });
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
      create: mapPersonalDataFields(pd),
    },
    contact: {
      create: mapContactFields(data.contact),
    },
    address: {
      create: mapAddressFields(addr),
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
        pais: emptyToNull(item.pais),
        fechaDesde: emptyToNull(item.fechaDesde),
        fechaHasta: emptyToNull(item.fechaHasta),
      })),
    },
    documents: {
      create: mapDocumentsFields(doc),
    },
    family: {
      create: {
        tieneConyuge: emptyToNull(fam.tieneConyuge),
        nombresConyuge: emptyToNull(fam.nombresConyuge),
        segundoNombreConyuge: emptyToNull(fam.segundoNombreConyuge),
        apellidoPaternoConyuge: emptyToNull(fam.apellidoPaternoConyuge),
        apellidoMaternoConyuge: emptyToNull(fam.apellidoMaternoConyuge),
        fechaMatrimonioConyuge: emptyToNull(fam.fechaMatrimonioConyuge),
        lugarMatrimonioConyuge: emptyToNull(fam.lugarMatrimonioConyuge),
        fechaNacimientoConyuge: emptyToNull(fam.fechaNacimientoConyuge),
        lugarNacimientoConyuge: emptyToNull(fam.lugarNacimientoConyuge),
        ...mapParentFields(fam),
        casado: emptyToNull(fam.casado),
        previamenteCasado: emptyToNull(fam.previamenteCasado),
        tieneHijos: emptyToNull(fam.tieneHijos),
      },
    },
    children: {
      create: fam.hijos.map((item, index) => ({
        id: childId(bioCallId, "child", index),
        sortOrder: index,
        ...mapChildFields(item),
      })),
    },
    previousMarriages: {
      create: fam.matrimoniosPrevios.map((item, index) => ({
        id: childId(bioCallId, "marr", index),
        sortOrder: index,
        ...mapPreviousMarriageFields(item),
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
        direccionPais: emptyToNull(item.direccionPais),
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
        pais: emptyToNull(item.pais),
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
        ...mapChildFields(item),
      })),
    });
  }

  if (fam.matrimoniosPrevios.length > 0) {
    await prisma.bioCallPreviousMarriage.createMany({
      data: fam.matrimoniosPrevios.map((item, index) => ({
        id: childId(bioCallId, "marr", index),
        bioCallId,
        sortOrder: index,
        ...mapPreviousMarriageFields(item),
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
        direccionPais: emptyToNull(item.direccionPais),
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
    const personalFields = mapPersonalDataFields(pd);
    const contactFields = mapContactFields(data.contact);
    const addressFields = mapAddressFields(addr);
    const documentFields = mapDocumentsFields(doc);

    await prisma.$transaction([
      prisma.bioCallPersonalData.upsert({
        where: { bioCallId: existingId },
        create: { bioCallId: existingId, ...personalFields },
        update: personalFields,
      }),
      prisma.bioCallContact.upsert({
        where: { bioCallId: existingId },
        create: { bioCallId: existingId, ...contactFields },
        update: contactFields,
      }),
      prisma.bioCallAddress.upsert({
        where: { bioCallId: existingId },
        create: { bioCallId: existingId, ...addressFields },
        update: addressFields,
      }),
      prisma.bioCallDocuments.upsert({
        where: { bioCallId: existingId },
        create: { bioCallId: existingId, ...documentFields },
        update: documentFields,
      }),
      prisma.bioCallFamily.upsert({
        where: { bioCallId: existingId },
        create: {
          bioCallId: existingId,
          tieneConyuge: emptyToNull(fam.tieneConyuge),
          nombresConyuge: emptyToNull(fam.nombresConyuge),
          segundoNombreConyuge: emptyToNull(fam.segundoNombreConyuge),
          apellidoPaternoConyuge: emptyToNull(fam.apellidoPaternoConyuge),
          apellidoMaternoConyuge: emptyToNull(fam.apellidoMaternoConyuge),
          fechaMatrimonioConyuge: emptyToNull(fam.fechaMatrimonioConyuge),
          lugarMatrimonioConyuge: emptyToNull(fam.lugarMatrimonioConyuge),
          fechaNacimientoConyuge: emptyToNull(fam.fechaNacimientoConyuge),
          lugarNacimientoConyuge: emptyToNull(fam.lugarNacimientoConyuge),
          ...mapParentFields(fam),
          casado: emptyToNull(fam.casado),
          previamenteCasado: emptyToNull(fam.previamenteCasado),
          tieneHijos: emptyToNull(fam.tieneHijos),
        },
        update: {
          tieneConyuge: emptyToNull(fam.tieneConyuge),
          nombresConyuge: emptyToNull(fam.nombresConyuge),
          segundoNombreConyuge: emptyToNull(fam.segundoNombreConyuge),
          apellidoPaternoConyuge: emptyToNull(fam.apellidoPaternoConyuge),
          apellidoMaternoConyuge: emptyToNull(fam.apellidoMaternoConyuge),
          fechaMatrimonioConyuge: emptyToNull(fam.fechaMatrimonioConyuge),
          lugarMatrimonioConyuge: emptyToNull(fam.lugarMatrimonioConyuge),
          fechaNacimientoConyuge: emptyToNull(fam.fechaNacimientoConyuge),
          lugarNacimientoConyuge: emptyToNull(fam.lugarNacimientoConyuge),
          ...mapParentFields(fam),
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
    await touchBioCallRoot(existingId);
    return { id: existingId };
  }

  const bioCallId = crypto.randomUUID();
  await prisma.bioCall.create({
    data: mapBioCallToCreateInput(bioCallId, data),
  });
  await touchBioCallRoot(bioCallId);
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
