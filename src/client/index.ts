import amqp from "amqplib";

import { SimpleQueueType } from "../internal/pubsub/declareAndBind.js";
import type { PlayingState } from "../internal/gamelogic/gamestate.js";
import type { ArmyMove } from "../internal/gamelogic/gamedata.js";

import { handlerPause, handlerMove } from "./handlers.ts";
import { clientWelcome, getInput, commandStatus, printClientHelp, printQuit } from "../internal/gamelogic/gamelogic.js";
import { declareAndBind } from "../internal/pubsub/declareAndBind.js";
import { subscribeJSON } from "../internal/pubsub/subscribe.js";
import { publishJSON } from "../internal/pubsub/publish.js";
import { PauseKey, ExchangePerilDirect, ExchangePerilTopic } from "../internal/routing/routing.js";
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
  await subscribeJSON<ArmyMove>(conn, ExchangePerilTopic, `army_moves.${username}`, "army_moves.*", SimpleQueueType.Transient, handlerMove(state));

  const confirmChannel = await conn.createConfirmChannel();

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
        await publishJSON<ArmyMove>(confirmChannel, ExchangePerilTopic, `army_moves.${username}`,commandMove(state, input));
        console.log("Published move successfully");
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
