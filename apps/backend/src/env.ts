import "dotenv/config";

/**
 * Variables de entorno de la API con valores por defecto para desarrollo.
 */
export const env = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV ?? "development",
};
