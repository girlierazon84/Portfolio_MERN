import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import StatusCode from '../config/StatusCode'

const JWT_SECRET = process.env.JWT_SECRET as string
const router = Router()

// 🔑 Admin login route -> issues JWT
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body

  // ⚡ Example only: replace with DB lookup & hashed password check
  if (username === 'admin' && password === 'password123') {
    const token = jwt.sign(
      { username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1h' }
    )
    return res.status(StatusCode.OK).json({ token })
  }

  return res.status(StatusCode.UNAUTHORIZED).json({
    message: 'Invalid credentials',
  })
})

export default router
