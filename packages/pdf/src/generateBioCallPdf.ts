import PDFDocument from "pdfkit";
import type { BioCall } from "@biocall/shared";
import { BIO_CALL_SECTIONS } from "@biocall/shared";
import { existsSync } from "node:fs";
import { renderInadmissibilitySection } from "./inadmissibilityTable";

export const BIO_CALL_PDF_TEMPLATE_VERSION = "v1.9";

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

    // Datos personales
    sectionTitle(doc, BIO_CALL_SECTIONS[0].title);
    fieldLine(doc, "¿Cuál es el primer nombre del cliente?", pd.nombres);
    fieldLine(doc, "¿Cuál es el segundo nombre (opcional) del cliente?", pd.segundoNombre);
    fieldLine(doc, "¿Cuál es el apellido paterno del cliente?", pd.apellidoPaterno);
    fieldLine(doc, "¿Cuál es el apellido materno del cliente?", pd.apellidoMaterno);
    fieldLine(doc, "¿Tiene otros nombres el cliente?", pd.otrosNombres);
    fieldLine(doc, "¿Cuál es la fecha de nacimiento del cliente?", pd.fechaNacimiento);
    fieldLine(doc, "¿Cuál es la ciudad de nacimiento del cliente?", pd.ciudadNacimiento);
    fieldLine(doc, "¿Cuál es el estado de nacimiento del cliente?", pd.estadoNacimiento);
    fieldLine(doc, "¿Cuál es el país de nacimiento del cliente?", pd.paisNacimiento);
    fieldLine(doc, "¿Cuál es el sexo del cliente?", pd.sexo);
    fieldLine(doc, "¿Cuál es el estado civil del cliente?", pd.estadoCivil);
    fieldLine(doc, "¿Cuál es la nacionalidad del cliente?", pd.nacionalidad);
    fieldLine(doc, "¿Comprende inglés el cliente?", pd.comprendeIngles);
    fieldLine(doc, "¿Cuál es el idioma preferido del cliente?", pd.idiomaPreferido);
    fieldLine(doc, "¿Habla otro idioma el cliente?", pd.hablaOtroIdioma);
    fieldLine(doc, "¿Qué otros idiomas habla el cliente?", pd.especificarIdioma);

    // Contacto
    sectionTitle(doc, BIO_CALL_SECTIONS[1].title);
    fieldLine(doc, "¿Cuál es el número de teléfono del cliente?", data.contact.telefono);
    fieldLine(doc, "¿Cuál es el correo electrónico del cliente?", data.contact.correoElectronico);

    // Domicilio
    sectionTitle(doc, BIO_CALL_SECTIONS[2].title);
    const addr = data.address;
    fieldLine(doc, "¿Cuál es la calle y número de la dirección actual del cliente?", addr.calleNumero);
    fieldLine(doc, "¿Cuál es el apartamento o suite de la dirección actual del cliente?", addr.aptoSuite);
    fieldLine(doc, "¿En qué ciudad está la dirección actual del cliente?", addr.ciudad);
    fieldLine(doc, "¿En qué estado está la dirección actual del cliente?", addr.estado);
    fieldLine(doc, "¿Cuál es el código postal de la dirección actual del cliente?", addr.codigoPostal);
    fieldLine(doc, "¿En qué país está la dirección actual del cliente?", addr.pais);
    fieldLine(doc, "¿Desde cuándo vive en la dirección actual del cliente?", addr.fechaIngreso);
    fieldLine(doc, "¿Ha residido el cliente en otros lugares anteriormente?", addr.resididoOtrosLugares);
    addr.direccionesAnteriores.forEach((item, index) => {
      numberedBlock(doc, index, "Domicilio anterior", [
        {
          question: (n) => formatQuestion(`Cual es la calle y numero del domicilio anterior #${n} del cliente`),
          value: item.calleNumero,
        },
        {
          question: (n) => formatQuestion(`Cual es el apartamento o suite del domicilio anterior #${n} del cliente`),
          value: item.aptoSuite,
        },
        {
          question: (n) => formatQuestion(`En que ciudad estaba el domicilio anterior #${n} del cliente`),
          value: item.ciudad,
        },
        {
          question: (n) => formatQuestion(`En que estado estaba el domicilio anterior #${n} del cliente`),
          value: item.estado,
        },
        {
          question: (n) => formatQuestion(`Cual es el codigo postal del domicilio anterior #${n} del cliente`),
          value: item.codigoPostal,
        },
        {
          question: (n) => formatQuestion(`En que pais estaba el domicilio anterior #${n} del cliente`),
          value: item.pais,
        },
        {
          question: (n) => formatQuestion(`Desde cuando vivio el cliente en el domicilio anterior #${n}`),
          value: item.fechaDesde,
        },
        {
          question: (n) => formatQuestion(`Hasta cuando vivio el cliente en el domicilio anterior #${n}`),
          value: item.fechaHasta,
        },
      ]);
    });

    // Documentos
    ensureSpace(doc, 120);
    sectionTitle(doc, BIO_CALL_SECTIONS[3].title);
    const docu = data.documents;
    fieldLine(doc, "¿Tiene pasaporte el cliente?", docu.tienePasaporte);
    fieldLine(doc, "¿Tiene algún trámite de pasaporte pendiente el cliente?", docu.pasaportePendiente);
    fieldLine(doc, "¿Cuál es el número de pasaporte del cliente?", docu.numeroPasaporte);
    fieldLine(doc, "¿Cuál es el país de emisión del pasaporte del cliente?", docu.paisEmision);
    fieldLine(doc, "¿Cuál es la fecha de emisión del pasaporte del cliente?", docu.fechaEmision);
    fieldLine(doc, "¿Cuál es la fecha de expiración del pasaporte del cliente?", docu.fechaExpiracion);
    fieldLine(doc, "¿Tiene el cliente un A-Number?", docu.tieneANumber);
    fieldLine(doc, "¿Cuál es el A-Number del cliente?", docu.aNumberValue);
    fieldLine(doc, "¿Cuál es el origen del A-Number del cliente?", docu.aNumberOrigen);
    fieldLine(doc, "¿Tiene el cliente Seguro Social (SSN)?", docu.tieneSSN);
    fieldLine(doc, "¿Cuál es el Seguro Social (SSN) del cliente?", docu.ssnValue);
    fieldLine(doc, "¿Tiene el cliente Permiso de Trabajo (EAD)?", docu.tieneEAD);
    fieldLine(doc, "¿Cuál es el número de Permiso de Trabajo (EAD) del cliente?", docu.eadValue);

    // Familia
    ensureSpace(doc, 120);
    sectionTitle(doc, BIO_CALL_SECTIONS[4].title);
    const fam = data.family;
    fieldLine(doc, "¿Cuál es el primer nombre del padre del cliente?", fam.nombresPadre);
    fieldLine(doc, "¿Cuál es el segundo nombre (opcional) del padre del cliente?", fam.segundoNombrePadre);
    fieldLine(doc, "¿Cuál es el apellido paterno del padre del cliente?", fam.apellidoPaternoPadre);
    fieldLine(doc, "¿Cuál es el apellido materno (opcional) del padre del cliente?", fam.apellidoMaternoPadre);
    fieldLine(doc, "¿Cuál es el primer nombre de la madre del cliente?", fam.nombresMadre);
    fieldLine(doc, "¿Cuál es el segundo nombre (opcional) de la madre del cliente?", fam.segundoNombreMadre);
    fieldLine(doc, "¿Cuál es el apellido paterno de la madre del cliente?", fam.apellidoPaternoMadre);
    fieldLine(doc, "¿Cuál es el apellido materno (opcional) de la madre del cliente?", fam.apellidoMaternoMadre);
    fieldLine(doc, "¿Tiene el cliente cónyuge actual?", fam.tieneConyuge);
    fieldLine(doc, "¿Cuál es el primer nombre del cónyuge del cliente?", fam.nombresConyuge);
    fieldLine(doc, "¿Cuál es el segundo nombre (opcional) del cónyuge del cliente?", fam.segundoNombreConyuge);
    fieldLine(doc, "¿Cuál es el apellido paterno del cónyuge del cliente?", fam.apellidoPaternoConyuge);
    fieldLine(doc, "¿Cuál es el apellido materno (opcional) del cónyuge del cliente?", fam.apellidoMaternoConyuge);
    fieldLine(doc, "¿Cuál es la fecha de matrimonio con el cónyuge del cliente?", fam.fechaMatrimonioConyuge);
    fieldLine(doc, "¿Cuál es el lugar de matrimonio con el cónyuge del cliente?", fam.lugarMatrimonioConyuge);
    fieldLine(doc, "¿Cuál es la fecha de nacimiento del cónyuge del cliente?", fam.fechaNacimientoConyuge);
    fieldLine(doc, "¿Cuál es el lugar de nacimiento del cónyuge del cliente?", fam.lugarNacimientoConyuge);
    fieldLine(doc, "¿Está casado el cliente actualmente?", fam.casado);
    fieldLine(doc, "¿Ha estado el cliente previamente casado?", fam.previamenteCasado);
    fieldLine(doc, "¿Tiene hijos el cliente?", fam.tieneHijos);
    fam.matrimoniosPrevios.forEach((item, index) => {
      numberedBlock(doc, index, "Matrimonio previo", [
        {
          question: (n) => formatQuestion(`Cual es el primer nombre del ex-cónyuge del matrimonio previo #${n} del cliente`),
          value: item.nombresExConyuge,
        },
        {
          question: (n) => formatQuestion(`Cual es el segundo nombre (opcional) del ex-cónyuge del matrimonio previo #${n} del cliente`),
          value: item.segundoNombreExConyuge,
        },
        {
          question: (n) =>
            formatQuestion(`Cual es el apellido para el paterno del ex-cónyuge del matrimonio previo #${n} del cliente`),
          value: item.apellidoPaternoExConyuge,
        },
        {
          question: (n) =>
            formatQuestion(`Cual es el apellido materno (opcional) del ex-cónyuge del matrimonio previo #${n} del cliente`),
          value: item.apellidoMaternoExConyuge,
        },
        {
          question: (n) => formatQuestion(`Cuando y donde fue el matrimonio previo #${n} del cliente`),
          value: item.fechaLugarMatrimonio,
        },
        {
          question: (n) =>
            formatQuestion(`Cuando y donde nacio el ex-cónyuge del matrimonio previo #${n} del cliente`),
          value: item.fechaLugarNacimiento,
        },
        {
          question: (n) => formatQuestion(`Cuando y donde fue el divorcio del matrimonio previo #${n} del cliente`),
          value: item.fechaLugarDivorcio,
        },
      ]);
    });
    fam.hijos.forEach((item, index) => {
      numberedBlock(doc, index, "Hijo", [
        {
          question: (n) => formatQuestion(`Cual es el primer nombre del hijo #${n} del cliente`),
          value: item.nombres,
        },
        {
          question: (n) => formatQuestion(`Cual es el segundo nombre (opcional) del hijo #${n} del cliente`),
          value: item.segundoNombre,
        },
        {
          question: (n) => formatQuestion(`Cual es el apellido paterno del hijo #${n} del cliente`),
          value: item.apellidoPaterno,
        },
        {
          question: (n) => formatQuestion(`Cual es el apellido materno (opcional) del hijo #${n} del cliente`),
          value: item.apellidoMaterno,
        },
        {
          question: (n) => formatQuestion(`Cual es la fecha de nacimiento del hijo #${n} del cliente`),
          value: item.fechaNacimiento,
        },
        {
          question: (n) => formatQuestion(`Donde nacio el hijo #${n} del cliente`),
          value: item.lugarNacimiento,
        },
        {
          question: (n) => formatQuestion(`Donde reside el hijo #${n} del cliente`),
          value: item.lugarResidencia,
        },
      ]);
    });

    // Caso
    ensureSpace(doc, 120);
    doc.addPage();
    sectionTitle(doc, BIO_CALL_SECTIONS[5].title);
    const cb = data.caseBackground;
    fieldLine(doc, "¿Tiene comentarios o aclaraciones sobre el historial de viajes el cliente?", cb.viajesComentarios);
    cb.viajes.forEach((item, index) => {
      const viajeFields: NumberedField[] = [
        {
          question: (n) => formatQuestion(`Cuando fue la entrada del viaje #${n} del cliente`),
          value: item.fechaEntrada,
        },
        {
          question: (n) => formatQuestion(`De que forma ingreso el cliente en el viaje #${n}`),
          value: item.formaEntrada,
        },
        {
          question: (n) => formatQuestion(`Por donde ingreso el cliente en el viaje #${n}`),
          value: item.lugarEntrada,
        },
        {
          question: (n) => formatQuestion(`Cuando fue la salida del viaje #${n} del cliente`),
          value: item.fechaSalida,
        },
        {
          question: (n) => formatQuestion(`Fue detenido el cliente al ingresar en el viaje #${n}`),
          value: item.fueDetenido,
        },
      ];
      if (item.fueDetenido === "si" || item.detallesDetencion?.trim()) {
        viajeFields.push({
          question: (n) => formatQuestion(`Cuales fueron los detalles de la detencion en el viaje #${n} del cliente`),
          value: item.detallesDetencion,
        });
      }
      numberedBlock(doc, index, "Viaje", viajeFields);
    });
    fieldLine(doc, "¿Ha sido el cliente detenido por inmigracion alguna vez?", cb.detenidoInmigracion);
    cb.detencionesInmi.forEach((item, index) => {
      numberedBlock(doc, index, "Detencion por inmigracion", [
        {
          question: (n) => formatQuestion(`Donde ocurrio la detencion por inmigracion #${n} del cliente`),
          value: item.lugar,
        },
        {
          question: (n) => formatQuestion(`Cuando ocurrio la detencion por inmigracion #${n} del cliente`),
          value: item.fecha,
        },
        {
          question: (n) => formatQuestion(`Que autoridad realizo la detencion por inmigracion #${n} del cliente`),
          value: item.autoridad,
        },
        {
          question: (n) =>
            formatQuestion(`Hubo orden de deportacion en la detencion por inmigracion #${n} del cliente`),
          value: item.ordenDeportacion,
        },
        {
          question: (n) =>
            formatQuestion(`Hubo alguna sancion o castigo en la detencion por inmigracion #${n} del cliente`),
          value: item.sancionCastigo,
        },
        {
          question: (n) =>
            formatQuestion(`Hubo salida o regreso voluntario en la detencion por inmigracion #${n} del cliente`),
          value: item.regresoVoluntario,
        },
        {
          question: (n) =>
            formatQuestion(`Se tomaron fotos o huellas dactilares en la detencion por inmigracion #${n} del cliente`),
          value: item.fotosHuellas,
        },
        {
          question: (n) =>
            formatQuestion(`Se le dio una cita en corte por la detencion por inmigracion #${n} del cliente`),
          value: item.citaCorte,
        },
      ]);
    });
    fieldLine(doc, "¿Ha sido el cliente arrestado por la policia alguna vez?", cb.arrestadoPolicia);
    cb.arrestosPolicia.forEach((item, index) => {
      numberedBlock(doc, index, "Arresto policial", [
        {
          question: (n) =>
            formatQuestion(`En que pais, ciudad y estado ocurrio el arresto policial #${n} del cliente`),
          value: item.paisCiudadEstado,
        },
        {
          question: (n) => formatQuestion(`Cuando ocurrio el arresto policial #${n} del cliente`),
          value: item.fecha,
        },
        {
          question: (n) => formatQuestion(`Cual fue el motivo del arresto policial #${n} del cliente`),
          value: item.motivo,
        },
        {
          question: (n) =>
            formatQuestion(`Que autoridad realizo el arresto policial #${n} del cliente`),
          value: item.autoridad,
        },
        {
          question: (n) => formatQuestion(`Cual fue la resolucion o disposicion del arresto policial #${n} del cliente`),
          value: item.disposicion,
        },
      ]);
    });

    sectionTitle(doc, "Empleo actual");
    fieldLine(doc, "¿Cuál es el nombre de la empresa del empleo actual del cliente?", cb.empleoNombre);
    fieldLine(doc, "¿Cuál es el puesto u ocupacion del empleo actual del cliente?", cb.empleoOcupacion);
    fieldLine(doc, "¿Cuál es la calle y numero de la direccion del empleo actual del cliente?", cb.empleoDireccionCalle);
    fieldLine(doc, "¿Cuál es el apartamento o suite de la direccion del empleo actual del cliente?", cb.empleoDireccionApto);
    fieldLine(doc, "¿Cuál es la ciudad, estado, codigo postal y pais del empleo actual del cliente?", [
      cb.empleoDireccionCiudad,
      cb.empleoDireccionEstado,
      cb.empleoDireccionZip,
      cb.empleoDireccionPais,
    ]
      .filter((p) => p?.trim())
      .join(", "));
    fieldLine(doc, "¿Cuál es la fecha de ingreso del empleo actual del cliente?", cb.empleoFechaIngreso);
    fieldLine(doc, "¿Cuál es la fecha de salida (si aplica) del empleo actual del cliente?", cb.empleoFechaSalida);
    fieldLine(doc, "¿Tiene otros empleos anteriores el cliente?", cb.empleoOtrosLugares);
    cb.empleosAnteriores.forEach((item, index) => {
      numberedBlock(doc, index, "Empleo anterior", [
        {
          question: (n) => formatQuestion(`Cual es el nombre de la empresa del empleo anterior #${n} del cliente`),
          value: item.empresa,
        },
        {
          question: (n) => formatQuestion(`Cual fue el puesto ocupado en el empleo anterior #${n} del cliente`),
          value: item.puesto,
        },
        {
          question: (n) => formatQuestion(`Cual es la direccion completa del empleo anterior #${n} del cliente`),
          value: [
            item.direccionCalle,
            item.direccionApto,
            item.direccionCiudad,
            item.direccionEstado,
            item.direccionZip,
            item.direccionPais,
          ]
            .filter((p) => p?.trim())
            .join(", "),
        },
        {
          question: (n) => formatQuestion(`Desde cuando trabajo el cliente en el empleo anterior #${n}`),
          value: item.fechaDesde,
        },
        {
          question: (n) => formatQuestion(`Hasta cuando trabajo el cliente en el empleo anterior #${n}`),
          value: item.fechaHasta,
        },
      ]);
    });

    renderInadmissibilitySection(doc, cb);

    sectionTitle(doc, "Declaraciones");
    fieldLine(doc, "¿Alguna vez se ha declarado ciudadano de los EE. UU. sin serlo?", cb.declaradoCiudadano);
    fieldLine(doc, "¿En que lugar ocurrio la falsa declaracion de ciudadania de los EE. UU.?", cb.falsaDeclaracionLugar);
    fieldLine(doc, "¿En que fecha ocurrio la falsa declaracion de ciudadania de los EE. UU.?", cb.falsaDeclaracionFecha);
    fieldLine(doc, "¿Como o ante quien ocurrio la falsa declaracion de ciudadania de los EE. UU.?", cb.falsaDeclaracionComo);
    fieldLine(doc, "¿Cual era la intencion de la falsa declaracion de ciudadania de los EE. UU.?", cb.falsaDeclaracionIntencion);
    fieldLine(doc, "¿Cuales son los detalles sobre la falsa declaracion de ciudadania de los EE. UU.?", cb.falsaDeclaracionDetalle);

    sectionTitle(doc, "Solicitudes FOIA");
    const foiaAgencies = [
      ["¿Se solicitara FOIA para la agencia USCIS del cliente?", cb.foias.uscis],
      ["¿Se solicitara FOIA para la agencia ICE del cliente?", cb.foias.ice],
      ["¿Se solicitara FOIA para la agencia CBP del cliente?", cb.foias.cbp],
      ["¿Se solicitara FOIA para la agencia EOIR del cliente?", cb.foias.eoir],
      ["¿Se solicitara FOIA para la agencia FBI del cliente?", cb.foias.fbi],
      ["¿Se solicitara FOIA para la agencia de Policia local del cliente?", cb.foias.policia],
    ] as const;
    foiaAgencies.forEach(([qText, item]) => {
      fieldLine(doc, qText, `${display(item.solicitar)}${item.motivo?.trim() ? ` — ${item.motivo}` : ""}`);
    });

    ensureSpace(doc, 80);
    sectionTitle(doc, "Documentos y correos pendientes");
    fieldLine(doc, "¿Que documentos tiene pendientes de entregar el cliente?", cb.documentosPendientes);
    fieldLine(doc, "¿Que correos electronicos o enlaces tiene pendientes el cliente?", cb.correosPendientes);

    doc.end();
  });
}
