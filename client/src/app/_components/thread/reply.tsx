import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { timeAgo } from "@/lib/utils";

import VoteSection from "./voteSection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getUserDetail from "@/lib/api/user/getUserDetail";
import ImageGallery from "./imageGallery";
import FileList from "./fileList";
import getVotes from "@/lib/api/vote/getCountVote";
import isUserVote from "@/lib/api/vote/isUserVote";

export default async function Reply({ reply }: {reply: Reply}) {
  const session = await getServerSession(authOptions);
  if(!session) return;
  const token = session.user.accessToken;

  const authorData:User = await getUserDetail(session.user.accessToken, reply.userId);
  const voteCount = await getVotes(false, reply.replyId);
  const voteStatusResponse = await isUserVote(token, true, reply.replyId);
  const voteStatus = voteStatusResponse.voteStatus;

  const result = {
    replyImages: [] as string[],
    replyFiles: [] as string[]
  };

  for (const url of reply.assetUrls) {
    if (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.jpeg')) {
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
                    src={authorData?.profileImage}
                    className="size-full rounded-[inherit] object-cover"
                  />
                  <AvatarFallback>{authorData?.displayname?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">{authorData.displayname}</span>
                <span className="mx-1">·</span>
                <span>{timeAgo(new Date(reply.replyAt))}</span>
              </div>
            </div>
            <p>{reply.text}</p>
            {/* Image Gallery Section */}
            {replyImages.length > 0 && (
                <ImageGallery images={replyImages} />
              )}
              
              {replyFiles.length > 0 && (
                <FileList assetUrls={replyFiles} />
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
