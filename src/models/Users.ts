import mongoose, { Document, Schema, Model } from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI!).then(() => {
}).catch((error) => {
    console.error("MongoDB connection error in Users model:", error);
});
export interface IUsers extends Document {
  _id   : mongoose.Schema.Types.ObjectId;
  email	: string;
  role	: string;
}

const UsersSchema: Schema = new mongoose.Schema({
  email	: { type: String, required: true, unique: true},
  role	: { type: String, enum: ['admin', 'user'], required: true },
});

const Users = mongoose.models.Users || mongoose.model<IUsers>('Users', UsersSchema, 'users');

export default Users;
