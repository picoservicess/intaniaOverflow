import { getServerSession } from "next-auth";

import EditProfileButton from "@/app/_components/profile/editProfileButton";
import ProfileThreads from "@/app/_components/profile/profileThread";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import getRepliesByThread from "@/lib/api/reply/getRepliesByThread";
import getMyThread from "@/lib/api/thread/getMyThreads";
import getThread from "@/lib/api/thread/getThread";
import getUserDetail from "@/lib/api/user/getUserDetail";
import getUserProfile from "@/lib/api/user/getUserProfile";
import viewPinned from "@/lib/api/user/viewPinned";
import getVotes from "@/lib/api/vote/getCountVote";
import isUserVote from "@/lib/api/vote/isUserVote";

export default async function Page() {
	const session = await getServerSession(authOptions);
	const token = session?.user.accessToken as string;

	// User Profile
	const userProfile = await getUserProfile(session?.user.accessToken as string);

	// Pinned Threads
	const pinnedThreadIds: ViewPinned = await viewPinned(session?.user.accessToken as string);
	const pinnedThreadsPromises = pinnedThreadIds.threadIds.map(async (threadId) => {
		return await getThread(session?.user.accessToken as string, threadId);
	});
	const pinnedThreads = await Promise.all(pinnedThreadsPromises);
	const pinnedThreadsReplyCounts = await Promise.all(
		pinnedThreads.map(async (thread) => {
			const replies = await getRepliesByThread(thread.threadId);
			return replies.length;
		})
	);
	const pinnedThreadVoteCounts = await Promise.all(
		pinnedThreads.map(async (thread) => await getVotes(true, thread.threadId))
	);
	const pinnedThreadsVoteStatuses = await Promise.all(
		pinnedThreads.map(async (thread) => {
			const response = await isUserVote(token, true, thread.threadId);
			return response.voteStatus;
		})
	);
	const pinnedThreadsUserDetails = await Promise.all(
		pinnedThreads.map(async (thread) => {
			return await getUserDetail(token, thread.authorId);
		})
	);
	const pinnedThreadsPostlistProps: PostListProps = {
		threads: pinnedThreads,
		userDetails: pinnedThreadsUserDetails,
		voteCounts: pinnedThreadVoteCounts,
		voteStatuses: pinnedThreadsVoteStatuses,
		replyCounts: pinnedThreadsReplyCounts,
		pinStatuses: Array(pinnedThreads.length).fill(true),
	};

	// About me Threads
	const myThreadResponse = await getMyThread(token);
	const aboutMeThreads: Thread[] = myThreadResponse.threads.reverse();
	const aboutMeThreadsReplyCounts: number[] = await Promise.all(
		aboutMeThreads.map(async (thread) => {
			const replies = await getRepliesByThread(thread.threadId);
			return replies.length;
		})
	);
	const aboutMeThreadsVoteCounts: VoteCounts[] = await Promise.all(
		aboutMeThreads.map(async (thread) => await getVotes(true, thread.threadId))
	);
	const aboutMeThreadsVoteStatuses: number[] = await Promise.all(
		aboutMeThreads.map(async (thread) => {
			const response = await isUserVote(token, true, thread.threadId);
			return response.voteStatus;
		})
	);
	const aboutMeThreadsUserDetails: User[] = await Promise.all(
		aboutMeThreads.map(async (thread) => {
			return await getUserDetail(token, thread.authorId);
		})
	);
	const aboutMeThreadsPinStatuses: boolean[] = await Promise.all(
		aboutMeThreads.map(async (thread) => {
			return pinnedThreadIds.threadIds.includes(thread.threadId);
		})
	);
	const aboutMeThreadsPostlistProps: PostListProps = {
		threads: aboutMeThreads,
		userDetails: aboutMeThreadsUserDetails,
		voteCounts: aboutMeThreadsVoteCounts,
		voteStatuses: aboutMeThreadsVoteStatuses,
		replyCounts: aboutMeThreadsReplyCounts,
		pinStatuses: aboutMeThreadsPinStatuses,
	};

	if (!userProfile) return <p>Loading...</p>;

	return (
		<div className="bg-gray-50 min-h-screen flex justify-center items-start gap-8 pt-8">
			<Card className="relative max-w-[250px]">
				<CardContent className="flex flex-col gap-6 pt-6 items-center">
					<div className="relative">
						<Avatar className="size-[100px]">
							<AvatarImage
								src={userProfile.profileImage}
								className="size-full rounded-[inherit] object-cover"
							/>
							<AvatarFallback className="text-[32px]">{userProfile.displayname[0]}</AvatarFallback>
						</Avatar>
						<EditProfileButton />
					</div>

					<div className="flex flex-col gap-3 text-center">
						<h4 className="break-words max-w-[220px]">{userProfile.displayname}</h4>
						<p className="text-sm text-slate-500">{userProfile.email}</p>
					</div>
				</CardContent>
			</Card>
			<ProfileThreads
				aboutMeThreads={aboutMeThreadsPostlistProps}
				pinnedThreads={pinnedThreadsPostlistProps}
			/>
		</div>
	);
}
