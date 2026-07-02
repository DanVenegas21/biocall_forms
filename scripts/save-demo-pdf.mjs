import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const API_BASE = process.env.BIOCALL_API_URL ?? "http://localhost:4000";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const demoPath = join(root, "apps/frontend/public/demo-biocall-draft.json");
const outDir = join(root, "output");
const outFile = join(outDir, "demo-biocall.pdf");

const raw = JSON.parse(await readFile(demoPath, "utf8"));

console.log("Guardando Bio Call demo en", API_BASE, "…");

const saveRes = await fetch(`${API_BASE}/api/bio-calls`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(raw),
});

const saveBody = await saveRes.json();

if (!saveRes.ok || !saveBody.ok) {
  console.error("Error al guardar:", JSON.stringify(saveBody, null, 2));
  process.exit(1);
}

const bioCallId = saveBody.data.id;
console.log("Bio Call guardada:", bioCallId);
console.log("PDF generado:", saveBody.data.pdf.fileSizeBytes, "bytes");

console.log("Descargando PDF…");

const pdfRes = await fetch(`${API_BASE}/api/bio-calls/${bioCallId}/pdf`, {
  redirect: "follow",
});

if (!pdfRes.ok) {
  const errText = await pdfRes.text();
  console.error("Error al descargar PDF:", pdfRes.status, errText.slice(0, 500));
  process.exit(1);
}

const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());
if (pdfBuffer.subarray(0, 4).toString() !== "%PDF") {
  console.error("La respuesta no parece un PDF valido.");
  process.exit(1);
}

await mkdir(outDir, { recursive: true });
await writeFile(outFile, pdfBuffer);

console.log("\nListo. PDF guardado en:");
console.log(outFile);
console.log("\nAbrir en Windows:");
console.log(`start "" "${outFile}"`);
