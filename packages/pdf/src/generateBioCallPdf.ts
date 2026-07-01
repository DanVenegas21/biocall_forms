import PDFDocument from "pdfkit";
import type { BioCall } from "@biocall/shared";
import { BIO_CALL_SECTIONS } from "@biocall/shared";
import { existsSync } from "node:fs";
import { renderInadmissibilitySection } from "./inadmissibilityTable";

export const BIO_CALL_PDF_TEMPLATE_VERSION = "v1.8";

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

function blockDivider(doc: PdfDoc, label: string, index: number): void {
  doc.moveDown(0.35);
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#5c6b7a")
    .text(`— ${label} ${index + 1} —`, { lineGap: 1 });
  doc.fontSize(10).fillColor("#000000");
  doc.moveDown(0.15);
}

function formatQuestion(text: string): string {
  return `¿${text}?`;
}

type NumberedField = {
  question: (n: number) => string;
  value: string;
};

function numberedBlock(
  doc: PdfDoc,
  index: number,
  blockLabel: string,
  fields: NumberedField[]
): void {
  const n = index + 1;
  ensureSpace(doc);
  blockDivider(doc, blockLabel, index);
  for (const { question, value } of fields) {
    fieldLine(doc, question(n), value);
  }
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
    fieldLine(doc, "Pais", addr.pais);
    fieldLine(doc, "Fecha de ingreso", addr.fechaIngreso);
    fieldLine(doc, "Residido en otros lugares", addr.resididoOtrosLugares);
    addr.direccionesAnteriores.forEach((item, index) => {
      numberedBlock(doc, index, "Domicilio anterior", [
        {
          question: (n) => formatQuestion(`Cual es la calle y numero del domicilio anterior ${n}`),
          value: item.calleNumero,
        },
        {
          question: (n) => formatQuestion(`Cual es el apto o suite del domicilio anterior ${n}`),
          value: item.aptoSuite,
        },
        {
          question: (n) => formatQuestion(`En que ciudad estaba el domicilio anterior ${n}`),
          value: item.ciudad,
        },
        {
          question: (n) => formatQuestion(`En que estado estaba el domicilio anterior ${n}`),
          value: item.estado,
        },
        {
          question: (n) => formatQuestion(`Cual es el codigo postal del domicilio anterior ${n}`),
          value: item.codigoPostal,
        },
        {
          question: (n) => formatQuestion(`En que pais estaba el domicilio anterior ${n}`),
          value: item.pais,
        },
        {
          question: (n) => formatQuestion(`Desde cuando vivio en el domicilio anterior ${n}`),
          value: item.fechaDesde,
        },
        {
          question: (n) => formatQuestion(`Hasta cuando vivio en el domicilio anterior ${n}`),
          value: item.fechaHasta,
        },
      ]);
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
    fieldLine(doc, "Nombres del padre", fam.nombresPadre);
    fieldLine(doc, "Apellido paterno del padre", fam.apellidoPaternoPadre);
    fieldLine(doc, "Apellido materno del padre", fam.apellidoMaternoPadre);
    fieldLine(doc, "Nombres de la madre", fam.nombresMadre);
    fieldLine(doc, "Apellido paterno de la madre", fam.apellidoPaternoMadre);
    fieldLine(doc, "Apellido materno de la madre", fam.apellidoMaternoMadre);
    fieldLine(doc, "Tiene conyuge", fam.tieneConyuge);
    fieldLine(doc, "Nombres conyuge", fam.nombresConyuge);
    fieldLine(doc, "Apellido paterno conyuge", fam.apellidoPaternoConyuge);
    fieldLine(doc, "Apellido materno conyuge", fam.apellidoMaternoConyuge);
    fieldLine(doc, "Fecha y lugar de matrimonio", fam.fechaLugarMatrimonioConyuge);
    fieldLine(doc, "Fecha y lugar de nacimiento del conyuge", fam.fechaLugarNacimientoConyuge);
    fieldLine(doc, "Casado", fam.casado);
    fieldLine(doc, "Previamente casado", fam.previamenteCasado);
    fieldLine(doc, "Tiene hijos", fam.tieneHijos);
    fam.matrimoniosPrevios.forEach((item, index) => {
      numberedBlock(doc, index, "Matrimonio previo", [
        {
          question: (n) => formatQuestion(`Cual es el nombre del ex-conyuge del matrimonio previo ${n}`),
          value: item.nombresExConyuge,
        },
        {
          question: (n) =>
            formatQuestion(`Cual es el apellido paterno del ex-conyuge del matrimonio previo ${n}`),
          value: item.apellidoPaternoExConyuge,
        },
        {
          question: (n) =>
            formatQuestion(`Cual es el apellido materno del ex-conyuge del matrimonio previo ${n}`),
          value: item.apellidoMaternoExConyuge,
        },
        {
          question: (n) => formatQuestion(`Cuando y donde fue el matrimonio previo ${n}`),
          value: item.fechaLugarMatrimonio,
        },
        {
          question: (n) =>
            formatQuestion(`Cuando y donde nacio el ex-conyuge del matrimonio previo ${n}`),
          value: item.fechaLugarNacimiento,
        },
        {
          question: (n) => formatQuestion(`Cuando y donde fue el divorcio del matrimonio previo ${n}`),
          value: item.fechaLugarDivorcio,
        },
      ]);
    });
    fam.hijos.forEach((item, index) => {
      numberedBlock(doc, index, "Hijo", [
        {
          question: (n) => formatQuestion(`Cual es el nombre del hijo ${n}`),
          value: item.nombres,
        },
        {
          question: (n) => formatQuestion(`Cual es el apellido paterno del hijo ${n}`),
          value: item.apellidoPaterno,
        },
        {
          question: (n) => formatQuestion(`Cual es el apellido materno del hijo ${n}`),
          value: item.apellidoMaterno,
        },
        {
          question: (n) => formatQuestion(`Cual es la fecha de nacimiento del hijo ${n}`),
          value: item.fechaNacimiento,
        },
        {
          question: (n) => formatQuestion(`Donde nacio el hijo ${n}`),
          value: item.lugarNacimiento,
        },
        {
          question: (n) => formatQuestion(`Donde reside el hijo ${n}`),
          value: item.lugarResidencia,
        },
      ]);
    });

    // Caso
    ensureSpace(doc, 120);
    doc.addPage();
    sectionTitle(doc, BIO_CALL_SECTIONS[5].title);
    const cb = data.caseBackground;
    fieldLine(doc, "Comentarios de viajes", cb.viajesComentarios);
    cb.viajes.forEach((item, index) => {
      numberedBlock(doc, index, "Viaje", [
        {
          question: (n) => formatQuestion(`Cuando fue la entrada del viaje ${n}`),
          value: item.fechaEntrada,
        },
        {
          question: (n) => formatQuestion(`De que forma ingreso en el viaje ${n}`),
          value: item.formaEntrada,
        },
        {
          question: (n) => formatQuestion(`Por donde ingreso en el viaje ${n}`),
          value: item.lugarEntrada,
        },
        {
          question: (n) => formatQuestion(`Fue detenido en el viaje ${n}`),
          value: item.fueDetenido,
        },
      ]);
    });
    fieldLine(doc, "Detenido por inmigracion", cb.detenidoInmigracion);
    cb.detencionesInmi.forEach((item, index) => {
      numberedBlock(doc, index, "Detencion por inmigracion", [
        {
          question: (n) => formatQuestion(`Donde fue la detencion por inmigracion ${n}`),
          value: item.lugar,
        },
        {
          question: (n) => formatQuestion(`Cuando fue la detencion por inmigracion ${n}`),
          value: item.fecha,
        },
        {
          question: (n) => formatQuestion(`Que autoridad realizo la detencion por inmigracion ${n}`),
          value: item.autoridad,
        },
      ]);
    });
    fieldLine(doc, "Arrestado por policia", cb.arrestadoPolicia);
    cb.arrestosPolicia.forEach((item, index) => {
      numberedBlock(doc, index, "Arresto policial", [
        {
          question: (n) =>
            formatQuestion(`En que pais, ciudad y estado fue el arresto policial ${n}`),
          value: item.paisCiudadEstado,
        },
        {
          question: (n) => formatQuestion(`Cual fue el motivo del arresto policial ${n}`),
          value: item.motivo,
        },
        {
          question: (n) => formatQuestion(`Cual fue la disposicion del arresto policial ${n}`),
          value: item.disposicion,
        },
      ]);
    });

    sectionTitle(doc, "Empleo actual");
    fieldLine(doc, "Empresa", cb.empleoNombre);
    fieldLine(doc, "Ocupacion", cb.empleoOcupacion);
    fieldLine(doc, "Direccion", [
      cb.empleoDireccionCalle,
      cb.empleoDireccionCiudad,
      cb.empleoDireccionEstado,
      cb.empleoDireccionZip,
      cb.empleoDireccionPais,
    ]
      .filter((p) => p?.trim())
      .join(", "));
    fieldLine(doc, "Fecha ingreso", cb.empleoFechaIngreso);
    fieldLine(doc, "Otros empleos", cb.empleoOtrosLugares);
    cb.empleosAnteriores.forEach((item, index) => {
      numberedBlock(doc, index, "Empleo anterior", [
        {
          question: (n) => formatQuestion(`Cual es el nombre de la empresa del empleo anterior ${n}`),
          value: item.empresa,
        },
        {
          question: (n) => formatQuestion(`Cual fue el puesto en el empleo anterior ${n}`),
          value: item.puesto,
        },
        {
          question: (n) => formatQuestion(`Cual es la direccion del empleo anterior ${n}`),
          value: [
            item.direccionCalle,
            item.direccionCiudad,
            item.direccionEstado,
            item.direccionZip,
            item.direccionPais,
          ]
            .filter((p) => p?.trim())
            .join(", "),
        },
        {
          question: (n) => formatQuestion(`Desde cuando trabajo en el empleo anterior ${n}`),
          value: item.fechaDesde,
        },
        {
          question: (n) => formatQuestion(`Hasta cuando trabajo en el empleo anterior ${n}`),
          value: item.fechaHasta,
        },
      ]);
    });

    renderInadmissibilitySection(doc, cb);

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

    ensureSpace(doc, 80);
    sectionTitle(doc, "Documentos y correos pendientes");
    fieldLine(doc, "Documentos pendientes", cb.documentosPendientes);
    fieldLine(doc, "Correos pendientes", cb.correosPendientes);

    doc.end();
  });
}
