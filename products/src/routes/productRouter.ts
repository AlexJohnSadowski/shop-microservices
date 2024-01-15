import { Router } from "express"
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    updateProduct,
} from "../controllers/product.controller"
import { createProductSchema, updateProductSchema } from "../schemas/product.schema"
import { validate } from "../schemas/validate"
import { tokenValidationMessageToAuth } from "../rabbitmq/auth-microservice/token-validation-queue"
import { accessTokenCookieOptions } from "../utils/jwtCookiesSettings"

const router = Router()

router.get("/", getAllProducts)
router.get("/:id", getProduct)

router.post("/", validate(createProductSchema), async (req, res, next) => {
    const authResponse = await tokenValidationMessageToAuth(req.cookies)

    if (!authResponse) {
        return res.status(401).json({ message: "Unauthorized" })
    } else {
        if (authResponse.success) {
            res.cookie("access_token", authResponse.newAccessToken, accessTokenCookieOptions)

            await createProduct(req, res, next)
        } else {
            return res.status(401).json({ message: authResponse.errorMessage })
        }
    }
})

router.put("/:id", validate(updateProductSchema), updateProduct)
router.delete("/:id", deleteProduct)

export default router
