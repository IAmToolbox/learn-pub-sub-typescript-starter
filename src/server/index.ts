import amqp from "amqplib";

import { publishJSON } from "../internal/pubsub/publish.js";
import { PauseKey, ExchangePerilDirect } from "../internal/routing/routing.js";
import type { PlayingState } from "../internal/gamelogic/gamestate.js";

async function main() {
  console.log("Starting Peril server...");
  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
  const conn = await amqp.connect(rabbitConnString);
  console.log("Connection successful");

  const confirmChannel = await conn.createConfirmChannel();
  publishJSON<PlayingState>(confirmChannel, ExchangePerilDirect, PauseKey, { isPaused: true });

  process.on("SIGINT", () => {
    console.log("\nShutting down program");
    conn.close();
    process.exit();
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
