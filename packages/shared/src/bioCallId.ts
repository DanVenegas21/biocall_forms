import type { PersonalData } from "./schemas";
import { buildNameSlug } from "./nameSlug";

export function formatCompactDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export function formatDownloadDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export interface BuildBioCallIdBaseParams {
  personalData: Pick<PersonalData, "apellidoPaterno" | "apellidoMaterno" | "nombres">;
  createdAt: Date;
}

/** ID legible base: slug del cliente + fecha YYYYMMDD. */
export function buildBioCallIdBase(params: BuildBioCallIdBaseParams): string {
  const slug = buildNameSlug(params.personalData);
  return `${slug}-${formatCompactDate(params.createdAt)}`;
}

/**
 * Candidato de ID con sufijo numerico en colisiones.
 * attempt 1 → base; attempt 2 → base-02; attempt 3 → base-03.
 */
export function buildBioCallIdCandidate(base: string, attempt: number): string {
  if (attempt <= 1) return base;
  return `${base}-${String(attempt).padStart(2, "0")}`;
}
