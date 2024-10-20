import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
    id: string;
    studentId: string;
    targetId: string;
    isThread: boolean;
    isReply: boolean;
    isUser: boolean;
    haveSeen: boolean;
    payload: string;
}

const NotificationSchema: Schema = new mongoose.Schema({
    id: { type: String, required: true },
    studentId: { type: String, required: true },
    targetId: { type: String, required: true },
    isThread: { type: Boolean, required: true },
    isReply: { type: Boolean, required: true },
    isUser: { type: Boolean, required: true },
    haveSeen: { type: Boolean, required: true },
    payload: { type: String, required: true }
});

// Export the model
export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
