import express from 'express'
import {
    loginUserHandler,
    logoutUserHandler,
    refreshAccessTokenHandler,
    registerUserHandler,
} from '../controller/auth.controller'
import { loginUserSchema, registerUserSchema } from '../schemas/user.schema'
import { authMiddleware } from '../middleware/authMiddleware'
import {validate} from "../schemas/validate";
import createAppError from "../utils/appError";
import {validateJwt} from "../utils/jwtValidation";

const router = express.Router()

// VALIDATION
router.use('/validate-token', async (req, res, next) => {
    const user = await validateJwt(req);

    if (!user) {
        return next(createAppError(403, 'Unauthorized'));
    }

    next();
});

// NON-PROTECTED ROUTES
router.post('/register', validate(registerUserSchema), registerUserHandler)
router.post('/login', validate(loginUserSchema), loginUserHandler)

// PROTECTED ROUTES
router.post('/logout', authMiddleware, logoutUserHandler)
router.post('/refresh', authMiddleware, refreshAccessTokenHandler)

export default router
