import express from "express";
import cors from "cors";
import { env } from "./env";
import { bioCallsRouter } from "./routes/bioCalls";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "biocall-backend", env: env.nodeEnv });
});

app.use("/api/bio-calls", bioCallsRouter);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`[biocall-backend] escuchando en http://localhost:${env.port}`);
});
