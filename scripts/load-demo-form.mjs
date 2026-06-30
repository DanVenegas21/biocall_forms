import { exec } from "node:child_process";

const url = "http://localhost:3000/cargar-demo.html";

const openCmd =
  process.platform === "win32"
    ? `start "" "${url}"`
    : process.platform === "darwin"
      ? `open "${url}"`
      : `xdg-open "${url}"`;

exec(openCmd, (err) => {
  if (err) {
    console.error("No se pudo abrir el navegador:", err.message);
    console.log("\nAbre manualmente:", url);
    process.exit(1);
  }
  console.log("Demo Bio Call: abriendo", url);
  console.log("(Requiere frontend en http://localhost:3000 — npm run dev)");
});
