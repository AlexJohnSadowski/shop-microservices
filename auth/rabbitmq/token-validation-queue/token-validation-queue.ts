// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { validateJwt } from "../../src/utils/jwtValidation"
import { sendResponse } from "../index"

export const handleMessageAndValidateJwt = async (msg, channel) => {
    if (msg !== null) {
        console.log("Received a new message:", msg.content.toString())
        await processMessageAndValidateJwt(msg, channel)
    } else {
        console.log("Consumer cancelled by server")
    }
}

const processMessageAndValidateJwt = async (msg, channel) => {
    const messageContent = msg.content.toString()

    try {
        const data = JSON.parse(messageContent)

        const { refresh_token, access_token } = data

        // Validate the JWTs
        const { user, accessToken } = await validateJwt(refresh_token, access_token)

        if (user) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = user

            console.log("User is valid:", userWithoutPassword)
            console.log("If the token has been refreshed:", accessToken)

            const responseQueue = msg.properties.replyTo
            const correlationId = msg.properties.correlationId

            const response = { success: true, userWithoutPassword, newAccessToken: accessToken }
            console.log("Sending response:", JSON.stringify(response))

            // Send the response back to the specified queue
            sendResponse(responseQueue, correlationId, JSON.stringify(response), channel)
        } else {
            const responseQueue = msg.properties.replyTo
            const correlationId = msg.properties.correlationId

            const response = {
                success: false,
                errorMessage: "Sorry, couldn't validate the user, please login!",
                // Other fields as needed...
            }

            sendResponse(responseQueue, correlationId, JSON.stringify(response), channel)
        }
    } catch (error) {
        console.error("Error parsing or processing the received message:", error)
    }

    channel.ack(msg)
}
