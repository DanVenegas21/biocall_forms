import { hasMeaningfulFormInput } from "@/lib/formErrors";

export const BIOCALL_DRAFT_KEY = "biocall_draft";

type DraftFormData = Parameters<typeof hasMeaningfulFormInput>[0];

/** Quita el borrador del almacenamiento local. */
export function clearBioCallDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(BIOCALL_DRAFT_KEY);
}

/**
 * Lee el borrador guardado. Si no hay datos reales, lo elimina y devuelve el formulario vacio.
 */
export function restoreBioCallDraft<T extends DraftFormData>(
  createEmpty: () => T,
  mergeDraft: (parsed: Record<string, unknown>) => T
): { data: T; recovered: boolean } {
  if (typeof window === "undefined") {
    return { data: createEmpty(), recovered: false };
  }

  const raw = localStorage.getItem(BIOCALL_DRAFT_KEY);
  if (!raw) {
    return { data: createEmpty(), recovered: false };
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const merged = mergeDraft(parsed);

    if (!hasMeaningfulFormInput(merged)) {
      clearBioCallDraft();
      return { data: createEmpty(), recovered: false };
    }

    return { data: merged, recovered: true };
  } catch {
    clearBioCallDraft();
    return { data: createEmpty(), recovered: false };
  }
}

/**
 * Persiste el borrador solo si hay datos reales del usuario; si no, lo borra.
 * Usar al editar y al cerrar/recargar la pagina (pagehide).
 */
export function persistBioCallDraft(data: DraftFormData): void {
  if (typeof window === "undefined") return;

  if (hasMeaningfulFormInput(data)) {
    localStorage.setItem(BIOCALL_DRAFT_KEY, JSON.stringify(data));
  } else {
    clearBioCallDraft();
  }
}
