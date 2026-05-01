// Reusable code to publish messages to the broker

export function publishJSON<T>(ch: ConfirmChannel, exchange: string, routingKey: string, value: T): Promise<void> {
    const serialized = Buffer.from(JSON.stringify(value));
    ch.publish(exchange, routingKey, serialized, { contentType: "application/json" });
}
