import { config } from "dotenv";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const pkgSrcDir = dirname(fileURLToPath(import.meta.url));
const dbPkgRoot = join(pkgSrcDir, "..");
const monorepoRoot = join(dbPkgRoot, "..", "..");

config({ path: join(dbPkgRoot, ".env") });
config({ path: join(monorepoRoot, "apps", "backend", ".env"), override: true });

/**
 * Cliente Prisma como singleton para evitar multiples conexiones en desarrollo
 * (hot-reload). En produccion se crea una sola instancia.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
