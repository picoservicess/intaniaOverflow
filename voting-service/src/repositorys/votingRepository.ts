import { Vote } from "../models/vote";

export const applyUpVote = async (isThread: boolean, targetId: string, userId: string) => {
	try {
		const existingVote = await Vote.findOne({ isThread, targetId, userId });
		if (existingVote && existingVote.isUpVote) {
			await Vote.deleteOne({ isThread, targetId, userId });
			return { success: true, message: "Upvote removed" };
		} else if (existingVote && !existingVote.isUpVote) {
			existingVote.isUpVote = true;
			await existingVote.save();
			return { success: true, message: "Downvote changed to upvote" };
		} else {
			const vote = new Vote({
				targetId: targetId,
				isThread,
				isUpVote: true,
				userId,
			});
			await vote.save();
			return { success: true, message: "Upvote applied" };
		}
	} catch (error) {
		return { success: false, message: "Failed to apply upvote" };
	}
};

export const applyDownVote = async (isThread: boolean, targetId: string, userId: string) => {
	try {
		const existingVote = await Vote.findOne({
			isThread,
			targetId,
			userId,
		});
		if (existingVote && !existingVote.isUpVote) {
			await Vote.deleteOne({ isThread, targetId, userId });
			return { success: true, message: "Downvote removed" };
		} else if (existingVote && existingVote.isUpVote) {
			existingVote.isUpVote = false;
			await existingVote.save();
			return { success: true, message: "Upvote changed to downvote" };
		} else {
			const vote = new Vote({
				targetId: targetId,
				isThread,
				isUpVote: false,
				userId,
			});
			await vote.save();
			return { success: true, message: "Downvote applied" };
		}
	} catch (error) {
		return { success: false, message: "Failed to apply downvote" };
	}
};

export const getCountVote = async (isThread: boolean, targetId: string) => {
	try {
		const query = { targetId, isThread: isThread };
		const upVotes = await Vote.countDocuments({
			...query,
			isUpVote: true,
		});
		const downVotes = await Vote.countDocuments({
			...query,
			isUpVote: false,
		});
		const netVotes = upVotes - downVotes;

		return { upVotes, downVotes, netVotes };
	} catch (error) {
		return { success: false, message: "Failed to get vote count" };
	}
};

export const isUserVote = async (isThread: boolean, targetId: string, userId: string) => {
	try {
		const vote = await Vote.findOne({ isThread, targetId, userId });
		if (vote) {
			return vote.isUpVote ? 1 : -1;
		}
		return 0;
	} catch (error) {
		return { success: false, message: "Failed to check user vote" };
	}
};
