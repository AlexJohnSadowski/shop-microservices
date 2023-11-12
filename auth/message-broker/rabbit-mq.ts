//@ts-nocheck
import {validateJwt} from "../src/utils/jwtValidation";

const amqplib = require('amqplib/callback_api');
const queue = 'token-validation-queue';

export const connectToRabbit = async () => {
    amqplib.connect('amqp://localhost', (err, conn) => {
        if (err) {
            console.error('RabbitMQ connection error:', err);
            return;
        }

        // Listener
        conn.createChannel((err, ch2) => {
            if (err) {git remote add origin https://github.com/AlexJohnSadowski/shop-microservices.git
                git push -u origin main channel error:', err);
                return;
            }

            ch2.assertQueue(queue);

            ch2.consume(queue, (msg) => {
                if (msg !== null) {
                    const token = msg.content.toString();
                    const user = validateJwt(token); // Replace with your token validation logic

                    if (user) {
                        // Token is valid, perform further actions
                    }

                    ch2.ack(msg);
                } else {
                    console.log('Consumer cancelled by server');
                }
            });
        });
    });
};


