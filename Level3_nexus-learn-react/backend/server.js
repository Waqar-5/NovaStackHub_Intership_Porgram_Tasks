import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { initSocket } from "./src/sockets/index.js";
import { env } from "./src/config/env.js";

async function main() {
  await connectDB();

  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.listen(env.port, () => {
    console.log(`[server] Nexus Learn API listening on port ${env.port} (${env.nodeEnv})`);
  });
}

main().catch((err) => {
  console.error("[server] fatal startup error:", err);
  process.exit(1);
});
