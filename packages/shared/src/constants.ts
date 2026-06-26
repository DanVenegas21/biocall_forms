/**
 * Constantes compartidas de la Bio Call.
 */

export const APP_NAME = "Bio Call" as const;
export const ORG_NAME = "Manuel Solis" as const;

/** Identificadores estables de cada seccion de la Bio Call. */
export const BIO_CALL_SECTION_IDS = [
  "datos-personales",
  "contacto",
  "domicilio",
  "documentos",
  "familia",
  "caso",
] as const;

export type BioCallSectionId = (typeof BIO_CALL_SECTION_IDS)[number];

export interface BioCallSectionMeta {
  id: BioCallSectionId;
  title: string;
  description: string;
}

/**
 * Metadatos de las secciones (sin elementos de UI). El frontend asocia
 * cada id con su icono y campos correspondientes.
 */
export const BIO_CALL_SECTIONS: readonly BioCallSectionMeta[] = [
  {
    id: "datos-personales",
    title: "Datos personales",
    description: "Nombre completo, fecha de nacimiento, nacionalidad.",
  },
  {
    id: "contacto",
    title: "Informacion de contacto",
    description: "Telefono, correo electronico y contacto alterno.",
  },
  {
    id: "domicilio",
    title: "Domicilio",
    description: "Direccion actual y tiempo de residencia.",
  },
  {
    id: "documentos",
    title: "Documentos e identificacion",
    description: "Identificaciones, numeros de expediente y migratorios.",
  },
  {
    id: "familia",
    title: "Informacion familiar",
    description: "Nucleo familiar y dependientes economicos.",
  },
  {
    id: "caso",
    title: "Antecedentes del caso",
    description: "Contexto legal y detalles relevantes para la Bio Call.",
  },
] as const;
