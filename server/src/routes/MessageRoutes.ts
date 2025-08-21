import { Router } from 'express'
import MessageController from '../controllers/MessageController'
import { verifyAdmin } from '../middlewares/authMiddleware'

const router = Router()

// Public route: users can send you a message
router.post('/', MessageController.createMessage)

// Admin-only routes
router.get('/', verifyAdmin, MessageController.getAllMessages)
router.get('/:messageId', verifyAdmin, MessageController.getMessageById)
router.patch('/:messageId/status', verifyAdmin, MessageController.updateMessageStatus)
router.delete('/:messageId', verifyAdmin, MessageController.deleteMessage)

export default router
