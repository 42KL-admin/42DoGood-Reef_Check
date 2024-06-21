import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

mongoose.connect(mongoURI!).then(() => {
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

export default mongoose;