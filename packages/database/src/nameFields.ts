export function nullToEmpty(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

/**
 * Lee nombres separados; si no existen, usa columna legacy concatenada en `nombres`.
 */
export function readSplitName(
  nombres: string | null | undefined,
  apellidoPaterno: string | null | undefined,
  apellidoMaterno: string | null | undefined,
  legacyFull: string | null | undefined
): { nombres: string; apellidoPaterno: string; apellidoMaterno: string } {
  const hasSplit =
    nullToEmpty(nombres) !== "" ||
    nullToEmpty(apellidoPaterno) !== "" ||
    nullToEmpty(apellidoMaterno) !== "";

  if (hasSplit) {
    return {
      nombres: nullToEmpty(nombres),
      apellidoPaterno: nullToEmpty(apellidoPaterno),
      apellidoMaterno: nullToEmpty(apellidoMaterno),
    };
  }

  return {
    nombres: nullToEmpty(legacyFull),
    apellidoPaterno: "",
    apellidoMaterno: "",
  };
}
