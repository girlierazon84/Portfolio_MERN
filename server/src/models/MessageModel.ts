import { Schema, model } from 'mongoose'
import { ContactMessage } from '../utils/interfaces/Message'

const newMessageSchema = new Schema<ContactMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'read', 'responded'], // controlled values
    default: 'pending'
  }
},
{ timestamps: true })

// Define the collection name
const dbCollection = 'messages'

const MessageModel = model<ContactMessage>(dbCollection, newMessageSchema)

export default MessageModel
