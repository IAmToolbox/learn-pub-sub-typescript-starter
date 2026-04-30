import amqp from "amqplib";

async function main() {
  console.log("Starting Peril server...");
  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
  const conn = await amqp.connect(rabbitConnString);
  console.log("Connection successful");

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
