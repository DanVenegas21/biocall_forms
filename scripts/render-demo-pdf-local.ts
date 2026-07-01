import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bioCallSchema } from "@biocall/shared";
import { generateBioCallPdf } from "@biocall/pdf";

async function main(): Promise<void> {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const demoPath = join(root, "apps/frontend/public/demo-biocall-draft.json");
  const outDir = join(root, "output");
  const outFile = join(outDir, "demo-biocall.pdf");

  const raw = JSON.parse(await readFile(demoPath, "utf8"));
  const data = bioCallSchema.parse(raw);
  const clientName = [
    data.personalData.nombres,
    data.personalData.apellidoPaterno,
    data.personalData.apellidoMaterno,
  ]
    .filter(Boolean)
    .join(" ");

  const buffer = await generateBioCallPdf(data);
  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, buffer);

  console.log("Cliente:", clientName);
  console.log("Hijos:", data.family.hijos.length);
  console.log("Domicilios anteriores:", data.address.direccionesAnteriores.length);
  console.log("Empleos anteriores:", data.caseBackground.empleosAnteriores.length);
  console.log("PDF guardado en:", outFile);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
