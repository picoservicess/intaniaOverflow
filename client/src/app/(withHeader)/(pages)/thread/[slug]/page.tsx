import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import getThread from "@/lib/api/thread/getThread";
import { timeAgo } from "@/lib/utils";
import ImageGallery from "@/app/_components/thread/imageGallery";
import PinButton from "@/app/_components/input/pinButton";
import CreateReplyButton from "@/app/_components/thread/createReplyButton";
import FileList from "@/app/_components/thread/fileList";
import VoteSection from "@/app/_components/thread/voteSection";
import getUserDetail from "@/lib/api/user/getUserDetail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getRepliesByThread from "@/lib/api/reply/getRepliesByThread";
import Reply from "@/app/_components/thread/reply";

export default async function ThreadPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);

  if (!(session?.user.accessToken)) {
    return;
  }

  const threadData:Thread = await getThread(session.user.accessToken, params.slug);
  const repliesData:Reply[] = await getRepliesByThread(session.user.accessToken, params.slug);
  const authorData:User = await getUserDetail(session.user.accessToken, threadData.authorId);

  const result = {
    threadImages: [] as string[],
    threadFiles: [] as string[]
  };


  for (const url of threadData.assetUrls) {
    if (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.jpeg')) {
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
            <Card className="p-4 sm:p-6 mb-4 sm:mb-6 relative max-w-4xl mx-auto">
              <PinButton className="absolute top-9 right-8" size={24} threadId={params.slug}/>
              <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
                {threadData.title}
              </h1>
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
                  <span>{timeAgo(new Date(threadData.createdAt))}</span>
                </div>
              </div>
              <div className="w-full bg-gray-300 my-4 rounded-full h-[2px]" />
              <div className="flex flex-col sm:flex-row gap-4">
                <VoteSection initialVotes={2838} />
                <div className="flex-grow">
                  <p className="mb-2 sm:mb-4 text-sm sm:text-base">
                    {threadData.body}
                  </p>
                </div>
              </div>
              {threadImages.length > 0 && (
                <ImageGallery images={threadImages} />
              )}
              
              {threadFiles.length > 0 && (
                <FileList assetUrls={threadFiles} />
              )}
            </Card>
            <div className="max-w-4xl mx-auto">
              <CreateReplyButton />
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
                {repliesData.length} Answers
              </h2>
              {
                repliesData.map((reply) => (
                  <Reply key={reply.replyId} reply={reply} />
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
