/**
 * Utilidad minima para concatenar clases condicionales sin dependencias externas.
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
