import { Prisma, User } from "@prisma/client"
import { signJwt } from "../jwt/jwt.service"
import { client } from "../../../db/redis"
import { prisma } from "../../../db/prisma"

export const createUserWithCart = async (input: Prisma.UserCreateInput): Promise<User> => {
    const user = await prisma.user.create({
        data: input,
    })

    return user
}

export const findUniqueUser = async (where: Prisma.UserWhereUniqueInput, select?: Prisma.UserSelect) => {
    return (await prisma.user.findUnique({
        where,
        select,
    })) as User
}

export const signTokens = async (user: Prisma.UserCreateInput) => {
    const excludedFields = ["password"]
    const omit = (obj: Prisma.UserCreateInput & { [key: string]: any }, excludedFields: string[]) => {
        const newObj = { ...obj }
        for (const field of excludedFields) {
            delete newObj[field]
        }
        return newObj
    }

    const newData = omit(user, excludedFields)

    // 1. Create Session
    await client.set(`${user.id}`, JSON.stringify(newData), {
        EX: 60 * 60,
    })

    // 2. Create Access and Refresh tokens
    const access_token = signJwt({ userId: user.id }, "accessTokenPrivateKey", {
        expiresIn: "15m",
    })

    const refresh_token = signJwt({ userId: user.id }, "refreshTokenPrivateKey", {
        expiresIn: "15m",
    })

    return { access_token, refresh_token }
}
