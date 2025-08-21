import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

import StatusCode from '../config/StatusCode'
import UserModel from '../models/UserModel'
import { CreateNewUser } from '../utils/interfaces/Users'
import Logger from '../utils/Logger'

const saltRounds = 10
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret' // Use .env in production

/**
 * Encrypt a password using bcrypt
 */
export const encryptPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Create a new user
 */
const createUser = async (req: Request, res: Response) => {
  try {
    Logger.http(req.body)
    let { firstname, lastname, email, username, password }: CreateNewUser = req.body

    if (!firstname || !lastname || !email || !username || !password) {
      return res.status(StatusCode.BAD_REQUEST).send({ error: 'All fields are required' })
    }

    // Encrypt password
    password = await encryptPassword(password)

    const user = new UserModel({ firstname, lastname, email, username, password })
    const response = await user.save()

    Logger.debug(response)
    res.status(StatusCode.CREATED).send(response)
  } catch (error) {
    Logger.error(error)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      error: 'Failed to create user',
      details: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * Verify user credentials and issue JWT
 */
const verifyUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    Logger.http(req.body)

    const user = await UserModel.findOne({ username })
    if (!user) {
      return res.status(StatusCode.NOT_FOUND).send({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(StatusCode.UNAUTHORIZED).send({ message: 'Invalid credentials' })
    }

    // Generate JWT (expires in 1h)
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' })

    res.status(StatusCode.OK).send({ message: true, token })
  } catch (error) {
    Logger.error(error)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      message: `Error occurred while verifying user with username: ${req.body.username}`,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * Get all users
 */
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find()
    Logger.debug(users)
    res.status(StatusCode.OK).send(users)
  } catch (error) {
    Logger.error(error)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      message: 'Error occurred while trying to retrieve all users',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * Get user by ID
 */
const getUserWithId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    Logger.http(`userId: ${userId}`)

    const response = await UserModel.findById(userId)
    if (!response) {
      return res.status(StatusCode.NOT_FOUND).send({ message: `User with ID ${userId} not found` })
    }

    Logger.debug(response)
    res.status(StatusCode.OK).send(response)
  } catch (error) {
    Logger.error(error)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      message: `Error occurred while trying to retrieve user with ID: ${req.params.userId}`,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * Get user by query (username)
 */
const getUserWithQuery = async (req: Request, res: Response) => {
  try {
    const { username } = req.query
    Logger.http(`username: ${username}`)

    const response = await UserModel.find({ username })
    response.length !== 0
      ? res.status(StatusCode.OK).send(response)
      : res.status(StatusCode.NOT_FOUND).send({
          message: `Couldn't find user with username: ${username}`,
        })
  } catch (error) {
    Logger.error(error)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      message: `Error occurred while trying to retrieve user with username: ${req.query.username}`,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * Update user
 */
const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    let { firstname, lastname, email, username, password } = req.body

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(StatusCode.BAD_REQUEST).send({ message: `Can't update with empty body` })
    }

    if (password) {
      password = await encryptPassword(password)
    }

    const response = await UserModel.findByIdAndUpdate(
      userId,
      { firstname, lastname, email, username, password },
      { new: true }
    )

    if (!response) {
      return res.status(StatusCode.NOT_FOUND).send({ message: `User with ID ${userId} not found` })
    }

    res.status(StatusCode.OK).send(response)
  } catch (error) {
    Logger.error(error)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      message: `Error occurred while trying to update user with ID: ${req.params.userId}`,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * Delete user
 */
const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const response = await UserModel.findByIdAndDelete(userId)

    if (!response) {
      return res.status(StatusCode.NOT_FOUND).send({ message: `User with ID ${userId} not found` })
    }

    res.status(StatusCode.OK).send({
      message: `Successfully deleted user with username: ${response.username} and ID: ${userId}`,
    })
  } catch (error) {
    Logger.error(error)
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      message: `Error occurred while trying to delete user with ID: ${req.params.userId}`,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export default {
  createUser,
  verifyUser,
  getAllUsers,
  getUserWithId,
  getUserWithQuery,
  updateUser,
  deleteUser,
}
