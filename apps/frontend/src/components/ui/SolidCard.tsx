import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface SolidCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Superficie blanca solida para contenido denso (formularios largos). */
  reading?: boolean;
  /** Franja de acento superior con degradado nova-horizon. */
  accent?: boolean;
}

/**
 * Panel solido semitransparente. Pensado para paneles de trabajo y formularios.
 */
export const SolidCard = forwardRef<HTMLDivElement, SolidCardProps>(
  ({ reading = false, accent = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          reading ? "reading-surface" : "solid-panel",
          accent && "section-panel-accent",
          "p-5 sm:p-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SolidCard.displayName = "SolidCard";
