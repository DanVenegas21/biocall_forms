import { getFieldLabel } from "@biocall/shared";

interface SectionErrorBannerProps {
  errors?: Record<string, string>;
  prefix: string;
}

/** Muestra errores de validacion de una seccion cuando no hay inline en cada campo. */
export function SectionErrorBanner({ errors, prefix }: SectionErrorBannerProps) {
  const items = Object.entries(errors ?? {}).filter(([path]) => path.startsWith(`${prefix}.`));
  if (items.length === 0) return null;

  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 mb-4"
      role="alert"
    >
      <ul className="list-disc pl-4 space-y-1">
        {items.map(([path, message]) => (
          <li key={path}>
            <span className="font-medium">{getFieldLabel(path)}</span>: {message}
          </li>
        ))}
      </ul>
    </div>
  );
}
