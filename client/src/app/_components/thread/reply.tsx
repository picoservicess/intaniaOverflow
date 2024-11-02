import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { timeAgo } from "@/lib/utils";

import VoteSection from "./voteSection";

export type Reply = {
  id: string;
  body: string;
  assetUrls: string[];
  author: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
};

interface ReplyProps {
  reply: Reply;
}

export default function Reply({ reply }: ReplyProps) {
  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row">
          <VoteSection initialVotes={reply.upvotes - reply.downvotes} />
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
