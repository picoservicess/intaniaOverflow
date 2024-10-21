import { Card } from "@/components/card";
import { Avatar, AvatarFallback } from "@/components/avatar";
import CreateReplyButton from "../../components/createReplyButton";
import getThread from "@/lib/getThread";
import VoteSection from "@/components/voteSection";
import Reply from "@/components/reply";
import getReplies from "@/lib/getReplies";
import { timeAgo } from "@/lib/utils";

export default async function ThreadPage({
  params,
}: {
  params: { slug: string };
}) {
  console.log(params.slug);
  const thread = getThread(params.slug);
  const replies = getReplies(params.slug);
  if (!thread) {
    return <div>Loading...</div>; // Show loading while data is being fetched
  }
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <div className="flex-grow">
            <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
                {thread.title}
              </h1>
              <div className="flex gap-2 mb-3">
                {thread.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-gray-200 px-2 py-1 rounded-md"
                  >
                    # {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Avatar>
                  <AvatarFallback>{thread.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">{thread.author}</span>
                  <span className="mx-1">·</span>
                  <span>{timeAgo(thread.createdAt)}</span>
                </div>
              </div>
              <div className="w-full bg-gray-300 my-4 rounded-full h-[2px]" />
              <div className="flex flex-col sm:flex-row">
                <VoteSection initialVotes={2838} />
                <div className="flex-grow">
                  <p className="mb-2 sm:mb-4 text-sm sm:text-base">
                    {thread.body}
                  </p>
                </div>
              </div>
            </Card>
            <CreateReplyButton />
            {/* Answers */}
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
              {thread.replies} Answers
            </h2>
            {replies.map((reply) => (
              <Reply key={reply.id} reply={reply} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
