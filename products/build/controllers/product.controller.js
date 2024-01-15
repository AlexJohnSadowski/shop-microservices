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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getAllProducts = void 0;
const prisma_1 = require("../db/prisma");
const appError_1 = __importDefault(require("../utils/appError"));
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma_1.prisma.productItem.findMany();
        if (products) {
            res.status(200).json(products);
        }
        else {
            next((0, appError_1.default)(404, "No products found!"));
        }
    }
    catch (e) {
        if (e instanceof Error) {
            next((0, appError_1.default)(404, e.message));
        }
    }
});
exports.getAllProducts = getAllProducts;
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield prisma_1.prisma.productItem.findMany({
            where: {
                id: id,
            },
            take: 1,
        });
        if (product.length) {
            res.status(200).json(product);
        }
        else {
            next((0, appError_1.default)(404, "No products found!"));
        }
    }
    catch (e) {
        next((0, appError_1.default)(404, e.message));
    }
});
exports.getProduct = getProduct;
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, image, price } = req.body;
    try {
        const product = yield prisma_1.prisma.productItem.create({
            data: {
                title,
                description,
                image,
                price,
            },
        });
        if (product) {
            res.status(201).json(product);
        }
    }
    catch (e) {
        if (e instanceof Error) {
            next((0, appError_1.default)(404, e.message));
        }
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, image, price } = req.body;
    try {
        const product = yield prisma_1.prisma.productItem.update({
            where: { id: id },
            data: { title, description, image, price },
        });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
    }
    catch (e) {
        if (e instanceof Error) {
            next((0, appError_1.default)(404, e.message));
        }
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield prisma_1.prisma.productItem.delete({
            where: { id: id },
        });
        if (!product) {
            next((0, appError_1.default)(404, "Product not found"));
        }
        res.status(204).json();
    }
    catch (e) {
        if (e instanceof Error) {
            next((0, appError_1.default)(404, e.message));
        }
    }
});
exports.deleteProduct = deleteProduct;
