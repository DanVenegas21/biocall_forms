import type { ZodError } from "zod";
import { bioCallSchema, bioCallSaveSchema } from "../schemas";
import { getFieldLabel } from "./labels";

export interface BioCallFieldError {
  path: string;
  label: string;
  message: string;
}

export interface BioCallValidationResult {
  ok: true;
  data: ReturnType<typeof bioCallSchema.parse>;
}

export interface BioCallValidationFailure {
  ok: false;
  fieldErrors: BioCallFieldError[];
  errorMap: Record<string, string>;
}

export type ValidateBioCallResult = BioCallValidationResult | BioCallValidationFailure;

function pathToString(path: (string | number)[]): string {
  return path
    .map((segment, index) =>
      typeof segment === "number" ? String(segment) : index === 0 ? segment : segment
    )
    .reduce<string>((acc, segment, index) => {
      if (index === 0) return String(segment);
      if (/^\d+$/.test(String(segment))) return `${acc}.${segment}`;
      return `${acc}.${segment}`;
    }, "");
}

export function formatBioCallErrors(error: ZodError): BioCallFieldError[] {
  const seen = new Set<string>();
  const fieldErrors: BioCallFieldError[] = [];

  for (const issue of error.issues) {
    const path = pathToString(issue.path);
    if (!path || seen.has(path)) continue;
    seen.add(path);
    fieldErrors.push({
      path,
      label: getFieldLabel(path),
      message: issue.message,
    });
  }

  return fieldErrors;
}

export function fieldErrorsToMap(
  fieldErrors: BioCallFieldError[]
): Record<string, string> {
  return Object.fromEntries(fieldErrors.map((e) => [e.path, e.message]));
}

export interface BioCallSaveValidationResult {
  ok: true;
  data: ReturnType<typeof bioCallSaveSchema.parse>;
}

export type ValidateBioCallSaveResult =
  | BioCallSaveValidationResult
  | BioCallValidationFailure;

export function validateBioCall(data: unknown): ValidateBioCallResult {
  const result = bioCallSchema.safeParse(data);
  if (result.success) {
    return { ok: true, data: result.data };
  }

  const fieldErrors = formatBioCallErrors(result.error);
  return {
    ok: false,
    fieldErrors,
    errorMap: fieldErrorsToMap(fieldErrors),
  };
}

export function validateBioCallSave(data: unknown): ValidateBioCallSaveResult {
  const result = bioCallSaveSchema.safeParse(data);
  if (result.success) {
    return { ok: true, data: result.data };
  }

  const fieldErrors = formatBioCallErrors(result.error);
  return {
    ok: false,
    fieldErrors,
    errorMap: fieldErrorsToMap(fieldErrors),
  };
}
