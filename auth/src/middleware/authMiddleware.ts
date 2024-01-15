import { Request, Response, NextFunction } from "express"
import { validateJwt } from "../utils/jwtValidation"
import createAppError from "../utils/appError"

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const user = await validateJwt(req.cookies.refresh_token)

    if (!user) {
        next(createAppError(403, "Unauthorized"))
    } else {
        next()
    }
}
