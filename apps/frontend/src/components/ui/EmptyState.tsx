"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
  className?: string;
}

/**
 * Estado vacio sobre panel solido centrado, con animacion de entrada suave.
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "solid-panel rounded-3xl flex flex-col items-center justify-center text-center",
        compact ? "px-6 py-8" : "px-8 py-14",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500"
      >
        {icon ?? <FileText className="h-7 w-7" />}
      </span>
      <h3 className="panel-section-title">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-md text-sm text-brand-600/80">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
