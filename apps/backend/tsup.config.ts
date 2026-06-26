import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node18",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  // Empaqueta los paquetes internos del monorepo en el bundle final.
  noExternal: [/^@biocall\//],
});
