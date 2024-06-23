import mongoose from '../../lib/mongoose';
import { Document, Schema } from 'mongoose';

export interface IAdminOTPVerification extends Document {
    adminEmail: string;
    otp: string;
    salt: string;
    createdAt: Date;
    expiresAt: Date;
}

const AdminOTPVerificationSchema:Schema = new mongoose.Schema({
    adminEmail: { type: String, required: true },
    otp: { type: String, required: true },
    salt: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    expiresAt: { type: Date, default: Date.now() + 3600000},
});

const AdminOTPVerification = mongoose.models.AdminOTPVerification || mongoose.model<IAdminOTPVerification>('AdminOTPVerification', AdminOTPVerificationSchema);

export default AdminOTPVerification;