import {connectToRabbit} from "../message-broker/rabbit-mq";

require('dotenv').config()
import {connectToRedis} from "../db/redis";
import authRouter from "./routes/authRouter";
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import {prisma} from "../db/prisma";
import {errorHandler} from "./middleware/errorMiddleware";

const app = express()

async function main() {
    await connectToRedis()
    await connectToRabbit(); // Connect to RabbitMQ

    // 1.Body Parser
    app.use(bodyParser.json({ limit: '10kb' }))
    app.use(bodyParser.urlencoded({ extended: true }))

    // 2. Cookie Parser
    app.use(cookieParser())

    // 3. CORS
    app.use(cors())

    // ROUTES
    app.use('/auth', authRouter)

    // ERROR HANDLING MIDDLEWARE
    app.use(errorHandler)

    const port = 8001
    app.listen(port, () => {
        console.log(`Server on port: ${port}`)
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
