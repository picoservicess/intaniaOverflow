"use client";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import applyDownVote from "@/lib/api/vote/applyDownVote";
import applyUpVote from "@/lib/api/vote/applyUpVote";
import getVotes from "@/lib/api/vote/getCountVote";
import isUserVote from "@/lib/api/vote/isUserVote";

interface VoteButtonProps {
	isThread: boolean;
	targetId: string;
}

const VoteButton: React.FC<VoteButtonProps> = ({ isThread, targetId }) => {
	const { data: session } = useSession();
	const [voteStatus, setVoteStatus] = useState<number | null>(null);
	const [upVotes, setUpVotes] = useState<number>(0);
	const [downVotes, setDownVotes] = useState<number>(0);

	useEffect(() => {
		const initializeVotes = async () => {
			if (session?.user.accessToken) {
				const token = session.user.accessToken as string;

				try {
					const [voteResponse, votes] = await Promise.all([
						isUserVote(token, isThread, targetId),
						getVotes(isThread, targetId),
					]);
					setVoteStatus(voteResponse.voteStatus);
					setUpVotes(votes.upVotes);
					setDownVotes(votes.downVotes);
				} catch (error) {
					console.error("Error fetching votes:", error);
				}
			}
		};
		initializeVotes();
	}, [session, isThread, targetId]);

	const handleUpVote = async (event: React.MouseEvent) => {
		event.stopPropagation();
		if (!session) return;
		const token = session.user.accessToken as string;

		try {
			if (voteStatus === 1) {
				setVoteStatus(0);
				setUpVotes((prev) => prev - 1);
			} else {
				await applyUpVote(token, isThread, targetId);
				setVoteStatus(1);
				setUpVotes((prev) => (voteStatus === -1 ? prev + 2 : prev + 1));
				if (voteStatus === -1) setDownVotes((prev) => prev - 1);
			}
		} catch (error) {
			console.error("Error applying upvote:", error);
		}
	};

	const handleDownVote = async (event: React.MouseEvent) => {
		event.stopPropagation();
		if (!session) return;
		const token = session.user.accessToken as string;

		try {
			if (voteStatus === -1) {
				setVoteStatus(0);
				setDownVotes((prev) => prev - 1);
			} else {
				await applyDownVote(token, isThread, targetId);
				setVoteStatus(-1);
				setDownVotes((prev) => (voteStatus === 1 ? prev + 2 : prev + 1));
				if (voteStatus === 1) setUpVotes((prev) => prev - 1);
			}
		} catch (error) {
			console.error("Error applying downvote:", error);
		}
	};

	return (
		<div className="flex items-center gap-2 sm:gap-4 text-gray-600">
			<button className="flex items-center" onClick={handleUpVote} disabled={!session}>
				<ArrowBigUp
					className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${voteStatus === 1 ? "text-[#000000]" : ""}`}
				/>
				<span className="ml-1 text-xs sm:text-sm">{upVotes}</span>
			</button>
			<button className="flex items-center" onClick={handleDownVote} disabled={!session}>
				<ArrowBigDown
					className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${voteStatus === -1 ? "text-[#000000]" : ""}`}
				/>
				<span className="ml-1 text-xs sm:text-sm">{downVotes}</span>
			</button>
		</div>
	);
};

export default VoteButton;
