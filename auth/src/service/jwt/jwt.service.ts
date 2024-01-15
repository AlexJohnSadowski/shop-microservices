import jwt, { SignOptions } from "jsonwebtoken"

const getKey = (
    keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey" | "accessTokenPublicKey" | "refreshTokenPublicKey"
) => {
    const keyMap = {
        accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY_SECRET,
        refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY_SECRET,
        accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY_SECRET,
        refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY_SECRET,
    }

    const key = keyMap[keyName]
    if (!key) {
        throw new Error(`Key is not defined for ${keyName}`)
    }

    return key
}

export const signJwt = (
    payload: object,
    keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
    options?: SignOptions
) => {
    const privateKey = getKey(keyName)
    return jwt.sign(payload, privateKey, { ...options, algorithm: "HS256" })
}

export const verifyJwt = <T>(token: string, keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey"): T | null => {
    const publicKey = getKey(keyName)
    try {
        return jwt.verify(token, publicKey) as T
    } catch (error) {
        return null
    }
}
