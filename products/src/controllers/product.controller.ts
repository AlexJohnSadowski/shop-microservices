import { NextFunction, Request, Response } from "express"
import { prisma } from "../db/prisma"
import createAppError from "../utils/appError"

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await prisma.productItem.findMany()
        if (products) {
            res.status(200).json(products)
        } else {
            next(createAppError(404, "No products found!"))
        }
    } catch (e: unknown) {
        if (e instanceof Error) {
            next(createAppError(404, e.message))
        }
    }
}

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    try {
        const product = await prisma.productItem.findMany({
            where: {
                id: id,
            },
            take: 1,
        })
        if (product.length) {
            res.status(200).json(product)
        } else {
            next(createAppError(404, "No products found!"))
        }
    } catch (e: any) {
        next(createAppError(404, e.message))
    }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, image, price } = req.body

    try {
        const product = await prisma.productItem.create({
            data: {
                title,
                description,
                image,
                price,
            },
        })

        if (product) {
            res.status(201).json(product)
        }
    } catch (e: unknown) {
        if (e instanceof Error) {
            next(createAppError(404, e.message))
        }
    }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { title, description, image, price } = req.body

    try {
        const product = await prisma.productItem.update({
            where: { id: id },
            data: { title, description, image, price },
        })
        if (!product) {
            return res.status(404).json({ error: "Product not found" })
        }
        res.status(200).json(product)
    } catch (e: unknown) {
        if (e instanceof Error) {
            next(createAppError(404, e.message))
        }
    }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    try {
        const product = await prisma.productItem.delete({
            where: { id: id },
        })
        if (!product) {
            next(createAppError(404, "Product not found"))
        }
        res.status(204).json()
    } catch (e: unknown) {
        if (e instanceof Error) {
            next(createAppError(404, e.message))
        }
    }
}
