import amqplib, { Channel, Connection, Replies } from "amqplib/callback_api"

const queue = "auth-microservice"
const username = "admin2"
const password = "admin2"

export const connectToRabbit = async () => {
    amqplib.connect(`amqp://${username}:${password}@rabbitmq:5672`, (err, conn) => {
        if (err) {
            console.error("RabbitMQ connection error:", err)
            return
        }

        console.log("Connected to RabbitMQ successfully!")

        // Sender
        conn.createChannel((err, ch) => {
            if (err) {
                console.error("RabbitMQ channel error:", err)
                return
            }

            ch.assertQueue(queue)
        })
    })
}

export function checkRabbitConnection(): Promise<Connection> {
    const username = process.env.RABBITMQ_USERNAME
    const password = process.env.RABBITMQ_PASSWORD
    const connectionString = `amqp://${username}:${password}@rabbitmq:5672`

    return new Promise((resolve, reject) => {
        amqplib.connect(connectionString, (err, connection) => {
            if (err) {
                reject(err)
            } else {
                resolve(connection)
            }
        })
    })
}

export function createChannel(connection: Connection): Promise<Channel> {
    return new Promise((resolve, reject) => {
        connection.createChannel((err, channel) => {
            if (err) {
                reject(err)
            } else {
                resolve(channel)
            }
        })
    })
}

export function assertTemporaryQueue(channel: Channel): Promise<Replies.AssertQueue> {
    return new Promise((resolve, reject) => {
        channel.assertQueue("", { exclusive: true }, (err, q) => {
            if (err) {
                reject(err)
            } else {
                resolve(q)
            }
        })
    })
}

export function receiveResponse(channel: Channel, responseQueue: string, correlationId: string) {
    return new Promise((resolve) => {
        channel.consume(responseQueue, (msg) => {
            if (msg !== null && msg.properties.correlationId === correlationId) {
                console.log("received!: " + msg.content.toString())
                const response = JSON.parse(msg.content.toString())

                resolve(response)

                channel.ack(msg)
            }
        })
    })
}

export function generateUniqueCorrelationId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function closeConnection(connection: Connection): void {
    setTimeout(() => {
        connection.close()
    }, 500)
}
