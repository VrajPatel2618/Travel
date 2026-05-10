import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/error-handler";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );
  app.use(
    cors({
      origin: [env.CLIENT_URL, "http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
      credentials: true
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(
    "/api",
    rateLimit({
      windowMs: 60_000,
      limit: 180,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "traveloop-api", timestamp: new Date().toISOString() });
  });

  app.use("/api", apiRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
