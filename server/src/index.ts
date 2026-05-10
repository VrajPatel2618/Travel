import { env } from "./config/env";
import { createApp } from "./app";
import { prisma } from "./lib/prisma";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`Traveloop API running on http://localhost:${env.PORT}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down Traveloop API`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
