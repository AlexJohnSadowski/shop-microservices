import { Request, Response, NextFunction } from 'express'
import {AppError} from "../utils/appError";

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
    console.error(err.name)

    res.status(err.status ?? 500).send({ name: err.name ?? 'Internal', message: err.message ?? 'Internal Error' })
}
