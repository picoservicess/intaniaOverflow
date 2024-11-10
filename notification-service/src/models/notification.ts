import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  senderId: string;
  receiverId: string;
  threadId: string,
  replyId: string,
  isThread: boolean;
  isReply: boolean;
  isUser: boolean;
  isSeen: boolean;
  payload: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    threadId: { type: String, required: true },
    replyId: { type: String, required: false },
    isThread: { type: Boolean, required: true },
    isReply: { type: Boolean, required: true },
    isUser: { type: Boolean, required: true },
    isSeen: { type: Boolean, required: true },
    payload: { type: String, required: true },
  },
  { timestamps: true }
);

// Export the model
export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
