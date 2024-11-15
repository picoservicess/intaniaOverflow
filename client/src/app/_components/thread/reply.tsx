import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { timeAgo } from "@/lib/utils";

import FileList from "./fileList";
import ImageGallery from "./imageGallery";
import VoteSection from "./voteSection";

interface ReplyProps {
	reply: Reply;
	voteCount: VoteCounts;
	voteStatus: number;
	userDetail: User;
}

export default function Reply({ reply, voteCount, voteStatus, userDetail }: ReplyProps) {
	const result = {
		replyImages: [] as string[],
		replyFiles: [] as string[],
	};

	for (const url of reply.assetUrls) {
		if (url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".jpeg")) {
			result.replyImages.push(url);
		} else {
			result.replyFiles.push(url);
		}
	}

	const { replyImages, replyFiles } = result;

	return (
		<Card className="mb-4 sm:mb-6">
			<CardContent className="pt-4 sm:pt-6">
				<div className="flex flex-col sm:flex-row">
					<VoteSection
						voteCount={voteCount}
						voteStatus={voteStatus}
						isThread={false}
						targetId={reply.replyId}
					/>
					<div className="flex-grow flex flex-col gap-2">
						<div className="flex gap-2">
							<Avatar>
								<AvatarImage
									src={userDetail?.profileImage}
									className="size-full rounded-[inherit] object-cover"
								/>
								<AvatarFallback>{userDetail?.displayname?.[0]}</AvatarFallback>
							</Avatar>
							<div className="flex items-center text-sm text-gray-600">
								<span className="font-medium">{userDetail.displayname}</span>
								<span className="mx-1">·</span>
								<span>{timeAgo(new Date(reply.replyAt))}</span>
							</div>
						</div>
						<p>{reply.text}</p>
						{/* Image Gallery Section */}
						{replyImages.length > 0 && <ImageGallery images={replyImages} />}

						{replyFiles.length > 0 && <FileList assetUrls={replyFiles} />}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
