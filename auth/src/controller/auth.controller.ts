import { CookieOptions, NextFunction, Request, Response } from "express"
import bcrypt from "bcryptjs"
import { LoginUserSchema, RegisterUserSchema } from "../schemas/user.schema"
import { createUserWithCart, findUniqueUser, signTokens } from "../service/user/user.service"
import { signJwt, verifyJwt } from "../service/jwt/jwt.service"
import { Prisma } from "@prisma/client"
import { client as redisClient } from "../../db/redis"
import createAppError from "../utils/appError"

const cookiesOptions: CookieOptions = {
    httpOnly: true,
    sameSite: "lax",
}

const minutesRefreshTokenExpiresIn = 60
const minutesAccessTokenExpiresIn = 15

if (process.env.NODE_ENV === "production") cookiesOptions.secure = true

const accessTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(Date.now() + minutesAccessTokenExpiresIn * 60 * 1000),
    maxAge: minutesAccessTokenExpiresIn * 60 * 1000,
}

const refreshTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(Date.now() + minutesRefreshTokenExpiresIn * 60 * 1000),
    maxAge: minutesRefreshTokenExpiresIn * 60 * 1000,
}

export const registerUserHandler = async (
    req: Request<{}, {}, RegisterUserSchema>,
    res: Response,
    next: NextFunction
) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12)
        const user = await createUserWithCart({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: hashedPassword,
        })

        res.status(201).json({
            status: "success",
            data: {
                user,
            },
        })
    } catch (err: any) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                return res.status(409).json({
                    status: "fail",
                    message: "Email already exist, please use another email address",
                })
            }
        }
        if (err instanceof Error) {
            next(createAppError(404, err.message))
        }
    }
}

export const loginUserHandler = async (req: Request<{}, {}, LoginUserSchema>, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body

        const user = await findUniqueUser({ email: email.toLowerCase() }, { id: true, email: true, password: true })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(createAppError(400, "Invalid email or password"))
        }

        // Sign Tokens
        const { access_token, refresh_token } = await signTokens(user)

        res.cookie("userId", user.id, accessTokenCookieOptions)
        res.cookie("access_token", access_token, accessTokenCookieOptions)
        res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions)
        res.cookie("logged_in", true, {
            ...accessTokenCookieOptions,
        })
        // respond
        res.status(200).json({
            status: "success",
            access_token,
            refresh_token,
        })
    } catch (e) {
        if (e instanceof Error) {
            console.log(e)
            next(createAppError(404, e.message))
        }
    }
}

export const logoutUserHandler = async (req: Request<{}, {}, LoginUserSchema>, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body

        const user = await findUniqueUser({ email: email.toLowerCase() }, { id: true, email: true, password: true })

        const invalidJwt = signJwt({ userId: user.id }, "accessTokenPrivateKey", { expiresIn: "-1s" })
        const invalidJwtRefresh = signJwt({ userId: user.id }, "refreshTokenPrivateKey", { expiresIn: "-1s" })

        res.clearCookie("refresh_token")
            .clearCookie("access_token")
            .clearCookie("logged_in")
            .json({ message: "Successfully logged out", access_token: invalidJwt, refresh_token: invalidJwtRefresh })
    } catch (e: any) {
        if (e instanceof Error) {
            next(createAppError(404, e.message))
        }
    }
}

export const refreshAccessTokenHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const refresh_token = req.cookies.refresh_token
    const message = "Could not refresh access token"

    if (!refresh_token) {
        console.log("refresh token, click")
        return next(createAppError(403, message))
    }

    // Validate refresh token
    const decoded = verifyJwt<{
        userId: string
        iat: number
        exp: number
    }>(refresh_token, "refreshTokenPrivateKey")

    if (!decoded) {
        console.log("decoded, click")
        return next(createAppError(403, message))
    }

    // Check if auth has a valid session
    const session = await redisClient.get(decoded.userId)
    if (!session) {
        return next(createAppError(403, message))
    }

    // Check if auth still exist
    const user = await findUniqueUser({ id: JSON.parse(session).id })

    if (!user) {
        console.log("user, click")
        return next(createAppError(403, message))
    }

    // Sign new access token
    const access_token = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
        expiresIn: minutesAccessTokenExpiresIn,
    })

    // 4. Add Cookies
    res.cookie("access_token", access_token, accessTokenCookieOptions)
    res.cookie("logged_in", true, {
        ...accessTokenCookieOptions,
    })

    // 5. Send response
    res.status(200).json({
        status: "refresh succeeded",
        access_token,
    })
}
