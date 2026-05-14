import { SimpleQueueType } from "./declareAndBind.js";

import { declareAndBind } from "./declareAndBind.js";

export async function subscribeJSON<T>(conn: amqp.ChannelModel, exchange: string, queueName: string, key: string, queueType: SimpleQueueType, handler: (data: T) => void): Promise<void> {
    // WHY ARE THE FUNCTION SIGNATURES GETTING LONGER
    const [channel, queue] = await declareAndBind(conn, exchange, queueName, key, queueType);
    const consumer = await channel.consume(queueName, async (message: amqp.ConsumeMessage | null) => {
        if (message === null) {
            return;
        }
        const parsedMessage = JSON.parse(message.content.toString());
        handler(parsedMessage);
        await channel.ack(message);
    });
}
