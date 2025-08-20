import dotenv from 'dotenv'
import StatusCode from '../config/StatusCode'


dotenv.config()
const env: string = process.env.NODE_ENV ?? 'development'

// Own made middlewares
const notFound = (req: { originalUrl: any; }, res: { status: (arg0: number) => void; }, next: (arg0: Error) => void) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(StatusCode.NOT_FOUND)
    next(error)
}   

const errorHandler = (error: any, req: any, res: any, next: any) => {
    let statusCode = res.statusCode === 200 ? StatusCode.INTERNAL_SERVER_ERROR : res.statusCode
    res.status(statusCode)
    res.json({
        message: error.message,
        stack: env === 'production' ? null : error.stack
    })
}

export {
    notFound,
    errorHandler
}