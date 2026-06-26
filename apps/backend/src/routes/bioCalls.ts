import { Router } from "express";
import { BIO_CALL_SECTIONS } from "@biocall/shared";

/**
 * Rutas de la Bio Call. Esqueleto: la logica de negocio (crear, guardar,
 * recuperar) se implementara en fases posteriores.
 */
export const bioCallsRouter = Router();

/** Devuelve la estructura de secciones esperada por el formulario. */
bioCallsRouter.get("/sections", (_req, res) => {
  res.json({ ok: true, data: BIO_CALL_SECTIONS });
});

/** Crear / guardar una Bio Call. Aun no implementado. */
bioCallsRouter.post("/", (_req, res) => {
  res.status(501).json({ ok: false, error: "No implementado" });
});
