import type { BioCall } from "./schemas";

/** Estado de avance de una Bio Call. */
export type BioCallStatus = "draft" | "in_review" | "completed";

/** Representacion de una Bio Call persistida (esqueleto). */
export interface BioCallRecord {
  id: string;
  status: BioCallStatus;
  data: BioCall;
  createdAt: string;
  updatedAt: string;
}

/** Envoltura estandar de respuestas de la API. */
export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
