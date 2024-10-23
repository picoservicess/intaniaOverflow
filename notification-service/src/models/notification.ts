import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
    studentId: string;
    targetId: string;
    isThread: boolean;
    isReply: boolean;
    isUser: boolean;
    isSeen: boolean;
    payload: string;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema = new mongoose.Schema({
    studentId: { type: String, required: true },
    targetId: { type: String, required: true },
    isThread: { type: Boolean, required: true },
    isReply: { type: Boolean, required: true },
    isUser: { type: Boolean, required: true },
    isSeen: { type: Boolean, required: true },
    payload: { type: String, required: true }
}, { timestamps: true });

// Export the model
export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
