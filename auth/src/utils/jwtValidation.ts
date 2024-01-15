import { signJwt, verifyJwt } from "../service/jwt/jwt.service"
import { client as redisClient } from "../../db/redis"
import { findUniqueUser } from "../service/user/user.service"
import createAppError from "./appError"

async function validateJwt(refreshToken: string, accessToken?: string | null | undefined) {
    if (accessToken === undefined || accessToken === null || accessToken === "undefined") {
        // First block: Access token is not found or is undefined
        if (refreshToken) {
            console.log(
                "Access token verification failed or no access token found. Trying to refresh with refresh token."
            )
            const result = await refreshAccessTokenAndFindUser(refreshToken)

            if (result && result.user) {
                return result
            }
        }
    } else {
        // Second block: Access token is found, attempting to verify
        console.log("Found access token!")
        const user = await verifyJwtAndFindUser(accessToken, "accessTokenPrivateKey")

        if (user) {
            return { user }
        }

        // If verifyJwtAndFindUser returns null, attempt to refresh with refresh token
        if (refreshToken) {
            console.log("Access token verification failed. Trying to refresh with refresh token.")
            const result = await refreshAccessTokenAndFindUser(refreshToken)

            if (result && result.user) {
                return result
            }
        }
    }

    console.log("No access token or refresh token was detected")
    return { user: null, accessToken: null }
}

async function verifyJwtAndFindUser(
    token: string | null | undefined,
    key: "accessTokenPrivateKey" | "refreshTokenPrivateKey"
) {
    if (token) {
        const decoded = verifyJwt<{
            userId: string
            iat: number
            exp: number
        }>(token, key)

        if (!decoded) {
            console.log("ooooops")
            return null
        }

        return await findUniqueUser({ id: decoded.userId })
    } else return null
}

async function refreshAccessTokenAndFindUser(refreshToken: string) {
    const decoded = verifyJwt<{
        userId: string
        iat: number
        exp: number
    }>(refreshToken, "refreshTokenPrivateKey")

    if (!decoded) {
        console.log("Refresh token invalid!")
        return null
    }

    const user = await findUniqueUser({ id: decoded.userId })
    const newAccessToken = await refreshAccessToken(refreshToken)

    return { user, accessToken: newAccessToken }
}

export { validateJwt }

export const refreshAccessToken = async (refreshToken: string) => {
    const minutesAccessTokenExpiresIn = 15
    const decoded = verifyJwt<{
        userId: string
        iat: number
        exp: number
    }>(refreshToken, "refreshTokenPrivateKey")

    if (!decoded) {
        throw createAppError(403, "Could not refresh access token")
    }

    const session = await redisClient.get(decoded.userId)

    if (!session) {
        throw createAppError(403, "Could not refresh access token")
    }

    const user = await findUniqueUser({ id: JSON.parse(session).id })

    if (!user) {
        throw createAppError(403, "Could not refresh access token")
    }

    return signJwt({ sub: user.id }, "accessTokenPrivateKey", {
        expiresIn: `${minutesAccessTokenExpiresIn}m`,
    })
}
