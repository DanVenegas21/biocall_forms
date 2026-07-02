import { Router } from "express";
import { Prisma } from "@prisma/client";
import {
  BIO_CALL_SECTIONS,
  bioCallSaveSchema,
  formatBioCallErrors,
  fieldErrorsToMap,
  normalizeBioCallPayload,
} from "@biocall/shared";
import {
  saveBioCall,
  getBioCall,
  getCurrentPdfRecord,
  SaveBioCallValidationError,
} from "@biocall/database";
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

  const normalized = normalizeBioCallPayload(req.body);
  const result = bioCallSaveSchema.safeParse(normalized);
  if (!result.success) {
    const fieldErrors = formatBioCallErrors(result.error);
    return res.status(400).json({
      ok: false,
      error: "Revisa los campos marcados antes de guardar.",
      fieldErrors,
      errorMap: fieldErrorsToMap(fieldErrors),
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
          downloadFilename: pdf.downloadFilename,
          generatedAt: pdf.generatedAt.toISOString(),
          fileSizeBytes: pdf.fileSizeBytes,
        },
      },
    });
  } catch (error) {
    if (error instanceof SaveBioCallValidationError) {
      const fieldErrors = [
        {
          path: error.fieldPath,
          label: error.fieldPath,
          message: error.message,
        },
      ];
      return res.status(400).json({
        ok: false,
        error: "Revisa los campos marcados antes de guardar.",
        fieldErrors,
        errorMap: fieldErrorsToMap(fieldErrors),
      });
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2022"
    ) {
      return res.status(500).json({
        ok: false,
        error:
          "La base de datos no esta sincronizada con el codigo. Ejecuta 000 y luego 001 en Supabase, o: npm run db:reset --workspace @biocall/database",
      });
    }

    // eslint-disable-next-line no-console
    console.error("[backend] Error al guardar Bio Call:", error);
    return res.status(500).json({
      ok: false,
      error:
        "No se pudo guardar la Bio Call. Verifica los datos e intenta de nuevo.",
    });
  }
});

/** Obtener una Bio Call guardada por id. */
bioCallsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const record = await getBioCall(id);
    if (!record) {
      return res.status(404).json({ ok: false, error: "Bio Call no encontrada" });
    }

    return res.json({ ok: true, data: record });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[backend] Error al obtener Bio Call:", error);
    return res.status(500).json({
      ok: false,
      error: "No se pudo obtener la Bio Call. Intenta de nuevo.",
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

    const filename = record.downloadFilename ?? `bio-call-${id}.pdf`;
    const signedUrl = await getPdfSignedUrl(record.storagePath, filename);
    if (signedUrl) {
      return res.redirect(signedUrl);
    }

    const buffer = await downloadPdf(record.storagePath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${filename}"`
    );
    return res.send(buffer);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[backend] Error al obtener PDF:", error);
    return res.status(500).json({
      ok: false,
      error: "No se pudo obtener el PDF. Intenta de nuevo.",
    });
  }
});
