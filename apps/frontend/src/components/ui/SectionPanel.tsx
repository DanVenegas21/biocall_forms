import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SolidCard } from "./SolidCard";

export interface SectionPanelProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  accent?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * Seccion de trabajo con cabecera (titulo, descripcion, accion opcional)
 * sobre un panel solido. Ideal para agrupar bloques del formulario.
 */
export function SectionPanel({
  title,
  description,
  icon,
  action,
  accent = false,
  className,
  children,
}: SectionPanelProps) {
  return (
    <SolidCard accent={accent} className={cn("space-y-4", className)}>
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {icon && (
            <span
              aria-hidden="true"
              className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"
            >
              {icon}
            </span>
          )}
          <div className="space-y-0.5">
            <h2 className="panel-section-title">{title}</h2>
            {description && (
              <p className="text-sm text-brand-600/80">{description}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      {children}
    </SolidCard>
  );
}
