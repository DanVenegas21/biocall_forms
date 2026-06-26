"use client";

import { type ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/Tooltip";

/**
 * Proveedores globales del lado del cliente: tooltips y toasts.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(255, 255, 255, 0.92)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            color: "#143457",
            boxShadow: "0 20px 50px -18px rgba(10, 28, 48, 0.35)",
            borderRadius: "12px",
          },
          success: { iconTheme: { primary: "#1e3a5f", secondary: "#ffffff" } },
          error: { iconTheme: { primary: "#dc2626", secondary: "#ffffff" } },
        }}
      />
    </TooltipProvider>
  );
}
