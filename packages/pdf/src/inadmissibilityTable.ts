import PDFDocument from "pdfkit";
import type { CaseBackground } from "@biocall/shared";
import { getAffirmativeInadAnswers } from "@biocall/shared";

type PdfDoc = InstanceType<typeof PDFDocument>;

const NO_AFFIRMATIVE_MESSAGE =
  "Sin respuestas afirmativas en el cuestionario de inadmisibilidad.";

const TABLE_COLUMNS = {
  number: 28,
  answer: 52,
  gap: 6,
  rowMinHeight: 22,
  headerHeight: 20,
} as const;

export function formatYesNoSabe(value: string | undefined | null): string {
  switch (value?.trim()) {
    case "si":
      return "Sí";
    case "no":
      return "No";
    case "no_sabe":
      return "No sabe";
    default:
      return "—";
  }
}

function contentWidth(doc: PdfDoc): number {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}

function questionColumnWidth(doc: PdfDoc): number {
  return (
    contentWidth(doc) -
    TABLE_COLUMNS.number -
    TABLE_COLUMNS.answer -
    TABLE_COLUMNS.gap * 2
  );
}

function columnX(doc: PdfDoc): { number: number; question: number; answer: number } {
  const left = doc.page.margins.left;
  const questionWidth = questionColumnWidth(doc);
  return {
    number: left,
    question: left + TABLE_COLUMNS.number + TABLE_COLUMNS.gap,
    answer: left + TABLE_COLUMNS.number + TABLE_COLUMNS.gap + questionWidth + TABLE_COLUMNS.gap,
  };
}

function ensureSpace(doc: PdfDoc, minHeight = 60): void {
  if (doc.y > doc.page.height - doc.page.margins.bottom - minHeight) {
    doc.addPage();
  }
}

function sectionTitle(doc: PdfDoc, title: string): void {
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#1e3a5f").text(title);
  doc.moveDown(0.25);
  doc.font("Helvetica").fontSize(10).fillColor("#000000");
}

function resetCursor(doc: PdfDoc, y: number): void {
  doc.x = doc.page.margins.left;
  doc.y = y;
}

function questionCellText(row: ReturnType<typeof getAffirmativeInadAnswers>[number]): string {
  if (row.detail) {
    return `${row.question}\n${row.detail}`;
  }
  return row.question;
}

function drawHorizontalRule(doc: PdfDoc, y: number, color = "#c5cdd6"): void {
  const startX = doc.page.margins.left;
  doc
    .strokeColor(color)
    .lineWidth(0.5)
    .moveTo(startX, y)
    .lineTo(startX + contentWidth(doc), y)
    .stroke();
}

function drawTableHeader(doc: PdfDoc): void {
  ensureSpace(doc, TABLE_COLUMNS.headerHeight + 40);

  const cols = columnX(doc);
  const questionWidth = questionColumnWidth(doc);
  const startY = doc.y;

  doc.font("Helvetica-Bold").fontSize(9).fillColor("#1e3a5f");
  doc.text("#", cols.number, startY, { width: TABLE_COLUMNS.number, lineBreak: false });
  doc.text("Pregunta", cols.question, startY, { width: questionWidth, lineBreak: false });
  doc.text("Respuesta", cols.answer, startY, {
    width: TABLE_COLUMNS.answer,
    lineBreak: false,
  });

  const lineY = startY + TABLE_COLUMNS.headerHeight;
  drawHorizontalRule(doc, lineY, "#5c6b7a");

  resetCursor(doc, lineY + 6);
  doc.font("Helvetica").fontSize(10).fillColor("#000000");
}

function drawTableRow(
  doc: PdfDoc,
  row: ReturnType<typeof getAffirmativeInadAnswers>[number]
): void {
  const cols = columnX(doc);
  const questionWidth = questionColumnWidth(doc);
  const questionText = questionCellText(row);
  const answerText = formatYesNoSabe(row.answer);

  doc.font("Helvetica").fontSize(9);
  const questionHeight = doc.heightOfString(questionText, {
    width: questionWidth,
    lineGap: 1,
  });
  const answerHeight = doc.heightOfString(answerText, {
    width: TABLE_COLUMNS.answer,
    lineGap: 1,
  });
  const rowHeight = Math.max(
    TABLE_COLUMNS.rowMinHeight,
    questionHeight + TABLE_COLUMNS.gap,
    answerHeight + TABLE_COLUMNS.gap
  );

  ensureSpace(doc, rowHeight + 8);

  const startY = doc.y;

  doc.font("Helvetica").fontSize(9).fillColor("#000000");
  doc.text(String(row.number), cols.number, startY, {
    width: TABLE_COLUMNS.number,
    lineBreak: false,
  });

  doc.text(questionText, cols.question, startY, {
    width: questionWidth,
    lineGap: 1,
  });

  doc.font("Helvetica-Bold").text(answerText, cols.answer, startY, {
    width: TABLE_COLUMNS.answer,
    lineBreak: false,
  });

  const lineY = startY + rowHeight;
  drawHorizontalRule(doc, lineY);

  resetCursor(doc, lineY + 6);
  doc.font("Helvetica").fontSize(10).fillColor("#000000");
}

export function renderInadmissibilitySection(doc: PdfDoc, caseBackground: CaseBackground): void {
  sectionTitle(doc, "Cuestionario de inadmisibilidad");

  const affirmativeRows = getAffirmativeInadAnswers(caseBackground);

  if (affirmativeRows.length === 0) {
    doc.font("Helvetica").fontSize(10).fillColor("#000000").text(NO_AFFIRMATIVE_MESSAGE, {
      lineGap: 2,
    });
    return;
  }

  drawTableHeader(doc);

  for (const row of affirmativeRows) {
    drawTableRow(doc, row);
  }
}
