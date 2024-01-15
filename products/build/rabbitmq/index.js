"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConnection = exports.generateUniqueCorrelationId = exports.receiveResponse = exports.assertTemporaryQueue = exports.createChannel = exports.checkRabbitConnection = exports.connectToRabbit = void 0;
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
const queue = "auth-microservice";
const username = "admin2";
const password = "admin2";
const connectToRabbit = () => __awaiter(void 0, void 0, void 0, function* () {
    callback_api_1.default.connect(`amqp://${username}:${password}@rabbitmq:5672`, (err, conn) => {
        if (err) {
            console.error("RabbitMQ connection error:", err);
            return;
        }
        console.log("Connected to RabbitMQ successfully!");
        // Sender
        conn.createChannel((err, ch) => {
            if (err) {
                console.error("RabbitMQ channel error:", err);
                return;
            }
            ch.assertQueue(queue);
        });
    });
});
exports.connectToRabbit = connectToRabbit;
function checkRabbitConnection() {
    const username = process.env.RABBITMQ_USERNAME;
    const password = process.env.RABBITMQ_PASSWORD;
    const connectionString = `amqp://${username}:${password}@rabbitmq:5672`;
    return new Promise((resolve, reject) => {
        callback_api_1.default.connect(connectionString, (err, connection) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(connection);
            }
        });
    });
}
exports.checkRabbitConnection = checkRabbitConnection;
function createChannel(connection) {
    return new Promise((resolve, reject) => {
        connection.createChannel((err, channel) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(channel);
            }
        });
    });
}
exports.createChannel = createChannel;
function assertTemporaryQueue(channel) {
    return new Promise((resolve, reject) => {
        channel.assertQueue("", { exclusive: true }, (err, q) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(q);
            }
        });
    });
}
exports.assertTemporaryQueue = assertTemporaryQueue;
function receiveResponse(channel, responseQueue, correlationId) {
    return new Promise((resolve) => {
        channel.consume(responseQueue, (msg) => {
            if (msg !== null && msg.properties.correlationId === correlationId) {
                console.log("received!: " + msg.content.toString());
                const response = JSON.parse(msg.content.toString());
                resolve(response);
                channel.ack(msg);
            }
        });
    });
}
exports.receiveResponse = receiveResponse;
function generateUniqueCorrelationId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
exports.generateUniqueCorrelationId = generateUniqueCorrelationId;
function closeConnection(connection) {
    setTimeout(() => {
        connection.close();
    }, 500);
}
exports.closeConnection = closeConnection;
