import { cn } from "@/lib/cn";

interface FieldErrorProps {
  message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-600 mt-1" role="alert">
      {message}
    </p>
  );
}

export function fieldInputClass(hasError: boolean, className?: string) {
  return cn("input-glass", hasError && "border-red-400 ring-1 ring-red-300", className);
}
