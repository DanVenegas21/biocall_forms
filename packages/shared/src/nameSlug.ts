import type { PersonalData } from "./schemas";

export const MAX_NAME_SLUG_LENGTH = 60;
export const FALLBACK_NAME_SLUG = "cliente";

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
  return trimmed || FALLBACK_NAME_SLUG;
}

/** Slug de apellidos + primer nombre para IDs y rutas legibles. */
export function buildNameSlug(
  personalData: Pick<PersonalData, "apellidoPaterno" | "apellidoMaterno" | "nombres">
): string {
  const primerNombre = personalData.nombres?.trim().split(/\s+/)[0] ?? "";
  const parts = [
    slugifyNamePart(personalData.apellidoPaterno),
    slugifyNamePart(personalData.apellidoMaterno),
    slugifyNamePart(primerNombre),
  ].filter(Boolean);

  const slug = parts.length > 0 ? parts.join("-") : FALLBACK_NAME_SLUG;
  return truncateSlug(slug, MAX_NAME_SLUG_LENGTH);
}

export function titleCaseSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}
