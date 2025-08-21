import { Request, Response } from 'express'
import StatusCode from '../config/StatusCode'
import MessageModel from '../models/MessageModel'
import Logger from '../utils/Logger'
import { ContactMessage } from '../utils/interfaces/Message'

/**
 * Create a new contact message
 */
const createMessage = async (req: Request, res: Response) => {
  try {
    Logger.http(req.body)

    const { name, email, subject, message }: ContactMessage = req.body

    if (!name || !email || !subject || !message) {
      return res.status(StatusCode.BAD_REQUEST).send({ error: 'All fields are required' })
    }

    const newMessage = new MessageModel({ name, email, subject, message })
    Logger.debug(newMessage)

    const response = await newMessage.save()
    Logger.debug(response)

    res.status(StatusCode.CREATED).send(response)
  } catch (error) {
    Logger.error(error)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      message: 'Failed to create message',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * Get all messages
 */
const getAllMessages = async (req: Request, res: Response) => {
  try {
    const response = await MessageModel.find()
    Logger.debug(response)
    res.status(StatusCode.OK).send(response)
  } catch (error) {
    Logger.error(error)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      message: 'Error occurred while retrieving messages',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * Get a single message by ID
 */
const getMessageById = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params
    Logger.http(`messageId: ${messageId}`)

    const response = await MessageModel.findById(messageId)
    Logger.debug(response)

    if (!response) {
      return res.status(StatusCode.NOT_FOUND).send({ message: `Message with ID ${messageId} not found` })
    }

    res.status(StatusCode.OK).send(response)
  } catch (error) {
    Logger.error(error)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      message: `Error occurred while trying to retrieve message with ID: ${req.params.messageId}`,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * Delete a message
 */
const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params
    const response = await MessageModel.findByIdAndDelete(messageId)

    if (!response) {
      return res.status(StatusCode.NOT_FOUND).send({ message: `Message with ID ${messageId} not found` })
    }

    res.status(StatusCode.OK).send({
      message: `Successfully deleted message from ${response.name} (${response.email})`,
    })
  } catch (error) {
    Logger.error(error)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      message: `Error occurred while trying to delete message with ID: ${req.params.messageId}`,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export default {
  createMessage,
  getAllMessages,
  getMessageById,
  deleteMessage,
}
