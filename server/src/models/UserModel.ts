import { Schema, model } from 'mongoose'
import { CreateNewUser } from '../utils/interfaces/Users'


const newUserSchema = new Schema<CreateNewUser>({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
},
    {timestamps: true}
)

// Define the collection name for the users
const dbCollection = 'users';

const UserModel = model<CreateNewUser>(dbCollection, newUserSchema);

export default UserModel;