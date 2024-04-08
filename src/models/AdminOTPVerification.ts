import mongoose, { Document, Schema, Model } from "mongoose";
const bcrypt = require('bcryptjs');

export interface IAdminOTPVerification extends Document {
    adminEmail: string;
    otp: string;
    salt: string;
    createdAt: Date;
    updatedAt: Date;
}

const AdminOTPVerificationSchema:Schema = new mongoose.Schema({
    adminEmail: { type: String, required: true },
    otp: { type: String, required: true },
    salt: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    expiresAt: { type: Date, default: Date.now() + 3600000},
});

// AdminOTPVerificationSchema.pre<IAdminOTPVerification>('save', async function(next) {
//     if (this.isModified('otp')) {
//         const salt = await bcrypt.genSalt(10);
//         this.salt = salt;
//         this.otp = await bcrypt.hash(this.otp, salt);
//     }
//     next();
// });

const AdminOTPVerification = mongoose.models.AdminOTPVerification || mongoose.model<IAdminOTPVerification>('AdminOTPVerification', AdminOTPVerificationSchema);

export default AdminOTPVerification;