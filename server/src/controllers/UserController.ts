import bcrypt from 'bcrypt'
import StatusCode from '../config/StatusCode'
import UserModel from '../models/UserModel'
import { CreateNewUser } from '../utils/interfaces/Users'
import Logger from '../utils/Logger'
import { Request, Response } from 'express'

const saltRounds = 10

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
    Logger.debug(user)

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

interface VerifyUser {
  message: boolean
}

interface SearchForUser {
  username: string
}

/**
 * Verify user credentials
 */
const verifyUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    Logger.http(req.body)

    const query: SearchForUser = { username: String(username) }
    const dbQuery = await UserModel.find(query)

    if (dbQuery.length === 0) {
      return res.status(StatusCode.NOT_FOUND).send({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(String(password), dbQuery[0].password)

    const response: VerifyUser = { message: isMatch }
    res.status(StatusCode.OK).send(response)
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
    Logger.debug(response)

    if (!response) {
      return res.status(StatusCode.NOT_FOUND).send({ message: `User with ID ${userId} not found` })
    }

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

    const query: SearchForUser = { username: String(username) }
    const response = await UserModel.find(query)
    Logger.debug(response)

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
    Logger.http(`userId: ${userId}`)
    let { firstname, lastname, email, username, password } = req.body

    if (!req.body) {
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

    Logger.debug(response)
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
