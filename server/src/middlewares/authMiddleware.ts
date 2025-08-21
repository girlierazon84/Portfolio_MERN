import { Request, Response, NextFunction } from 'express'
import StatusCode from '../config/StatusCode'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN // store in .env

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']

  if (!token || token !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(StatusCode.UNAUTHORIZED).send({
      message: 'Unauthorized: Admin access only'
    })
  }

  next()
}
