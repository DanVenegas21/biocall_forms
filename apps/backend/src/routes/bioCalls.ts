import { Router } from "express";
import { BIO_CALL_SECTIONS, bioCallSchema } from "@biocall/shared";
import { saveBioCall, getCurrentPdfRecord } from "@biocall/database";
import { generateAndStoreBioCallPdf } from "../services/bioCallPdf";
import { downloadPdf, getPdfSignedUrl } from "../services/storage";

/**
 * Rutas de la Bio Call.
 */
export const bioCallsRouter = Router();

/** Devuelve la estructura de secciones esperada por el formulario. */
bioCallsRouter.get("/sections", (_req, res) => {
  res.json({ ok: true, data: BIO_CALL_SECTIONS });
});

/** Crear / actualizar una Bio Call, generar PDF y guardar metadatos. */
bioCallsRouter.post("/", async (req, res) => {
  const existingId =
    typeof req.body?.bioCallId === "string" && req.body.bioCallId.trim()
      ? req.body.bioCallId.trim()
      : undefined;

  const result = bioCallSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      ok: false,
      error: "Datos del formulario inválidos",
      details: result.error.format(),
    });
  }

  try {
    const { id } = await saveBioCall(result.data, existingId);
    const pdf = await generateAndStoreBioCallPdf(id, result.data);

    return res.json({
      ok: true,
      message: "Bio Call guardada y PDF generado",
      data: {
        id,
        pdf: {
          storagePath: pdf.storagePath,
          generatedAt: pdf.generatedAt.toISOString(),
          fileSizeBytes: pdf.fileSizeBytes,
        },
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[backend] Error al guardar Bio Call:", error);
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Error interno al guardar",
    });
  }
});

/** Descargar el PDF actual de una Bio Call. */
bioCallsRouter.get("/:id/pdf", async (req, res) => {
  const { id } = req.params;

  try {
    const record = await getCurrentPdfRecord(id);
    if (!record) {
      return res.status(404).json({ ok: false, error: "PDF no encontrado para esta Bio Call" });
    }

    const signedUrl = await getPdfSignedUrl(record.storagePath);
    if (signedUrl) {
      return res.redirect(signedUrl);
    }

    const buffer = await downloadPdf(record.storagePath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="bio-call-${id}.pdf"`
    );
    return res.send(buffer);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[backend] Error al obtener PDF:", error);
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Error al obtener PDF",
    });
  }
});
