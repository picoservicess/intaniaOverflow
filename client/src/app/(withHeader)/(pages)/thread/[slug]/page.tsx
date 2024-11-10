import React from "react";

import { getServerSession } from "next-auth";

import PinButton from "@/app/_components/input/pinButton";
import ReplySection from "@/app/_components/thread/ReplySection";
import FileList from "@/app/_components/thread/fileList";
import ImageGallery from "@/app/_components/thread/imageGallery";
import UpdateThreadButton from "@/app/_components/thread/updateThreadButton";
import VoteSection from "@/app/_components/thread/voteSection";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import getMyThread from "@/lib/api/thread/getMyThreads";
import getThread from "@/lib/api/thread/getThread";
import getUserDetail from "@/lib/api/user/getUserDetail";
import viewPinned from "@/lib/api/user/viewPinned";
import getVotes from "@/lib/api/vote/getCountVote";
import isUserVote from "@/lib/api/vote/isUserVote";
import { timeAgo } from "@/lib/utils";

export default async function ThreadPage({
	params,
}: {
	params: { slug: string };
}) {
	const session = await getServerSession(authOptions);

	if (!session?.user.accessToken) return;
	const token = session.user.accessToken;

	const threadData: Thread = await getThread(token, params.slug);
	const authorData: User = await getUserDetail(token, threadData.authorId);
	const pinnedData = await viewPinned(token);
	const pinnedStatus = pinnedData.threadIds.includes(threadData.threadId);
	const voteCount = await getVotes(true, threadData.threadId);
	const voteStatusResponse = await isUserVote(token, true, threadData.threadId);
	const voteStatus = voteStatusResponse.voteStatus;

	// Check my thread
	const mythreadResponse = await getMyThread(token);
	const myThreadIds = mythreadResponse.threads.map((thread: Thread) => thread.threadId);
	const isMyThread = myThreadIds.includes(threadData.threadId);

	const result = {
		threadImages: [] as string[],
		threadFiles: [] as string[],
	};

	for (const url of threadData.assetUrls) {
		if (url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".jpeg")) {
			result.threadImages.push(url);
		} else {
			result.threadFiles.push(url);
		}
	}

	const { threadImages, threadFiles } = result;

	return (
		<div className="bg-gray-100 min-h-screen">
			<div className="max-w-5xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col space-y-4 sm:space-y-6">
					<div className="flex-grow">
						<Card className="p-4 sm:p-6 mb-4 sm:mb-6 max-w-4xl mx-auto">
							<div className="flex justify-between items-start">
								<h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">{threadData.title}</h1>
								<div className="flex gap-3">
									{isMyThread ? (
										<UpdateThreadButton threadToUpdate={threadData} />
									) : (
										<PinButton
											className="pt-2"
											size={24}
											threadId={params.slug}
											pinnedStatus={pinnedStatus}
										/>
									)}
								</div>
							</div>
							<div className="flex flex-wrap gap-2 mb-3">
								{threadData.tags.map((tag) => (
									<span key={tag} className="text-sm bg-gray-200 px-2 py-1 rounded-md">
										# {tag}
									</span>
								))}
							</div>
							<div className="flex gap-2">
								<Avatar>
									<AvatarImage
										src={authorData?.profileImage}
										className="size-full rounded-[inherit] object-cover"
									/>
									<AvatarFallback>{authorData?.displayname?.[0]}</AvatarFallback>
								</Avatar>
								<div className="flex items-center text-sm text-gray-600">
									<span className="font-medium">{authorData?.displayname}</span>
									<span className="mx-1">·</span>
									<span>โพสเมื่อ {timeAgo(new Date(threadData.createdAt))}</span>
									{threadData.createdAt != threadData.updatedAt && (
										<>
											<span className="mx-1">·</span>
											<span>แก้ไขล่าสุด {timeAgo(new Date(threadData.updatedAt))}</span>
										</>
									)}
								</div>
							</div>
							<div className="w-full bg-gray-300 my-4 rounded-full h-[2px]" />
							<div className="flex flex-col sm:flex-row gap-4">
								<VoteSection
									voteCount={voteCount}
									voteStatus={voteStatus}
									isThread={true}
									targetId={threadData.threadId}
								/>
								<div className="flex-grow">
									<div
										className="mb-2 sm:mb-4 text-sm sm:text-base"
										dangerouslySetInnerHTML={{
											__html: threadData.body.replace(/\n/g, "<br />"),
										}}
									></div>

									{threadImages.length > 0 && <ImageGallery images={threadImages} />}
									{threadFiles.length > 0 && <FileList assetUrls={threadFiles} />}
								</div>
							</div>
						</Card>
						{/* Replies Section */}
						<ReplySection threadId={params.slug} />
					</div>
				</div>
			</div>
		</div>
	);
}
