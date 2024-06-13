import mongoose, { Document, Schema, Model } from "mongoose";
// const bcrypt = require('bcryptjs');

export interface ISessionID extends Document {
	sessionID: string;
    adminEmail: string;
    createdAt: Date;
    expiresAt: Date;
}

const AdminSessionIDSchema:Schema = new mongoose.Schema({
	sessionID: { type: String, required: true },
    adminEmail: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },	
    expiresAt: { type: Date, default: Date.now() + 3600000},
});

const AdminSessionID = mongoose.models.AdminSessionID || mongoose.model<ISessionID>('AdminSessionID', AdminSessionIDSchema);

export default AdminSessionID;