import { CookieOptions } from "express"

export const cookiesOptions: CookieOptions = {
    httpOnly: true,
    sameSite: "lax",
}

export const minutesAccessTokenExpiresIn = 15

if (process.env.NODE_ENV === "production") cookiesOptions.secure = true

export const accessTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(Date.now() + minutesAccessTokenExpiresIn * 60 * 1000),
    maxAge: minutesAccessTokenExpiresIn * 60 * 1000,
}
