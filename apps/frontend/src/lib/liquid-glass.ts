/**
 * Deteccion pragmatica de soporte para el efecto "liquid glass".
 * Si el navegador no soporta backdrop-filter, los componentes glass
 * caen al estilo .glass-fallback (degradado + blur basico).
 */
export function supportsLiquidGlass(): boolean {
  if (typeof window === "undefined" || !("CSS" in window)) {
    return false;
  }
  return (
    CSS.supports("backdrop-filter", "blur(16px)") ||
    CSS.supports("-webkit-backdrop-filter", "blur(16px)")
  );
}
