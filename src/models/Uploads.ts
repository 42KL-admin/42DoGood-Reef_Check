import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUploads extends Document {
    user_id             : mongoose.Schema.Types.ObjectId;
    file_name           : string;
    status              : string;
    status_description  : string;
    created_at          : Date;
}

const UploadsSchema:Schema = new mongoose.Schema({
    user_id             : { type: mongoose.Schema.Types.ObjectId, required: true },
    file_name           : { type: String, required: true, trim: true},
    status              : { type: String, enum: ['Uploaded', 'Processing', 'Failed', 'Successful'], required: true }, 
    status_description  : { type: String, trim: true }, 
    created_at          : { type: Date, trim: true, default: Date.now },
});

const Uploads = mongoose.models.Uploads || mongoose.model<IUploads>('Uploads', UploadsSchema);

export default Uploads; 