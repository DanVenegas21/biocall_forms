import PDFDocument from "pdfkit";
import type { BioCall } from "@biocall/shared";
import { BIO_CALL_SECTIONS } from "@biocall/shared";
import { existsSync } from "node:fs";

export const BIO_CALL_PDF_TEMPLATE_VERSION = "v1";

export interface GenerateBioCallPdfOptions {
  logoPath?: string;
  generatedAt?: Date;
}

type PdfDoc = InstanceType<typeof PDFDocument>;

function display(value: string | undefined | null): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

function fullName(...parts: (string | undefined | null)[]): string {
  return parts.map((part) => part?.trim() ?? "").filter(Boolean).join(" ");
}

function sectionTitle(doc: PdfDoc, title: string): void {
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#1e3a5f").text(title);
  doc.moveDown(0.25);
  doc.font("Helvetica").fontSize(10).fillColor("#000000");
}

function fieldLine(doc: PdfDoc, label: string, value: string): void {
  doc.text(`${label}: ${display(value)}`, { lineGap: 2 });
}

function ensureSpace(doc: PdfDoc, minHeight = 60): void {
  if (doc.y > doc.page.height - doc.page.margins.bottom - minHeight) {
    doc.addPage();
  }
}

export function generateBioCallPdf(
  data: BioCall,
  options: GenerateBioCallPdfOptions = {}
): Promise<Buffer> {
  const generatedAt = options.generatedAt ?? new Date();
  const pd = data.personalData;
  const clientName = [pd.nombres, pd.apellidoPaterno, pd.apellidoMaterno]
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

    // Datos personales
    sectionTitle(doc, BIO_CALL_SECTIONS[0].title);
    fieldLine(doc, "Nombres", pd.nombres);
    fieldLine(doc, "Apellido paterno", pd.apellidoPaterno);
    fieldLine(doc, "Apellido materno", pd.apellidoMaterno);
    fieldLine(doc, "Otros nombres", pd.otrosNombres);
    fieldLine(doc, "Fecha de nacimiento", pd.fechaNacimiento);
    fieldLine(doc, "Ciudad de nacimiento", pd.ciudadNacimiento);
    fieldLine(doc, "Estado de nacimiento", pd.estadoNacimiento);
    fieldLine(doc, "Pais de nacimiento", pd.paisNacimiento);
    fieldLine(doc, "Sexo", pd.sexo);
    fieldLine(doc, "Estado civil", pd.estadoCivil);
    fieldLine(doc, "Nacionalidad", pd.nacionalidad);
    fieldLine(doc, "Comprende ingles", pd.comprendeIngles);
    fieldLine(doc, "Idioma preferido", pd.idiomaPreferido);
    fieldLine(doc, "Habla otro idioma", pd.hablaOtroIdioma);
    fieldLine(doc, "Especificar idioma", pd.especificarIdioma);

    // Contacto
    sectionTitle(doc, BIO_CALL_SECTIONS[1].title);
    fieldLine(doc, "Telefono", data.contact.telefono);
    fieldLine(doc, "Correo electronico", data.contact.correoElectronico);

    // Domicilio
    sectionTitle(doc, BIO_CALL_SECTIONS[2].title);
    const addr = data.address;
    fieldLine(doc, "Calle y numero", addr.calleNumero);
    fieldLine(doc, "Apto/Suite", addr.aptoSuite);
    fieldLine(doc, "Ciudad", addr.ciudad);
    fieldLine(doc, "Estado", addr.estado);
    fieldLine(doc, "Codigo postal", addr.codigoPostal);
    fieldLine(doc, "Fecha de ingreso", addr.fechaIngreso);
    fieldLine(doc, "Residido en otros lugares", addr.resididoOtrosLugares);
    addr.direccionesAnteriores.forEach((item, index) => {
      ensureSpace(doc);
      doc.font("Helvetica-Bold").text(`Direccion anterior ${index + 1}`);
      doc.font("Helvetica");
      fieldLine(doc, "  Calle", item.calleNumero);
      fieldLine(doc, "  Ciudad", item.ciudad);
      fieldLine(doc, "  Estado", item.estado);
      fieldLine(doc, "  Desde / Hasta", `${display(item.fechaDesde)} — ${display(item.fechaHasta)}`);
    });

    // Documentos
    ensureSpace(doc, 120);
    sectionTitle(doc, BIO_CALL_SECTIONS[3].title);
    const docu = data.documents;
    fieldLine(doc, "Tiene pasaporte", docu.tienePasaporte);
    fieldLine(doc, "Pasaporte pendiente", docu.pasaportePendiente);
    fieldLine(doc, "Numero de pasaporte", docu.numeroPasaporte);
    fieldLine(doc, "Pais de emision", docu.paisEmision);
    fieldLine(doc, "Fecha de emision", docu.fechaEmision);
    fieldLine(doc, "Fecha de expiracion", docu.fechaExpiracion);
    fieldLine(doc, "Tiene A-Number", docu.tieneANumber);
    fieldLine(doc, "A-Number", docu.aNumberValue);
    fieldLine(doc, "Origen A-Number", docu.aNumberOrigen);
    fieldLine(doc, "Tiene SSN", docu.tieneSSN);
    fieldLine(doc, "SSN", docu.ssnValue);
    fieldLine(doc, "Tiene EAD", docu.tieneEAD);
    fieldLine(doc, "EAD", docu.eadValue);

    // Familia
    ensureSpace(doc, 120);
    sectionTitle(doc, BIO_CALL_SECTIONS[4].title);
    const fam = data.family;
    fieldLine(
      doc,
      "Nombre del padre",
      fullName(fam.nombresPadre, fam.apellidoPaternoPadre, fam.apellidoMaternoPadre)
    );
    fieldLine(
      doc,
      "Nombre de la madre",
      fullName(fam.nombresMadre, fam.apellidoPaternoMadre, fam.apellidoMaternoMadre)
    );
    fieldLine(doc, "Tiene conyuge", fam.tieneConyuge);
    fieldLine(doc, "Nombres conyuge", fam.nombresConyuge);
    fieldLine(doc, "Apellido paterno conyuge", fam.apellidoPaternoConyuge);
    fieldLine(doc, "Apellido materno conyuge", fam.apellidoMaternoConyuge);
    fieldLine(doc, "Casado", fam.casado);
    fieldLine(doc, "Previamente casado", fam.previamenteCasado);
    fieldLine(doc, "Tiene hijos", fam.tieneHijos);
    fam.matrimoniosPrevios.forEach((item, index) => {
      ensureSpace(doc);
      doc.font("Helvetica-Bold").text(`Matrimonio previo ${index + 1}`);
      doc.font("Helvetica");
      fieldLine(
        doc,
        "  Ex-conyuge",
        fullName(
          item.nombresExConyuge,
          item.apellidoPaternoExConyuge,
          item.apellidoMaternoExConyuge
        )
      );
      fieldLine(doc, "  Matrimonio", item.fechaLugarMatrimonio);
      fieldLine(doc, "  Divorcio", item.fechaLugarDivorcio);
    });
    fam.hijos.forEach((item, index) => {
      ensureSpace(doc);
      doc.font("Helvetica-Bold").text(`Hijo ${index + 1}`);
      doc.font("Helvetica");
      fieldLine(
        doc,
        "  Nombre",
        fullName(item.nombres, item.apellidoPaterno, item.apellidoMaterno)
      );
      fieldLine(doc, "  Fecha nacimiento", item.fechaNacimiento);
      fieldLine(doc, "  Lugar residencia", item.lugarResidencia);
    });

    // Caso
    ensureSpace(doc, 120);
    doc.addPage();
    sectionTitle(doc, BIO_CALL_SECTIONS[5].title);
    const cb = data.caseBackground;
    fieldLine(doc, "Comentarios de viajes", cb.viajesComentarios);
    cb.viajes.forEach((item, index) => {
      ensureSpace(doc);
      doc.font("Helvetica-Bold").text(`Viaje ${index + 1}`);
      doc.font("Helvetica");
      fieldLine(doc, "  Entrada", item.fechaEntrada);
      fieldLine(doc, "  Forma", item.formaEntrada);
      fieldLine(doc, "  Lugar", item.lugarEntrada);
      fieldLine(doc, "  Detenido", item.fueDetenido);
    });
    fieldLine(doc, "Detenido por inmigracion", cb.detenidoInmigracion);
    cb.detencionesInmi.forEach((item, index) => {
      ensureSpace(doc);
      doc.font("Helvetica-Bold").text(`Detencion inmigracion ${index + 1}`);
      doc.font("Helvetica");
      fieldLine(doc, "  Lugar", item.lugar);
      fieldLine(doc, "  Fecha", item.fecha);
      fieldLine(doc, "  Autoridad", item.autoridad);
    });
    fieldLine(doc, "Arrestado por policia", cb.arrestadoPolicia);
    cb.arrestosPolicia.forEach((item, index) => {
      ensureSpace(doc);
      doc.font("Helvetica-Bold").text(`Arresto policial ${index + 1}`);
      doc.font("Helvetica");
      fieldLine(doc, "  Lugar", item.paisCiudadEstado);
      fieldLine(doc, "  Motivo", item.motivo);
      fieldLine(doc, "  Disposicion", item.disposicion);
    });

    sectionTitle(doc, "Empleo actual");
    fieldLine(doc, "Empresa", cb.empleoNombre);
    fieldLine(doc, "Ocupacion", cb.empleoOcupacion);
    fieldLine(doc, "Direccion", [
      cb.empleoDireccionCalle,
      cb.empleoDireccionCiudad,
      cb.empleoDireccionEstado,
      cb.empleoDireccionZip,
    ]
      .filter((p) => p?.trim())
      .join(", "));
    fieldLine(doc, "Fecha ingreso", cb.empleoFechaIngreso);
    fieldLine(doc, "Otros empleos", cb.empleoOtrosLugares);
    cb.empleosAnteriores.forEach((item, index) => {
      ensureSpace(doc);
      doc.font("Helvetica-Bold").text(`Empleo anterior ${index + 1}`);
      doc.font("Helvetica");
      fieldLine(doc, "  Empresa", item.empresa);
      fieldLine(doc, "  Puesto", item.puesto);
    });

    sectionTitle(doc, "Inadmisibilidad");
    const inadFields: Array<[string, string]> = [
      ["Detencion por trafico", cb.inadDetencionTrafico],
      ["Cometido delito", cb.inadCometidoDelito],
      ["Procedimiento de remocion", cb.inadProcedimientoRemocion],
      ["Fraude migratorio", cb.inadFraudeMigratorio],
    ];
    inadFields.forEach(([label, value]) => fieldLine(doc, label, value));

    sectionTitle(doc, "Declaraciones");
    fieldLine(doc, "Declarado ciudadano", cb.declaradoCiudadano);
    fieldLine(doc, "Falsa declaracion (detalle)", cb.falsaDeclaracionDetalle);

    sectionTitle(doc, "Solicitudes FOIA");
    const foiaAgencies = [
      ["USCIS", cb.foias.uscis],
      ["ICE", cb.foias.ice],
      ["CBP", cb.foias.cbp],
      ["EOIR", cb.foias.eoir],
      ["FBI", cb.foias.fbi],
      ["Policia", cb.foias.policia],
    ] as const;
    foiaAgencies.forEach(([name, item]) => {
      fieldLine(doc, name, `${display(item.solicitar)}${item.motivo?.trim() ? ` — ${item.motivo}` : ""}`);
    });

    doc.end();
  });
}
