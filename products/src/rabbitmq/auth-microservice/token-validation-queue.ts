import { Channel } from "amqplib/callback_api"
import {
    assertTemporaryQueue,
    checkRabbitConnection,
    closeConnection,
    createChannel,
    generateUniqueCorrelationId,
    receiveResponse,
} from "../index"

type AuthResponse = {
    success: boolean
    user: object
    newAccessToken?: string
    errorMessage?: string
}

export async function tokenValidationMessageToAuth(req: object): Promise<AuthResponse> {
    const connection = await checkRabbitConnection()
    const channel = await createChannel(connection)

    const correlationId = generateUniqueCorrelationId()
    const responseQueue = await assertTemporaryQueue(channel)

    sendToAuthQueue(channel, req, responseQueue.queue, correlationId)

    const response: string = <string>await receiveResponse(channel, responseQueue.queue, correlationId)

    closeConnection(connection)

    return JSON.parse(response)
}

function sendToAuthQueue(channel: Channel, message: object, replyTo: string, correlationId: string): void {
    channel.sendToQueue("token-validation-queue", Buffer.from(JSON.stringify(message)), {
        replyTo,
        correlationId,
    })
}
