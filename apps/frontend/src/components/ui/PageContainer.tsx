import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type PageContainerProps = HTMLAttributes<HTMLDivElement>;

/**
 * Contenedor principal de pagina con ancho maximo, padding responsive
 * y animacion de entrada. Compensa el header fijo.
 */
export function PageContainer({
  className,
  children,
  ...props
}: PageContainerProps) {
  return (
    <main
      id="main-content"
      className={cn(
        "page-container pt-[calc(var(--app-header-height)+1.5rem)]",
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
}
