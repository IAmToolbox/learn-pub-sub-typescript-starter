import amqp from "amqplib";

import { SimpleQueueType } from "../internal/pubsub/declareAndBind.js";
import type { PlayingState } from "../internal/gamelogic/gamestate.js";

import { handlerPause } from "./handlers.ts";
import { clientWelcome, getInput, commandStatus, printClientHelp, printQuit } from "../internal/gamelogic/gamelogic.js";
import { declareAndBind } from "../internal/pubsub/declareAndBind.js";
import { subscribeJSON } from "../internal/pubsub/subscribe.js";
import { PauseKey, ExchangePerilDirect } from "../internal/routing/routing.js";
import { GameState } from "../internal/gamelogic/gamestate.js";
import { commandSpawn } from "../internal/gamelogic/spawn.js";
import { commandMove } from "../internal/gamelogic/move.js";

async function main() {
  console.log("Starting Peril client...");
  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
  const conn = await amqp.connect(rabbitConnString);
  console.log("Connection succesful");

  const username = await clientWelcome();

  await declareAndBind(conn, ExchangePerilDirect, `pause.${username}`, PauseKey, SimpleQueueType.Transient);

  const state = new GameState(username);
  await subscribeJSON<GameState>(conn, ExchangePerilDirect, `pause.${username}`, PauseKey, SimpleQueueType.Transient, handlerPause(state));

  while (true) {
    const input = await getInput();
    if (input.length === 0) {
      continue;
    }

    switch (input[0]) {
      case "spawn":
        commandSpawn(state, input);
        break;
      case "move":
        commandMove(state, input);
        break;
      case "status":
        commandStatus(state);
        break;
      case "help":
        printClientHelp();
        break;
      case "spam":
        console.log("Spamming not allowed yet!");
        break;
      case "quit":
        printQuit();
        conn.close();
        process.exit();
      default:
        console.log("Unknown command");
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
