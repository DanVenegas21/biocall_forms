import type { BioCall } from "./schemas";
import type { BioCallFieldError } from "./validation/formatErrors";

/** Estado de avance de una Bio Call. */
export type BioCallStatus = "draft" | "in_review" | "completed";

/** Representacion de una Bio Call persistida. */
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

export interface BioCallPdfMeta {
  storagePath: string;
  downloadFilename: string;
  generatedAt: string;
  fileSizeBytes: number;
}

export interface BioCallSaveResult {
  id: string;
  pdf: BioCallPdfMeta;
}

export type BioCallSaveResponse =
  | { ok: true; message: string; data: BioCallSaveResult }
  | BioCallValidationErrorResponse
  | { ok: false; error: string };

export interface BioCallValidationErrorResponse {
  ok: false;
  error: string;
  fieldErrors: BioCallFieldError[];
  errorMap: Record<string, string>;
}

export type BioCallGetResponse =
  | { ok: true; data: BioCallRecord }
  | { ok: false; error: string };
