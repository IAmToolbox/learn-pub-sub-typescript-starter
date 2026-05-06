export enum SimpleQueueType {
    Durable,
    Transient,
}

export async function declareAndBind(conn: amqp.ChannelModel, exchange: string, queueName: string, key: string, queueType: SimpleQueueType): Promise<[Channel, amqp.Replies.AssertQueue]> { // dang girl that's a long function signature
    const channel = await conn.createChannel();

}
