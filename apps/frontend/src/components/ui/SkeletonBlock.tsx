import { cn } from "@/lib/cn";

export interface SkeletonBlockProps {
  className?: string;
  /** Texto descriptivo para lectores de pantalla. */
  label?: string;
}

/**
 * Bloque individual de carga con barrido animado.
 */
export function SkeletonBlock({ className, label }: SkeletonBlockProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={cn(
        "relative overflow-hidden rounded-xl bg-brand-100/70",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-skeleton-sweep motion-reduce:animate-none"
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}
