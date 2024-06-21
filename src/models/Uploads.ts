import mongoose from '../../lib/mongoose';
import { Document, Schema } from 'mongoose';
import Users from './Users';

// Define the Uploads interface
export interface IUploads extends Document {
  // _id: mongoose.Schema.Types.ObjectId; // Uncomment this line when merging with frontend
  user_id: mongoose.Schema.Types.ObjectId;
  directory: string;
  file_name: string;
  status: string;
  status_description: string;
  created_at: Date;
}

// Define the Uploads schema
const UploadsSchema: Schema = new mongoose.Schema({
  // _id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Uncomment this line when merging with frontend
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
  directory: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: async function (value: string) {
        const user = await Users.findOne({ email: value });
        return user !== null;
      },
      message: 'Invalid email: no user found with this email'
    }
  },
  file_name: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['Uploaded', 'Processing', 'Failed', 'Successful'],
    required: true
  },
  status_description: { type: String, trim: true },
  created_at: { type: Date, default: Date.now }
});

// Define the Uploads model
const Uploads = mongoose.models.Uploads || mongoose.model<IUploads>('Uploads', UploadsSchema);

export default Uploads;
