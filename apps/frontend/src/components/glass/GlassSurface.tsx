"use client";

import { forwardRef, useEffect, useState, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { supportsLiquidGlass } from "@/lib/liquid-glass";

export interface GlassSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  /** Etiqueta HTML a renderizar. Por defecto div. */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Superficie translucida base (liquid glass). Detecta soporte de backdrop-filter
 * y aplica el degradado/blur correspondiente. Incluye borde claro y highlight superior.
 */
export const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({ as: Tag = "div", className, children, ...props }, ref) => {
    const [supported, setSupported] = useState(true);

    useEffect(() => {
      setSupported(supportsLiquidGlass());
    }, []);

    const Component = Tag as "div";

    return (
      <Component
        ref={ref}
        className={cn(
          "glass-edge-top border border-glass-border",
          supported ? "bg-white/10 backdrop-blur-glass" : "glass-fallback",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GlassSurface.displayName = "GlassSurface";
