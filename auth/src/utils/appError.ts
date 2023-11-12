export interface AppError extends Error {
    status: number
    isOperational: boolean
}

const createAppError = <T extends number>(statusCode: T = 500 as T, message?: string): AppError => {
    const error = new Error(message) as AppError
    error.name = 'AppError'
    error.isOperational = true
    error.status = statusCode
    Error.captureStackTrace(error, createAppError)
    return error
}

export default createAppError
