import type { PersonalData } from "./schemas";

const MAX_SLUG_LENGTH = 60;
const FALLBACK_SLUG = "cliente";

/** Normaliza texto a slug ASCII en minusculas (apellidos, nombres). */
export function slugifyNamePart(value: string | null | undefined): string {
  if (!value?.trim()) return "";
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function truncateSlug(slug: string, maxLength: number): string {
  if (slug.length <= maxLength) return slug;
  const trimmed = slug.slice(0, maxLength).replace(/-+$/g, "");
  return trimmed || FALLBACK_SLUG;
}

function buildNameSlug(
  personalData: Pick<PersonalData, "apellidoPaterno" | "apellidoMaterno" | "nombres">
): string {
  const primerNombre = personalData.nombres?.trim().split(/\s+/)[0] ?? "";
  const parts = [
    slugifyNamePart(personalData.apellidoPaterno),
    slugifyNamePart(personalData.apellidoMaterno),
    slugifyNamePart(primerNombre),
  ].filter(Boolean);

  const slug = parts.length > 0 ? parts.join("-") : FALLBACK_SLUG;
  return truncateSlug(slug, MAX_SLUG_LENGTH);
}

function titleCaseSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}

function shortBioCallId(bioCallId: string): string {
  return bioCallId.replace(/-/g, "").slice(0, 8).toLowerCase();
}

function formatStorageDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function formatDownloadDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export interface BuildBioCallPdfNamesParams {
  bioCallId: string;
  personalData: Pick<PersonalData, "apellidoPaterno" | "apellidoMaterno" | "nombres">;
  generatedAt: Date;
}

export interface BioCallPdfNames {
  storagePath: string;
  downloadFilename: string;
}

/** Rutas legibles para Storage y nombre de descarga en navegador. */
export function buildBioCallPdfNames(params: BuildBioCallPdfNamesParams): BioCallPdfNames {
  const slug = buildNameSlug(params.personalData);
  const shortId = shortBioCallId(params.bioCallId);
  const storageDate = formatStorageDate(params.generatedAt);
  const downloadDate = formatDownloadDate(params.generatedAt);
  const folder = `${slug}-${shortId}`;
  const storageFile = `biocall-${slug}-${storageDate}.pdf`;
  const displaySlug = titleCaseSlug(slug);

  return {
    storagePath: `bio-calls/${folder}/${storageFile}`,
    downloadFilename: `BioCall-${displaySlug}-${downloadDate}.pdf`,
  };
}
