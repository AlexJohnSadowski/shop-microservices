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
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenValidationMessageToAuth = void 0;
const index_1 = require("../index");
function tokenValidationMessageToAuth(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, index_1.checkRabbitConnection)();
        const channel = yield (0, index_1.createChannel)(connection);
        const correlationId = (0, index_1.generateUniqueCorrelationId)();
        const responseQueue = yield (0, index_1.assertTemporaryQueue)(channel);
        sendToAuthQueue(channel, req, responseQueue.queue, correlationId);
        const response = yield (0, index_1.receiveResponse)(channel, responseQueue.queue, correlationId);
        (0, index_1.closeConnection)(connection);
        return JSON.parse(response);
    });
}
exports.tokenValidationMessageToAuth = tokenValidationMessageToAuth;
function sendToAuthQueue(channel, message, replyTo, correlationId) {
    channel.sendToQueue("token-validation-queue", Buffer.from(JSON.stringify(message)), {
        replyTo,
        correlationId,
    });
}
