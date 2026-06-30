import type { BioCall } from "@biocall/shared";
import {
  generateBioCallPdf,
  BIO_CALL_PDF_TEMPLATE_VERSION,
} from "@biocall/pdf";
import { recordGeneratedPdf } from "@biocall/database";
import { env } from "../env";
import { buildPdfStoragePath, uploadPdf } from "./storage";

export async function generateAndStoreBioCallPdf(
  bioCallId: string,
  data: BioCall
): Promise<{ storagePath: string; generatedAt: Date; fileSizeBytes: number }> {
  const buffer = await generateBioCallPdf(data, {
    logoPath: env.logoPath,
    generatedAt: new Date(),
  });

  const storagePath = buildPdfStoragePath(bioCallId);
  await uploadPdf(storagePath, buffer);

  const record = await recordGeneratedPdf({
    bioCallId,
    storagePath,
    templateVersion: BIO_CALL_PDF_TEMPLATE_VERSION,
    fileSizeBytes: buffer.length,
  });

  return {
    storagePath,
    generatedAt: record.generatedAt,
    fileSizeBytes: buffer.length,
  };
}
