"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        price: (0, zod_1.number)({
            required_error: "Price is required",
        }),
        image: (0, zod_1.string)({
            required_error: "Image is required",
        })
            .max(255)
            .min(1, "Invalid length"),
        title: (0, zod_1.string)({
            required_error: "title is required",
        })
            .max(255)
            .min(1, "Invalid length"),
        description: (0, zod_1.string)({
            required_error: "title is required",
        })
            .max(255)
            .min(1, "Invalid length"),
    }),
});
exports.updateProductSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        price: (0, zod_1.number)().positive(),
        image: (0, zod_1.string)(),
        title: (0, zod_1.string)().max(255),
        description: (0, zod_1.string)().max(255),
    }),
});
