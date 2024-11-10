"use client";

import { Card, CardContent } from "@/components/ui/card";

import Post from "./post";

export default function PostList({
	threads,
	userDetails,
	voteCounts,
	voteStatuses,
	replyCounts,
	pinStatuses,
}: PostListProps) {
	return (
		<Card className="w-full">
			<CardContent className="mt-5 px-2 sm:px-6">
				{threads.map((thread, index) => (
					<Post
						key={thread.threadId}
						post={thread}
						userDetail={userDetails[index]}
						voteCount={voteCounts[index]}
						voteStatus={voteStatuses[index]}
						replyCount={replyCounts[index]}
						pinStatus={pinStatuses[index]}
					/>
				))}
			</CardContent>
		</Card>
	);
}
