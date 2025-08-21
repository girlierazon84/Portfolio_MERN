import { Router } from 'express'
import MessageController from '../controllers/MessageController'

const router = Router()

// Create a new message
router.post('/', MessageController.createMessage)

// Get all messages
router.get('/', MessageController.getAllMessages)

// Get a specific message
router.get('/:messageId', MessageController.getMessageById)

// Update message status (mark as read/responded)
router.patch('/:messageId/status', MessageController.updateMessageStatus)

// Delete a message
router.delete('/:messageId', MessageController.deleteMessage)

export default router
