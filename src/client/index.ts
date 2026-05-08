import amqp from "amqplib";

import { SimpleQueueType } from "../internal/pubsub/declareAndBind.js";

import { clientWelcome } from "../internal/gamelogic/gamelogic.js";
import { declareAndBind } from "../internal/pubsub/declareAndBind.js";
import { PauseKey, ExchangePerilDirect } from "../internal/routing/routing.js";
import { GameState } from "../internal/gamelogic/gamestate.js";

async function main() {
  console.log("Starting Peril client...");
  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
  const conn = await amqp.connect(rabbitConnString);
  console.log("Connection succesful");

  const username = await clientWelcome();

  await declareAndBind(conn, ExchangePerilDirect, `pause.${username}`, PauseKey, SimpleQueueType.Transient);

  const state = new GameState(username);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
