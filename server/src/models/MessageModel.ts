import { Schema, model } from 'mongoose'
import { ContactMessage } from '../utils/interfaces/Message'

const newMessageSchema = new Schema<ContactMessage>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
},
    {timestamps: true}
)

// Define the collection name for the messages
const dbCollection = 'messages';

const MessageModel = model<ContactMessage>(dbCollection, newMessageSchema);

export default MessageModel;