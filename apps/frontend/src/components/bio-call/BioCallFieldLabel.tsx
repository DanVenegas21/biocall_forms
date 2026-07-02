import { getFieldQuestion } from "@biocall/shared";
import { cn } from "@/lib/cn";

interface BioCallFieldLabelProps {
  /** Path de validación, ej. personalData.nombres o family.hijos.0.nombres */
  path: string;
  htmlFor?: string;
  className?: string;
}

/** Etiqueta de campo en formato pregunta (misma fuente que PDF y validación). */
export function BioCallFieldLabel({ path, htmlFor, className }: BioCallFieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className={cn("label-caps", className)}>
      {getFieldQuestion(path)}
    </label>
  );
}
