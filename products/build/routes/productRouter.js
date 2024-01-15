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
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const product_schema_1 = require("../schemas/product.schema");
const validate_1 = require("../schemas/validate");
const token_validation_queue_1 = require("../rabbitmq/auth-microservice/token-validation-queue");
const jwtCookiesSettings_1 = require("../utils/jwtCookiesSettings");
const router = (0, express_1.Router)();
router.get("/", product_controller_1.getAllProducts);
router.get("/:id", product_controller_1.getProduct);
router.post("/", (0, validate_1.validate)(product_schema_1.createProductSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authResponse = yield (0, token_validation_queue_1.tokenValidationMessageToAuth)(req.cookies);
    if (!authResponse) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    else {
        if (authResponse.success) {
            res.cookie("access_token", authResponse.newAccessToken, jwtCookiesSettings_1.accessTokenCookieOptions);
            yield (0, product_controller_1.createProduct)(req, res, next);
        }
        else {
            return res.status(401).json({ message: authResponse.errorMessage });
        }
    }
}));
router.put("/:id", (0, validate_1.validate)(product_schema_1.updateProductSchema), product_controller_1.updateProduct);
router.delete("/:id", product_controller_1.deleteProduct);
exports.default = router;
