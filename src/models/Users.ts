import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUsers extends Document {
  email	: string;
  role	: string;
}

const UsersSchema: Schema = new mongoose.Schema({
  email	: { type: String, required: true },
  role	: { type: String, enum: ['admin', 'user'], required: true },
});

const Users = mongoose.models.Users || mongoose.model<IUsers>('Users', UsersSchema, 'users');

export default Users;
