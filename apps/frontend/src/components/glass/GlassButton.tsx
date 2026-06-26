"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type GlassButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "ai";

export type GlassButtonSize = "xs" | "sm" | "md" | "lg";

export interface GlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  iconOnly?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  isActive?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const sizeClasses: Record<GlassButtonSize, string> = {
  xs: "text-xs px-3 py-1",
  sm: "text-sm px-4 py-1.5",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-6 py-3",
};

const iconOnlySizeClasses: Record<GlassButtonSize, string> = {
  xs: "p-1.5",
  sm: "p-2",
  md: "p-2.5",
  lg: "p-3",
};

const variantClasses: Record<GlassButtonVariant, string> = {
  primary:
    "text-nova-snow bg-nova-horizon shadow-nova hover:bg-glow-gold hover:text-nova-slate hover:shadow-gold focus-visible:ring-brand-400",
  secondary:
    "text-brand-700 bg-white/85 border border-brand-100 shadow-sm hover:bg-white focus-visible:ring-brand-400",
  ghost:
    "text-brand-700 bg-brand-50/80 hover:bg-brand-100 focus-visible:ring-brand-400",
  danger:
    "text-white bg-red-600 shadow-sm hover:bg-red-700 focus-visible:ring-red-400",
  ai: "relative overflow-hidden text-nova-slate bg-glow-gold shadow-gold focus-visible:ring-accent-400",
};

/**
 * Boton pill base del sistema NOVA. Soporta variantes, tamanos, loading,
 * estado activo, ancho completo e iconos.
 */
export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      iconOnly = false,
      fullWidth = false,
      loading = false,
      isActive = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        data-active={isActive || undefined}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-semibold",
          "transition-all duration-200 active:scale-[0.98]",
          "disabled:opacity-50 disabled:pointer-events-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
          variantClasses[variant],
          isActive && "ring-2 ring-brand-400",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {variant === "ai" && !loading && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/40 blur-md animate-ai-cta-shine motion-reduce:animate-none"
          />
        )}
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {!iconOnly && children}
        {!loading && rightIcon}
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";
