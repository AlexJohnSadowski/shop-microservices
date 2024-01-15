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
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
const productRouter_1 = __importDefault(require("./routes/productRouter"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const prisma_1 = require("./db/prisma");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const rabbitmq_1 = require("./rabbitmq");
const app = (0, express_1.default)();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, rabbitmq_1.connectToRabbit)(); // Connect to RabbitMQ
        // 1.Body Parser
        app.use(body_parser_1.default.json({ limit: "10kb" }));
        app.use(body_parser_1.default.urlencoded({ extended: true }));
        // 2. Cookie Parser
        app.use((0, cookie_parser_1.default)());
        // 3. CORS
        app.use((0, cors_1.default)());
        // ROUTES
        app.use("/products", productRouter_1.default);
        // ERROR HANDLING MIDDLEWARE
        app.use(errorMiddleware_1.errorHandler);
        const port = 8002;
        app.listen(port, () => {
            console.log(`Server on port: ${port}`);
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma_1.prisma.$disconnect();
    process.exit(1);
}));
