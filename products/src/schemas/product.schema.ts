import { object, number, string } from "zod"

export const createProductSchema = object({
    body: object({
        price: number({
            required_error: "Price is required",
        }),
        image: string({
            required_error: "Image is required",
        })
            .max(255)
            .min(1, "Invalid length"),
        title: string({
            required_error: "title is required",
        })
            .max(255)
            .min(1, "Invalid length"),
        description: string({
            required_error: "title is required",
        })
            .max(255)
            .min(1, "Invalid length"),
    }),
})

export const updateProductSchema = object({
    body: object({
        price: number().positive(),
        image: string(),
        title: string().max(255),
        description: string().max(255),
    }),
})
