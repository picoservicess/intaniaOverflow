import mongoose, { Document, Schema } from "mongoose";

export interface IVote extends Document {
	targetId: string; // Thread or reply ID
	isThread: boolean; // True = thread, False = reply
	isUpVote: boolean; // True = upvote, False = downvote
	userId: string; // ID of user voting
}

const VoteSchema: Schema = new Schema({
	targetId: { type: String, required: true },
	isThread: { type: Boolean, required: true },
	isUpVote: { type: Boolean, required: true },
	userId: { type: String, required: true },
});

export const Vote = mongoose.model<IVote>("Vote", VoteSchema);
