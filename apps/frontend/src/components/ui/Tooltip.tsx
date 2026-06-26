"use client";

import { type ReactNode } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

/**
 * Provider global de tooltips. Envolver la app una sola vez.
 */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <RadixTooltip.Provider delayDuration={200}>
      {children}
    </RadixTooltip.Provider>
  );
}

/**
 * Tooltip basado en Radix UI con el estilo del sistema NOVA.
 */
export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={6}
          className="z-[90] rounded-lg bg-gray-900/80 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur data-[state=delayed-open]:animate-fade-in"
        >
          {content}
          <RadixTooltip.Arrow className="fill-gray-900/80" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
