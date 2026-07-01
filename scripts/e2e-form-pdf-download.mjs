/**
 * Prueba E2E: carga demo en el formulario, guarda y descarga PDF (mismo flujo que el usuario).
 * Uso: node scripts/e2e-form-pdf-download.mjs
 * Requiere frontend :3000 y backend :4000 en ejecución.
 */
import { chromium } from "playwright";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "packages/pdf/package.json"));
const pdfParse = require("pdf-parse");

const outDir = join(root, "output");
const outFile = join(outDir, "form-download-test.pdf");
const FRONTEND = process.env.FRONTEND_URL ?? "http://localhost:3000";
const API_BASE = process.env.BIOCALL_API_URL ?? "http://localhost:4000";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  console.log("1. Cargando demo Roberto en localStorage…");
  await page.goto(`${FRONTEND}/cargar-demo.html`, { waitUntil: "networkidle" });
  await page.waitForURL(`${FRONTEND}/`, { timeout: 15000 });

  console.log("2. Esperando formulario…");
  await page.getByRole("button", { name: "Guardar Bio Call", exact: true }).waitFor({
    state: "visible",
    timeout: 15000,
  });

  console.log("3. Guardando Bio Call…");
  await page.getByRole("button", { name: "Guardar Bio Call", exact: true }).click();

  await page.getByText("Bio Call guardada y PDF generado", { exact: false }).waitFor({
    timeout: 30000,
  });

  const downloadBtn = page.getByRole("button", { name: "Descargar PDF", exact: true });
  await downloadBtn.waitFor({ state: "visible", timeout: 5000 });
  const disabled = await downloadBtn.isDisabled();
  if (disabled) {
    throw new Error("El botón Descargar PDF sigue deshabilitado tras guardar.");
  }

  console.log("4. Descargando PDF desde el formulario…");
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 30000 }),
    downloadBtn.click(),
  ]);

  const path = await download.path();
  if (!path) throw new Error("No se recibió archivo de descarga.");
  const buffer = await readFile(path);
  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, buffer);

  if (buffer.subarray(0, 4).toString() !== "%PDF") {
    throw new Error("El archivo descargado no es un PDF valido.");
  }

  const parsed = await pdfParse(buffer);
  const embeddedText = parsed.text;
  const checks = [
    ["Plantilla v1.7", embeddedText.includes("Plantilla v1.7")],
    ["Roberto Antonio", embeddedText.includes("Roberto Antonio")],
    ["— Hijo 1 —", embeddedText.includes("— Hijo 1 —")],
    ["¿Cual es el nombre del hijo 1?", embeddedText.includes("¿Cual es el nombre del hijo 1?")],
    ["¿Cual es el apellido paterno del hijo 1?", embeddedText.includes("¿Cual es el apellido paterno del hijo 1?")],
    ["3 bloques de hijo", (embeddedText.match(/— Hijo \d —/g) ?? []).length === 3],
  ];

  console.log("\n5. Verificación del PDF descargado:");
  let ok = true;
  for (const [label, pass] of checks) {
    console.log(`   ${pass ? "OK" : "FALLO"}: ${label}`);
    if (!pass) ok = false;
  }

  console.log(`\nPDF guardado en: ${outFile}`);
  await browser.close();

  if (!ok) process.exit(1);
  console.log("\nPrueba E2E del formulario completada correctamente.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
