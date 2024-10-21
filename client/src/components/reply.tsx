import React from "react";
import { Card, CardContent } from "./card";
import VoteSection from "./voteSection";
import { Avatar, AvatarFallback } from "@/components/avatar";
import { timeAgo } from "@/lib/utils";

export type Reply = {
  id: string;
  body: string;
  assetUrls: string[];
  author: string;
  createdAt: Date;
  votes: number;
};

interface ReplyProps {
  reply: Reply;
}

export default function Reply({ reply }: ReplyProps) {
  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row">
          <VoteSection initialVotes={reply.votes} />
          <div className="flex-grow flex flex-col gap-2">
            <div className="flex gap-2">
              <Avatar>
                <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">{reply.author}</span>
                <span className="mx-1">·</span>
                <span>{timeAgo(reply.createdAt)}</span>
              </div>
            </div>
            <p>{reply.body}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
