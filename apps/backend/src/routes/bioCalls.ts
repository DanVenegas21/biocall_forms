import { Router } from "express";
import { BIO_CALL_SECTIONS, bioCallSchema } from "@biocall/shared";

/**
 * Rutas de la Bio Call.
 */
export const bioCallsRouter = Router();

/** Devuelve la estructura de secciones esperada por el formulario. */
bioCallsRouter.get("/sections", (_req, res) => {
  res.json({ ok: true, data: BIO_CALL_SECTIONS });
});

/** Crear / guardar una Bio Call con validación de esquema. */
bioCallsRouter.post("/", (req, res) => {
  const result = bioCallSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      ok: false,
      error: "Datos del formulario inválidos",
      details: result.error.format(),
    });
  }

  // Registro en consola de la recepción y validación exitosa
  // eslint-disable-next-line no-console
  console.log("[backend] Bio Call recibida y validada correctamente:", result.data);

  res.json({
    ok: true,
    message: "Datos recibidos y validados con éxito por el servidor",
    data: result.data,
  });
});

