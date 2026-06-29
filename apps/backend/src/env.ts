import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const backendSrcDir = dirname(fileURLToPath(import.meta.url));
const backendRoot = join(backendSrcDir, "..");
const monorepoRoot = join(backendRoot, "..", "..");

// packages/database primero; apps/backend/.env tiene prioridad (override)
config({ path: join(monorepoRoot, "packages", "database", ".env") });
config({ path: join(backendRoot, ".env"), override: true });

function parseCorsOrigins(): string[] {
  const raw = process.env.CORS_ORIGIN ?? "http://localhost:3000,http://localhost:3001";
  return raw.split(",").map((origin) => origin.trim()).filter(Boolean);
}

/**
 * Variables de entorno de la API con valores por defecto para desarrollo.
 */
export const env = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigins: parseCorsOrigins(),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: process.env.DATABASE_URL ?? "",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  supabaseStorageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? "bio-call-pdfs",
  localStorageDir:
    process.env.LOCAL_PDF_STORAGE_DIR ?? join(backendRoot, ".data", "pdfs"),
  logoPath:
    process.env.LOGO_PATH ??
    join(monorepoRoot, "apps", "frontend", "public", "LOGOTIPO_MANUEL_SOLIS_02.png"),
};
