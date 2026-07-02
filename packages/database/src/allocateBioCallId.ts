import type { BioCall } from "@biocall/shared";
import { buildBioCallIdBase, buildBioCallIdCandidate } from "@biocall/shared";
import { prisma } from "./client";

/** Asigna un ID legible unico para una nueva Bio Call. */
export async function allocateBioCallId(
  personalData: BioCall["personalData"],
  createdAt = new Date()
): Promise<string> {
  const base = buildBioCallIdBase({ personalData, createdAt });
  let attempt = 1;

  while (attempt < 1000) {
    const candidate = buildBioCallIdCandidate(base, attempt);
    const existing = await prisma.bioCall.findUnique({
      where: { id: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
    attempt += 1;
  }

  throw new Error("No se pudo asignar un ID legible unico para la Bio Call.");
}
