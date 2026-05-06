import amqp from "amqplib";

import { clientWelcome } from "../internal/gamelogic/gamelogic.js";

async function main() {
  console.log("Starting Peril client...");
  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
  const conn = await amqp.connect(rabbitConnString);
  console.log("Connection succesful");

  const username = await clientWelcome();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
