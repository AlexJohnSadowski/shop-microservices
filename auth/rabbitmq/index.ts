import amqplib from "amqplib/callback_api"
import { handleMessageAndValidateJwt } from "./token-validation-queue/token-validation-queue"

const username = process.env.RABBITMQ_USERNAME
const password = process.env.RABBITMQ_PASSWORD

const queueConfig = [
    { name: "token-validation-queue", handler: handleMessageAndValidateJwt },
    // { name: 'another-queue', handler: handleAnotherQueue },
    // { name: 'yet-another-queue', handler: handleYetAnotherQueue },
]

export const connectToRabbit = async () => {
    amqplib.connect(`amqp://${username}:${password}@rabbitmq:5672`, (err, conn) => {
        if (err) {
            console.error("RabbitMQ connection error:", err)
            return
        }

        console.log("Connected to RabbitMQ successfully!")

        // Create a channel and set up the message handling for each queue
        queueConfig.forEach(({ name, handler }) => {
            createChannelAndListen(conn, name, handler)
        })
    })
}

const createChannelAndListen = (connection, queue, handler) => {
    connection.createChannel((err, channel) => {
        if (err) {
            console.error("RabbitMQ channel error:", err)
            return
        }

        channel.assertQueue(queue)
        console.log(`Waiting for messages in queue: ${queue}`)

        channel.consume(queue, (msg) => {
            handler(msg, channel)
        })
    })
}

export const sendResponse = (responseQueue, correlationId, response, channel) => {
    channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify(response)), {
        correlationId,
    })
}
