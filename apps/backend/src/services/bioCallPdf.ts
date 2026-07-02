import type { BioCall } from "@biocall/shared";
import { buildBioCallPdfNames } from "@biocall/shared";
import {
  generateBioCallPdf,
  BIO_CALL_PDF_TEMPLATE_VERSION,
} from "@biocall/pdf";
import { recordGeneratedPdf } from "@biocall/database";
import { env } from "../env";
import { uploadPdf } from "./storage";

export async function generateAndStoreBioCallPdf(
  bioCallId: string,
  data: BioCall
): Promise<{
  storagePath: string;
  downloadFilename: string;
  generatedAt: Date;
  fileSizeBytes: number;
}> {
  const generatedAt = new Date();
  const buffer = await generateBioCallPdf(data, {
    logoPath: env.logoPath,
    generatedAt,
  });

  const { storagePath, downloadFilename } = buildBioCallPdfNames({
    bioCallId,
    personalData: data.personalData,
    generatedAt,
  });
  await uploadPdf(storagePath, buffer);

  const record = await recordGeneratedPdf({
    bioCallId,
    storagePath,
    downloadFilename,
    templateVersion: BIO_CALL_PDF_TEMPLATE_VERSION,
    fileSizeBytes: buffer.length,
  });

  return {
    storagePath,
    downloadFilename,
    generatedAt: record.generatedAt,
    fileSizeBytes: buffer.length,
  };
}
