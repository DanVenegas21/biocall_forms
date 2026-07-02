/**
 * Resetea Bio Call con esquema JSONB (000 + 002), inserta demo Roberto y muestra el resultado.
 * Uso: node scripts/seed-jsonb-demo.mjs
 */
import { execSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dbDir = join(root, "packages/database");

dotenv.config({ path: join(dbDir, ".env") });

const prisma = new PrismaClient();

function runSql(file) {
  console.log(`\n▶ Ejecutando ${file}…`);
  execSync(
    `npx prisma db execute --file sql/${file} --schema prisma/schema.prisma`,
    { cwd: dbDir, stdio: "inherit", env: process.env }
  );
}

function slugify(text) {
  return (text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildBioCallIdBase(personalData) {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const slug = [
    slugify(personalData.apellidoPaterno),
    slugify(personalData.apellidoMaterno),
    slugify(personalData.nombres.split(/\s+/)[0]),
  ]
    .filter(Boolean)
    .join("-");
  return `${slug}-${y}${m}${d}`;
}

async function allocateId(personalData) {
  const base = buildBioCallIdBase(personalData);
  for (let attempt = 1; attempt <= 99; attempt++) {
    const candidate = attempt <= 1 ? base : `${base}-${String(attempt).padStart(2, "0")}`;
    const rows = await prisma.$queryRawUnsafe(
      `SELECT id FROM bio_calls WHERE id = $1 LIMIT 1`,
      candidate
    );
    if (!rows.length) return candidate;
  }
  throw new Error("No se pudo asignar un ID unico.");
}

async function main() {
  runSql("000_bio_call_reset.sql");
  runSql("002_bio_call_schema_jsonb.sql");

  const demoPath = join(root, "apps/frontend/public/demo-biocall-draft.json");
  const data = JSON.parse(await readFile(demoPath, "utf8"));
  const id = await allocateId(data.personalData);
  const payloadJson = JSON.stringify(data);

  console.log("\n▶ Insertando Bio Call demo…");
  await prisma.$executeRawUnsafe(
    `INSERT INTO bio_calls (id, form_capture_status, payload, payload_version)
     VALUES ($1, 'completed'::bio_call_status, $2::jsonb, '1')`,
    id,
    payloadJson
  );

  const storagePath = `bio-calls/${id}/biocall-${id}.pdf`;
  const downloadFilename = `BioCall-Vega-Morales-Roberto-${new Date().toISOString().slice(0, 10)}.pdf`;

  await prisma.$executeRawUnsafe(
    `INSERT INTO bio_call_generated_pdfs
       (id, bio_call_id, storage_path, download_filename, template_version, file_size_bytes, is_current)
     VALUES ($1, $2, $3, $4, 'v2.0', $5, true)`,
    `${id}_pdf_demo`,
    id,
    storagePath,
    downloadFilename,
    125000
  );

  const rows = await prisma.$queryRawUnsafe(
    `SELECT
       id,
       form_capture_status::text,
       payload_version,
       cliente_nombres,
       cliente_segundo_nombre,
       cliente_apellido_paterno,
       cliente_apellido_materno,
       telefono,
       correo_electronico,
       expediente_id,
       jsonb_array_length(COALESCE(payload->'family'->'hijos', '[]'::jsonb)) AS hijos_count,
       jsonb_array_length(COALESCE(payload->'address'->'direccionesAnteriores', '[]'::jsonb)) AS domicilios_previos,
       jsonb_array_length(COALESCE(payload->'caseBackground'->'empleosAnteriores', '[]'::jsonb)) AS empleos_anteriores,
       (SELECT array_agg(key ORDER BY key) FROM jsonb_object_keys(payload) AS key) AS payload_keys,
       pg_column_size(payload) AS payload_bytes,
       created_at,
       updated_at
     FROM bio_calls
     WHERE id = $1`,
    id
  );

  const pdfRows = await prisma.$queryRawUnsafe(
    `SELECT id, storage_path, download_filename, template_version, file_size_bytes, is_current
     FROM bio_call_generated_pdfs
     WHERE bio_call_id = $1`,
    id
  );

  const tableRows = await prisma.$queryRawUnsafe(
    `SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name LIKE 'bio_call%'
     ORDER BY table_name`
  );

  const samplePayload = await prisma.$queryRawUnsafe(
    `SELECT
       payload->'personalData'->>'nombres' AS nombres,
       payload->'family'->>'tieneHijos' AS tiene_hijos,
       payload->'family'->'hijos'->0->>'nombres' AS hijo_1_nombre,
       payload->'documents'->>'numeroPasaporte' AS pasaporte
     FROM bio_calls WHERE id = $1`,
    id
  );

  console.log("\n========== RESULTADO EN BASE (JSONB) ==========\n");
  console.log("Tablas bio_call*:", tableRows.map((t) => t.table_name).join(", "));
  console.log("\n--- bio_calls (1 fila) ---");
  console.log(JSON.stringify(rows[0], (_, v) => (typeof v === "bigint" ? Number(v) : v), 2));
  console.log("\n--- bio_call_generated_pdfs ---");
  console.log(JSON.stringify(pdfRows, null, 2));
  console.log("\n--- Consulta dentro del JSONB ---");
  console.log(JSON.stringify(samplePayload[0], null, 2));
  console.log("\nID:", id);
  console.log("Payload JSON serializado:", payloadJson.length, "bytes");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
