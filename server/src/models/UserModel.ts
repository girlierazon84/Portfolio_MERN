import { Schema, model } from 'mongoose'
import { CreateNewUser } from '../utils/interfaces/Users'

const userSchema = new Schema<CreateNewUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true })

const UserModel = model<CreateNewUser>('users', userSchema)

export default UserModel
