import { z } from "zod";

/** Letras (incl. acentos), espacios, guion y apostrofe. Rechaza digitos y simbolos raros. */
const PERSON_NAME_REGEX = /^[A-Za-zÀ-ÿ\u00f1\u00d1][A-Za-zÀ-ÿ\u00f1\u00d1\s'.-]*$/;

const MSG_PERSON_NAME =
  "Solo letras, espacios, guiones y apostrofes. No se permiten numeros ni simbolos como # o _.";

const MSG_ISO_DATE =
  "Ingresa una fecha valida entre 1900 y hoy (formato AAAA-MM-DD).";

const MSG_ISO_DATE_FUTURE =
  "Ingresa una fecha de expiracion valida (formato AAAA-MM-DD), hoy o en el futuro.";

const MSG_EMAIL = "Ingresa un correo valido (ej. nombre@dominio.com).";

const MSG_PHONE =
  "Ingresa un telefono valido (7 a 20 digitos; puedes usar guiones o espacios).";

const MSG_POSTAL =
  "Codigo postal invalido (3 a 15 caracteres alfanumericos o guion).";

function isBlank(value: string): boolean {
  return value.trim() === "";
}

function parseIsoDateParts(value: string): { year: number; month: number; day: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1900 || year > 2100) return null;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function isValidIsoDateString(value: string): boolean {
  const parts = parseIsoDateParts(value);
  if (!parts) return false;
  const date = new Date(parts.year, parts.month - 1, parts.day);
  return date <= new Date();
}

function isValidPastIsoDateString(value: string): boolean {
  return isValidIsoDateString(value);
}

function isValidFutureIsoDateString(value: string): boolean {
  const parts = parseIsoDateParts(value);
  if (!parts) return false;
  const date = new Date(parts.year, parts.month - 1, parts.day);
  return date >= startOfToday();
}

export const personName = z
  .string()
  .trim()
  .refine((v) => isBlank(v) || PERSON_NAME_REGEX.test(v), { message: MSG_PERSON_NAME });

export const optionalPersonName = z
  .string()
  .trim()
  .refine((v) => isBlank(v) || PERSON_NAME_REGEX.test(v), { message: MSG_PERSON_NAME });

export const requiredPersonName = personName.refine((v) => !isBlank(v), {
  message: "Este campo es obligatorio.",
});

export const isoDate = z
  .string()
  .trim()
  .refine((v) => isValidIsoDateString(v), { message: MSG_ISO_DATE });

export const optionalIsoDate = z
  .string()
  .trim()
  .refine((v) => isBlank(v) || isValidIsoDateString(v), { message: MSG_ISO_DATE });

export const isoDatePast = z
  .string()
  .trim()
  .refine((v) => isValidPastIsoDateString(v), { message: MSG_ISO_DATE });

export const optionalIsoDatePast = z
  .string()
  .trim()
  .refine((v) => isBlank(v) || isValidPastIsoDateString(v), { message: MSG_ISO_DATE });

export const optionalIsoDateFuture = z
  .string()
  .trim()
  .refine((v) => isBlank(v) || isValidFutureIsoDateString(v), {
    message: MSG_ISO_DATE_FUTURE,
  });

export function maxText(max: number) {
  return z
    .string()
    .trim()
    .max(max, { message: `Maximo ${max} caracteres.` });
}

export const freeTextDate = maxText(100);

export const freeText = maxText(500);

export const shortText = maxText(200);

export const email = z
  .string()
  .trim()
  .refine((v) => isBlank(v) || z.string().email().safeParse(v).success, {
    message: MSG_EMAIL,
  });

export const requiredEmail = z
  .string()
  .trim()
  .min(1, { message: "El correo electronico es obligatorio." })
  .refine((v) => z.string().email().safeParse(v).success, { message: MSG_EMAIL });

export const phone = z
  .string()
  .trim()
  .refine(
    (v) => {
      if (isBlank(v)) return true;
      if (!/^[\d\s().+-]+$/.test(v)) return false;
      const digits = v.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 20;
    },
    { message: MSG_PHONE }
  );

export const requiredPhone = z
  .string()
  .trim()
  .min(1, { message: "El telefono es obligatorio." })
  .refine(
    (v) => {
      if (!/^[\d\s().+-]+$/.test(v)) return false;
      const digits = v.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 20;
    },
    { message: MSG_PHONE }
  );

export const postalCode = z
  .string()
  .trim()
  .refine(
    (v) => isBlank(v) || (/^[A-Za-z0-9-]{3,15}$/.test(v) && !/[+#_]/.test(v)),
    { message: MSG_POSTAL }
  );

export const requiredPostalCode = z
  .string()
  .trim()
  .min(1, { message: "El codigo postal es obligatorio." })
  .refine((v) => /^[A-Za-z0-9-]{3,15}$/.test(v) && !/[+#_]/.test(v), {
    message: MSG_POSTAL,
  });

export const yesNo = z
  .string()
  .trim()
  .refine((v) => isBlank(v) || v === "si" || v === "no", {
    message: "Selecciona Si o No.",
  });

export const yesNoParcial = z
  .string()
  .trim()
  .refine((v) => isBlank(v) || v === "si" || v === "no" || v === "parcial", {
    message: "Selecciona Si, No o Parcial.",
  });

export const yesNoSabe = z
  .string()
  .trim()
  .refine((v) => isBlank(v) || v === "si" || v === "no" || v === "no_sabe", {
    message: "Selecciona una opcion valida.",
  });

export const passportNumber = z
  .string()
  .trim()
  .refine((v) => isBlank(v) || /^[A-Za-z0-9]{5,15}$/.test(v), {
    message: "Numero de pasaporte invalido (5 a 15 caracteres alfanumericos).",
  });

export const aNumber = z
  .string()
  .trim()
  .refine((v) => isBlank(v) || /^\d{9}$/.test(v.replace(/\D/g, "")), {
    message: "El A-Number debe tener 9 digitos.",
  });

export const ssn = z
  .string()
  .trim()
  .refine(
    (v) =>
      isBlank(v) ||
      /^\d{9}$/.test(v.replace(/\D/g, "")) ||
      /^\d{3}-\d{2}-\d{4}$/.test(v),
    { message: "SSN invalido (9 digitos o formato XXX-XX-XXXX)." }
  );

export const eadNumber = z
  .string()
  .trim()
  .refine((v) => isBlank(v) || /^[A-Za-z0-9]{8,15}$/.test(v), {
    message: "Numero de EAD invalido (8 a 15 caracteres alfanumericos).",
  });

export const sexo = z
  .string()
  .trim()
  .refine(
    (v) =>
      isBlank(v) ||
      v === "Femenino" ||
      v === "Masculino" ||
      v === "Otro",
    { message: "Selecciona un sexo valido." }
  );

export const estadoCivil = z
  .string()
  .trim()
  .refine(
    (v) =>
      isBlank(v) ||
      [
        "Soltero(a)",
        "Casado(a)",
        "Divorciado(a)",
        "Viudo(a)",
        "Union libre",
        "Unión libre",
      ].includes(v),
    { message: "Selecciona un estado civil valido." }
  );
