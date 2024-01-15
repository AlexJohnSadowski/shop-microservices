import { Router } from "express"
import { loginUserHandler, logoutUserHandler, refreshAccessTokenHandler, registerUserHandler } from "../controller/auth.controller"
import { loginUserSchema, registerUserSchema } from "../schemas/user.schema"
import { authMiddleware } from "../middleware/authMiddleware"
import { validate } from "../schemas/validate"

const router = Router()

// NON-PROTECTED ROUTES
router.post("/register", validate(registerUserSchema), registerUserHandler)
router.post("/login", validate(loginUserSchema), loginUserHandler)

// PROTECTED ROUTES
router.post("/logout", authMiddleware, logoutUserHandler)
router.post("/refresh", refreshAccessTokenHandler)

export default router
