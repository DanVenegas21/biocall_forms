import PDFDocument from "pdfkit";
import type { BioCall } from "@biocall/shared";
import {
  BIO_CALL_SECTIONS,
  getArrayFieldQuestion,
  getArrayItemBlockLabel,
  getFieldQuestion,
} from "@biocall/shared";
import { existsSync } from "node:fs";
import { renderInadmissibilitySection } from "./inadmissibilityTable";

export const BIO_CALL_PDF_TEMPLATE_VERSION = "v2.0";

export interface GenerateBioCallPdfOptions {
  logoPath?: string;
  generatedAt?: Date;
}

type PdfDoc = InstanceType<typeof PDFDocument>;

function display(value: string | undefined | null): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

function sectionTitle(doc: PdfDoc, title: string): void {
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#1e3a5f").text(title);
  doc.moveDown(0.25);
  doc.font("Helvetica").fontSize(10).fillColor("#000000");
}

function fieldLine(doc: PdfDoc, label: string, value: string): void {
  doc.font("Helvetica-Bold").text(`${label}: `, { continued: true, lineGap: 2 });
  doc.font("Helvetica").text(display(value), { lineGap: 2 });
}

function questionField(doc: PdfDoc, path: string, value: string): void {
  fieldLine(doc, getFieldQuestion(path), value);
}

function blockDivider(doc: PdfDoc, label: string): void {
  doc.moveDown(0.35);
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#5c6b7a")
    .text(`— ${label} —`, { lineGap: 1 });
  doc.fontSize(10).fillColor("#000000");
  doc.moveDown(0.15);
}

type ArrayField = {
  field: string;
  value: string;
};

function numberedBlock(
  doc: PdfDoc,
  arrayKey: string,
  index: number,
  fields: ArrayField[]
): void {
  ensureSpace(doc);
  blockDivider(doc, getArrayItemBlockLabel(arrayKey, index));
  for (const { field, value } of fields) {
    fieldLine(doc, getArrayFieldQuestion(arrayKey, field, index), value);
  }
}

function ensureSpace(doc: PdfDoc, minHeight = 60): void {
  if (doc.y > doc.page.height - doc.page.margins.bottom - minHeight) {
    doc.addPage();
  }
}

const FOIA_AGENCIES = ["uscis", "ice", "cbp", "eoir", "fbi", "policia"] as const;

export function generateBioCallPdf(
  data: BioCall,
  options: GenerateBioCallPdfOptions = {}
): Promise<Buffer> {
  const generatedAt = options.generatedAt ?? new Date();
  const pd = data.personalData;
  const clientName = [pd.nombres, pd.segundoNombre, pd.apellidoPaterno, pd.apellidoMaterno]
    .filter((part) => part?.trim())
    .join(" ");

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "LETTER" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    if (options.logoPath && existsSync(options.logoPath)) {
      doc.image(options.logoPath, 50, 45, { width: 120 });
      doc.y = 120;
    } else {
      doc.y = 50;
    }

    doc.font("Helvetica-Bold").fontSize(20).text("Bio Call", { align: "center" });
    doc.moveDown(0.25);
    doc.font("Helvetica").fontSize(11).text(`Oficina Manuel Solis`, { align: "center" });
    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").fontSize(14).text(display(clientName), { align: "center" });
    doc.font("Helvetica").fontSize(9).fillColor("#555555").text(
      `Generado: ${generatedAt.toLocaleString("es-MX")} · Plantilla ${BIO_CALL_PDF_TEMPLATE_VERSION}`,
      { align: "center" }
    );
    doc.fillColor("#000000");
    doc.addPage();

    sectionTitle(doc, BIO_CALL_SECTIONS[0].title);
    questionField(doc, "personalData.nombres", pd.nombres);
    questionField(doc, "personalData.segundoNombre", pd.segundoNombre);
    questionField(doc, "personalData.apellidoPaterno", pd.apellidoPaterno);
    questionField(doc, "personalData.apellidoMaterno", pd.apellidoMaterno);
    questionField(doc, "personalData.otrosNombres", pd.otrosNombres);
    questionField(doc, "personalData.fechaNacimiento", pd.fechaNacimiento);
    questionField(doc, "personalData.ciudadNacimiento", pd.ciudadNacimiento);
    questionField(doc, "personalData.estadoNacimiento", pd.estadoNacimiento);
    questionField(doc, "personalData.paisNacimiento", pd.paisNacimiento);
    questionField(doc, "personalData.sexo", pd.sexo);
    questionField(doc, "personalData.estadoCivil", pd.estadoCivil);
    questionField(doc, "personalData.nacionalidad", pd.nacionalidad);
    questionField(doc, "personalData.comprendeIngles", pd.comprendeIngles);
    questionField(doc, "personalData.idiomaPreferido", pd.idiomaPreferido);
    questionField(doc, "personalData.hablaOtroIdioma", pd.hablaOtroIdioma);
    questionField(doc, "personalData.especificarIdioma", pd.especificarIdioma);

    sectionTitle(doc, BIO_CALL_SECTIONS[1].title);
    questionField(doc, "contact.telefono", data.contact.telefono);
    questionField(doc, "contact.correoElectronico", data.contact.correoElectronico);

    sectionTitle(doc, BIO_CALL_SECTIONS[2].title);
    const addr = data.address;
    questionField(doc, "address.calleNumero", addr.calleNumero);
    questionField(doc, "address.aptoSuite", addr.aptoSuite);
    questionField(doc, "address.ciudad", addr.ciudad);
    questionField(doc, "address.estado", addr.estado);
    questionField(doc, "address.codigoPostal", addr.codigoPostal);
    questionField(doc, "address.pais", addr.pais);
    questionField(doc, "address.fechaIngreso", addr.fechaIngreso);
    questionField(doc, "address.resididoOtrosLugares", addr.resididoOtrosLugares);
    addr.direccionesAnteriores.forEach((item, index) => {
      numberedBlock(doc, "direccionesAnteriores", index, [
        { field: "calleNumero", value: item.calleNumero },
        { field: "aptoSuite", value: item.aptoSuite },
        { field: "ciudad", value: item.ciudad },
        { field: "estado", value: item.estado },
        { field: "codigoPostal", value: item.codigoPostal },
        { field: "pais", value: item.pais },
        { field: "fechaDesde", value: item.fechaDesde },
        { field: "fechaHasta", value: item.fechaHasta },
      ]);
    });

    ensureSpace(doc, 120);
    sectionTitle(doc, BIO_CALL_SECTIONS[3].title);
    const docu = data.documents;
    questionField(doc, "documents.tienePasaporte", docu.tienePasaporte);
    questionField(doc, "documents.pasaportePendiente", docu.pasaportePendiente);
    questionField(doc, "documents.numeroPasaporte", docu.numeroPasaporte);
    questionField(doc, "documents.paisEmision", docu.paisEmision);
    questionField(doc, "documents.fechaEmision", docu.fechaEmision);
    questionField(doc, "documents.fechaExpiracion", docu.fechaExpiracion);
    questionField(doc, "documents.tieneANumber", docu.tieneANumber);
    questionField(doc, "documents.aNumberValue", docu.aNumberValue);
    questionField(doc, "documents.aNumberOrigen", docu.aNumberOrigen);
    questionField(doc, "documents.tieneSSN", docu.tieneSSN);
    questionField(doc, "documents.ssnValue", docu.ssnValue);
    questionField(doc, "documents.tieneEAD", docu.tieneEAD);
    questionField(doc, "documents.eadValue", docu.eadValue);

    ensureSpace(doc, 120);
    sectionTitle(doc, BIO_CALL_SECTIONS[4].title);
    const fam = data.family;
    questionField(doc, "family.nombresPadre", fam.nombresPadre);
    questionField(doc, "family.segundoNombrePadre", fam.segundoNombrePadre);
    questionField(doc, "family.apellidoPaternoPadre", fam.apellidoPaternoPadre);
    questionField(doc, "family.apellidoMaternoPadre", fam.apellidoMaternoPadre);
    questionField(doc, "family.nombresMadre", fam.nombresMadre);
    questionField(doc, "family.segundoNombreMadre", fam.segundoNombreMadre);
    questionField(doc, "family.apellidoPaternoMadre", fam.apellidoPaternoMadre);
    questionField(doc, "family.apellidoMaternoMadre", fam.apellidoMaternoMadre);
    questionField(doc, "family.tieneConyuge", fam.tieneConyuge);
    questionField(doc, "family.nombresConyuge", fam.nombresConyuge);
    questionField(doc, "family.segundoNombreConyuge", fam.segundoNombreConyuge);
    questionField(doc, "family.apellidoPaternoConyuge", fam.apellidoPaternoConyuge);
    questionField(doc, "family.apellidoMaternoConyuge", fam.apellidoMaternoConyuge);
    questionField(doc, "family.fechaLugarMatrimonioConyuge", fam.fechaLugarMatrimonioConyuge);
    questionField(doc, "family.fechaLugarNacimientoConyuge", fam.fechaLugarNacimientoConyuge);
    questionField(doc, "family.casado", fam.casado);
    questionField(doc, "family.previamenteCasado", fam.previamenteCasado);
    questionField(doc, "family.tieneHijos", fam.tieneHijos);
    fam.matrimoniosPrevios.forEach((item, index) => {
      numberedBlock(doc, "matrimoniosPrevios", index, [
        { field: "nombresExConyuge", value: item.nombresExConyuge },
        { field: "segundoNombreExConyuge", value: item.segundoNombreExConyuge },
        { field: "apellidoPaternoExConyuge", value: item.apellidoPaternoExConyuge },
        { field: "apellidoMaternoExConyuge", value: item.apellidoMaternoExConyuge },
        { field: "fechaLugarMatrimonio", value: item.fechaLugarMatrimonio },
        { field: "fechaLugarNacimiento", value: item.fechaLugarNacimiento },
        { field: "fechaLugarDivorcio", value: item.fechaLugarDivorcio },
      ]);
    });
    fam.hijos.forEach((item, index) => {
      numberedBlock(doc, "hijos", index, [
        { field: "nombres", value: item.nombres },
        { field: "segundoNombre", value: item.segundoNombre },
        { field: "apellidoPaterno", value: item.apellidoPaterno },
        { field: "apellidoMaterno", value: item.apellidoMaterno },
        { field: "fechaNacimiento", value: item.fechaNacimiento },
        { field: "lugarNacimiento", value: item.lugarNacimiento },
        { field: "lugarResidencia", value: item.lugarResidencia },
      ]);
    });

    ensureSpace(doc, 120);
    doc.addPage();
    sectionTitle(doc, BIO_CALL_SECTIONS[5].title);
    const cb = data.caseBackground;
    questionField(doc, "caseBackground.viajesComentarios", cb.viajesComentarios);
    cb.viajes.forEach((item, index) => {
      const viajeFields: ArrayField[] = [
        { field: "fechaEntrada", value: item.fechaEntrada },
        { field: "formaEntrada", value: item.formaEntrada },
        { field: "lugarEntrada", value: item.lugarEntrada },
        { field: "fechaSalida", value: item.fechaSalida },
        { field: "fueDetenido", value: item.fueDetenido },
      ];
      if (item.fueDetenido === "si" || item.detallesDetencion?.trim()) {
        viajeFields.push({
          field: "detallesDetencion",
          value: item.detallesDetencion,
        });
      }
      numberedBlock(doc, "viajes", index, viajeFields);
    });
    questionField(doc, "caseBackground.detenidoInmigracion", cb.detenidoInmigracion);
    cb.detencionesInmi.forEach((item, index) => {
      numberedBlock(doc, "detencionesInmi", index, [
        { field: "lugar", value: item.lugar },
        { field: "fecha", value: item.fecha },
        { field: "autoridad", value: item.autoridad },
        { field: "ordenDeportacion", value: item.ordenDeportacion },
        { field: "sancionCastigo", value: item.sancionCastigo },
        { field: "regresoVoluntario", value: item.regresoVoluntario },
        { field: "fotosHuellas", value: item.fotosHuellas },
        { field: "citaCorte", value: item.citaCorte },
      ]);
    });
    questionField(doc, "caseBackground.arrestadoPolicia", cb.arrestadoPolicia);
    cb.arrestosPolicia.forEach((item, index) => {
      numberedBlock(doc, "arrestosPolicia", index, [
        { field: "paisCiudadEstado", value: item.paisCiudadEstado },
        { field: "fecha", value: item.fecha },
        { field: "motivo", value: item.motivo },
        { field: "autoridad", value: item.autoridad },
        { field: "disposicion", value: item.disposicion },
      ]);
    });

    sectionTitle(doc, "Empleo actual");
    questionField(doc, "caseBackground.empleoNombre", cb.empleoNombre);
    questionField(doc, "caseBackground.empleoOcupacion", cb.empleoOcupacion);
    questionField(doc, "caseBackground.empleoDireccionCalle", cb.empleoDireccionCalle);
    questionField(doc, "caseBackground.empleoDireccionApto", cb.empleoDireccionApto);
    questionField(doc, "caseBackground.empleoDireccionCiudad", cb.empleoDireccionCiudad);
    questionField(doc, "caseBackground.empleoDireccionEstado", cb.empleoDireccionEstado);
    questionField(doc, "caseBackground.empleoDireccionZip", cb.empleoDireccionZip);
    questionField(doc, "caseBackground.empleoDireccionPais", cb.empleoDireccionPais);
    questionField(doc, "caseBackground.empleoFechaIngreso", cb.empleoFechaIngreso);
    questionField(doc, "caseBackground.empleoFechaSalida", cb.empleoFechaSalida);
    questionField(doc, "caseBackground.empleoOtrosLugares", cb.empleoOtrosLugares);
    cb.empleosAnteriores.forEach((item, index) => {
      numberedBlock(doc, "empleosAnteriores", index, [
        { field: "empresa", value: item.empresa },
        { field: "puesto", value: item.puesto },
        { field: "direccionCalle", value: item.direccionCalle },
        { field: "direccionApto", value: item.direccionApto },
        { field: "direccionCiudad", value: item.direccionCiudad },
        { field: "direccionEstado", value: item.direccionEstado },
        { field: "direccionZip", value: item.direccionZip },
        { field: "direccionPais", value: item.direccionPais },
        { field: "fechaDesde", value: item.fechaDesde },
        { field: "fechaHasta", value: item.fechaHasta },
      ]);
    });

    renderInadmissibilitySection(doc, cb);

    sectionTitle(doc, "Declaraciones");
    questionField(doc, "caseBackground.declaradoCiudadano", cb.declaradoCiudadano);
    questionField(doc, "caseBackground.falsaDeclaracionLugar", cb.falsaDeclaracionLugar);
    questionField(doc, "caseBackground.falsaDeclaracionFecha", cb.falsaDeclaracionFecha);
    questionField(doc, "caseBackground.falsaDeclaracionComo", cb.falsaDeclaracionComo);
    questionField(doc, "caseBackground.falsaDeclaracionIntencion", cb.falsaDeclaracionIntencion);
    questionField(doc, "caseBackground.falsaDeclaracionDetalle", cb.falsaDeclaracionDetalle);

    sectionTitle(doc, "Solicitudes FOIA");
    FOIA_AGENCIES.forEach((agency) => {
      const item = cb.foias[agency];
      questionField(doc, `caseBackground.foias.${agency}.solicitar`, item.solicitar);
      if (item.motivo?.trim()) {
        questionField(doc, `caseBackground.foias.${agency}.motivo`, item.motivo);
      }
    });

    ensureSpace(doc, 80);
    sectionTitle(doc, "Documentos y correos pendientes");
    questionField(doc, "caseBackground.documentosPendientes", cb.documentosPendientes);
    questionField(doc, "caseBackground.correosPendientes", cb.correosPendientes);

    doc.end();
  });
}
