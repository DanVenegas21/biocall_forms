const YES_NO_SABE = new Set(["si", "no", "no_sabe", ""]);

/**
 * Normaliza el body del POST antes de validar/guardar.
 * - Mueve texto libre de inadMyUscis a inadMyUscisDetalle (compatibilidad con frontend actual).
 */
export function normalizeBioCallPayload(body: unknown): unknown {
  if (!body || typeof body !== "object") return body;

  const record = body as Record<string, unknown>;
  const caseBackground = record.caseBackground;
  if (!caseBackground || typeof caseBackground !== "object") return body;

  const cb = { ...(caseBackground as Record<string, unknown>) };
  const inadMyUscis = cb.inadMyUscis;

  if (typeof inadMyUscis === "string" && !YES_NO_SABE.has(inadMyUscis.trim())) {
    cb.inadMyUscisDetalle = inadMyUscis.trim();
    cb.inadMyUscis = "si";
  }

  if (cb.inadMyUscisDetalle === undefined) {
    cb.inadMyUscisDetalle = "";
  }

  return { ...record, caseBackground: cb };
}
