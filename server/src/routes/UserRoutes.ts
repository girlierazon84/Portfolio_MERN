import { Express } from 'express'
import UserController from '../controllers/UserController'

const usersUrl = '/users'
const usersUrlWithId = `${usersUrl}/:userId`
const searchUsers = '/searchUser'
const verifyUserUrl = '/verifyUser'

const routes = (app: Express) => {
  // User registration & verification
  app.post(usersUrl, UserController.createUser)
  app.post(verifyUserUrl, UserController.verifyUser)

  // User retrieval
  app.get(usersUrl, UserController.getAllUsers)
  app.get(usersUrlWithId, UserController.getUserWithId)
  app.get(searchUsers, UserController.getUserWithQuery)

  // User management
  app.put(usersUrlWithId, UserController.updateUser)
  app.delete(usersUrlWithId, UserController.deleteUser)
}

export default { routes }
