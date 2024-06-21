import mongoose from '../../lib/mongoose';
import { Document, Schema } from 'mongoose';

// Define the Users interface
export interface IUsers extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  role: string;
}

// Define the Users schema
const UsersSchema: Schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'user'], required: true },
});

const Users = mongoose.models.Users || mongoose.model<IUsers>('Users', UsersSchema, 'users');

export default Users;
