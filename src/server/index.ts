import amqp from "amqplib";

import { publishJSON } from "../internal/pubsub/publish.js";
import { PauseKey, ExchangePerilDirect } from "../internal/routing/routing.js";
import type { PlayingState } from "../internal/gamelogic/gamestate.js";
import { printServerHelp, getInput } from "../internal/gamelogic/gamelogic.js";

async function main() {
  console.log("Starting Peril server...");
  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
  const conn = await amqp.connect(rabbitConnString);
  console.log("Connection successful");

  const confirmChannel = await conn.createConfirmChannel();
  printServerHelp();
  while (true) {
    const input = await getInput();
    if (input.length === 0) {
      continue;
    }

    switch (input[0]) {
      case "pause":
        console.log("Sending pause message");
        await publishJSON<PlayingState>(confirmChannel, ExchangePerilDirect, PauseKey, { isPaused: true });
        break;
      case "resume":
        console.log("Sendinmg resume message");
        await publishJSON<PlayingState>(confirmChannel, ExchangePerilDirect, PauseKey, { isPaused: false });
        break;
      case "quit":
        console.log("Shutting down program");
        conn.close();
        process.exit();
      default:
        console.log("Unknown command");
    }
  }


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
