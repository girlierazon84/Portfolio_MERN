import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import StatusCode from '../config/StatusCode'

const JWT_SECRET = process.env.JWT_SECRET as string

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Extract after 'Bearer '

  if (!token) {
    return res.status(StatusCode.UNAUTHORIZED).json({
      message: 'Access denied. No token provided.',
    })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role?: string }

    // ✅ Check if user is admin
    if (decoded.role !== 'admin') {
      return res.status(StatusCode.FORBIDDEN).json({
        message: 'Forbidden: Admins only',
      })
    }

    // attach decoded payload for later use if needed
    (req as any).user = decoded 

    next()
  } catch (error) {
    return res.status(StatusCode.UNAUTHORIZED).json({
      message: 'Invalid or expired token',
    })
  }
}
