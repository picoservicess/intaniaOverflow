"use client";

import { ArrowBigDown, ArrowBigUp, MessageSquare, Share2 } from "lucide-react";

import React, { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CreateReplyButton from "../../components/createReplyButton";
import getThread from "@/lib/getThread";
import VoteSection from "@/components/voteSection";
import Reply from "@/components/reply";
import getReplies from "@/lib/getReplies";
import { timeAgo } from "@/lib/utils";
import PinButton from "@/components/PinButton";
import EmblaCarousel from "@/components/EmblaCarousel";
import FileList from "@/components/FileList";

interface VoteButtonProps {
  // Fixed the icon prop type for TypeScript
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
  isActive: boolean;
}

const VoteButton: React.FC<VoteButtonProps> = ({
  icon: Icon,
  onClick,
  isActive,
}) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    className="rounded-full w-8 h-8 sm:w-10 sm:h-10 hover:bg-transparent"
  >
    <Icon
      className={`w-4 h-4 sm:w-6 sm:h-6 transition-colors ${
        isActive ? "text-[#8F2F2F] fill-[#8F2F2F]" : "hover:text-[#8F2F2F]"
      }`}
    />
  </Button>
);

interface VoteSectionProps {
  initialVotes: number;
}

const VoteSection: React.FC<VoteSectionProps> = ({ initialVotes }) => {
  const [votes, setVotes] = useState<number>(initialVotes);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  const handleVote = (type: "up" | "down") => {
    if (userVote === type) {
      setUserVote(null);
      setVotes(initialVotes);
    } else {
      setUserVote(type);
      setVotes((prevVotes) => (type === "up" ? prevVotes + 1 : prevVotes - 1));
    }
  };

  return (
    <div className="flex flex-col items-center mr-2 sm:mr-4 mb-4 sm:mb-0">
      <VoteButton
        icon={ArrowBigUp}
        onClick={() => handleVote("up")}
        isActive={userVote === "up"}
      />
      <span className="text-sm sm:text-base font-bold my-1 sm:my-2">
        {votes}
      </span>
      <VoteButton
        icon={ArrowBigDown}
        onClick={() => handleVote("down")}
        isActive={userVote === "down"}
      />
    </div>
  );
};

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
            <Card className="p-4 sm:p-6 mb-4 sm:mb-6 relative">
              <PinButton className={"absolute top-9 right-8"} size={24} />
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
              <EmblaCarousel
                slides={[
                  "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
                  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
                  "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca",
                ]}
              />
              <FileList />
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
