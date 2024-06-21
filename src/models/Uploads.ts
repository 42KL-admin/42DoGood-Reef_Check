import mongoose, { Document, Schema, Model } from "mongoose";
import Users from '@/models/Users';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI!).then(() => {
}).catch((error) => {
    console.error("MongoDB connection error in Uploads model:", error);
});

// Define the Uploads interface
export interface IUploads extends Document {
    user_id				: mongoose.Schema.Types.ObjectId;
    directory			: string;
    file_name			: string;
    status				: string;
    status_description	: string;
    created_at			: string;
}

// Define the Uploads schema
const UploadsSchema: Schema = new mongoose.Schema({
    user_id				: { type: mongoose.Schema.Types.ObjectId, required: true },
	directory			: { 
        type: String, 
        required: true,
        trim: true,
        validate: {
            validator: async function(value: string) {
                const user = await Users.findOne({ email: value });
                return user !== null;
            },
            message: 'Invalid email: no user found with this email'
        }
    },
    file_name			: { type: String, required: true, trim: true },
    status				: { 
        type: String, 
        enum: ['Uploaded', 'Processing', 'Failed', 'Successful'], 
        required: true 
    },
    status_description	: { type: String, trim: true },
    created_at			: { type: String, default: Date.now() }
});

// Define the Uploads model
const Uploads = mongoose.models.Uploads || mongoose.model<IUploads>('Uploads', UploadsSchema);

export default Uploads;
