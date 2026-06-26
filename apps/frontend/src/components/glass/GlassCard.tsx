"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { GlassSurface } from "./GlassSurface";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Activa el realce al pasar el cursor. */
  interactive?: boolean;
}

/**
 * Tarjeta glass con padding y radios estandar. Con hover opcional (sombra + lift).
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, interactive = false, children, ...props }, ref) => {
    return (
      <GlassSurface
        ref={ref}
        className={cn(
          "rounded-2xl p-5 shadow-glass transition-all duration-200",
          interactive &&
            "hover:-translate-y-0.5 hover:shadow-glass-lg cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </GlassSurface>
    );
  }
);

GlassCard.displayName = "GlassCard";
