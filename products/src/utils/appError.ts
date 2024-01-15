export type AppError = {
    status: number
    isOperational: boolean
} & Error

const createAppError = <T extends number>(statusCode: T = 500 as T, message: string | undefined): AppError => {
    const error = new Error(message) as AppError
    error.name = "AppError"
    error.isOperational = true
    error.status = statusCode
    Error.captureStackTrace(error, createAppError)
    return error
}

export default createAppError
