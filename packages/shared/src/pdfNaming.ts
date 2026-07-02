import type { PersonalData } from "./schemas";
import { formatDownloadDate } from "./bioCallId";
import { buildNameSlug, titleCaseSlug } from "./nameSlug";

export { slugifyNamePart } from "./nameSlug";

export interface BuildBioCallPdfNamesParams {
  bioCallId: string;
  personalData: Pick<PersonalData, "apellidoPaterno" | "apellidoMaterno" | "nombres">;
  generatedAt: Date;
}

export interface BioCallPdfNames {
  storagePath: string;
  downloadFilename: string;
}

/** Rutas legibles para Storage y nombre de descarga en navegador. */
export function buildBioCallPdfNames(params: BuildBioCallPdfNamesParams): BioCallPdfNames {
  const slug = buildNameSlug(params.personalData);
  const downloadDate = formatDownloadDate(params.generatedAt);
  const displaySlug = titleCaseSlug(slug);
  const storageFile = `biocall-${params.bioCallId}.pdf`;

  return {
    storagePath: `bio-calls/${params.bioCallId}/${storageFile}`,
    downloadFilename: `BioCall-${displaySlug}-${downloadDate}.pdf`,
  };
}
