"use client";

import {
  ArrowBigDown,
  ArrowBigUp,
  Bookmark,
  MessageSquare,
} from "lucide-react";

import { useState } from "react";

import { useSession } from "next-auth/react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import applyPin from "@/lib/api/user/applyPin";
import applyDownVote from "@/lib/api/vote/applyDownVote";
import applyUpVote from "@/lib/api/vote/applyUpVote";
import { ANONYMOUS_USER, timeAgo } from "@/lib/utils";

interface PostProps {
  post: Thread;
  userDetail: User;
  voteCount: VoteCounts;
  voteStatus: number;
  replyCount: number;
  pinStatus: boolean;
}

export default function Post({
  post,
  userDetail,
  voteCount,
  voteStatus,
  replyCount,
  pinStatus,
}: PostProps) {
  const { data: session } = useSession();
  const [vote, setVote] = useState<VoteCounts>(voteCount);
  const [status, setStatus] = useState<number>(voteStatus);
  const [pinned, setPinned] = useState<boolean>(pinStatus);

  const handleUpVote = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault(); // Prevent navigation
    if (!session) return;
    const token = session.user.accessToken as string;

    try {
      await applyUpVote(token, true, post.threadId);
      if (status === 1) {
        setStatus(0);
        setVote((prev) => ({ ...prev, upVotes: prev.upVotes - 1 }));
      } else {
        setStatus(1);
        setVote((prev) => ({
          ...prev,
          upVotes: prev.upVotes + 1,
          downVotes: status === -1 ? prev.downVotes - 1 : prev.downVotes,
        }));
      }
    } catch (error) {
      console.error("Error applying upvote:", error);
    }
  };

  const handleDownVote = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault(); // Prevent navigation
    if (!session) return;
    const token = session.user.accessToken as string;

    try {
      await applyDownVote(token, true, post.threadId);
      if (status === -1) {
        setStatus(0);
        setVote((prev) => ({ ...prev, downVotes: prev.downVotes - 1 }));
      } else {
        setStatus(-1);
        setVote((prev) => ({
          ...prev,
          downVotes: prev.downVotes + 1,
          upVotes: status === 1 ? prev.upVotes - 1 : prev.upVotes,
        }));
      }
    } catch (error) {
      console.error("Error applying downvote:", error);
    }
  };

  const handlePin = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault(); // Prevent navigation
    if (!session || pinned) return;
    const token = session.user.accessToken as string;

    try {
      await applyPin(token, post.threadId);
      setPinned(true);
    } catch (error) {
      console.error("Error applying pin:", error);
    }
  };

  return (
    <Link
      href={`/thread/${post.threadId}`}
      className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3 py-3 border-b cursor-pointer relative hover:bg-gray-50 transition-colors px-2"
    >
      <div className="flex items-center sm:items-start space-x-3 w-full sm:w-auto">
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
          <AvatarImage
            src={
              post.isAnonymous
                ? ANONYMOUS_USER.profileImage
                : userDetail?.profileImage || ANONYMOUS_USER.profileImage
            }
            className="size-full rounded-[inherit] object-cover"
          />
          <AvatarFallback className="text-sm">
            {post.isAnonymous
              ? ANONYMOUS_USER.displayname[0]
              : userDetail?.displayname[0] || ANONYMOUS_USER.displayname[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600">
            <span className="font-medium">
              {post.isAnonymous
                ? ANONYMOUS_USER.displayname
                : userDetail?.displayname || ANONYMOUS_USER.displayname}
            </span>
            <span className="mx-1">·</span>
            <span>{timeAgo(new Date(post.createdAt))}</span>
          </div>
          <p className="font-medium mt-1 text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
            {post.title}
          </p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
            <Button
              variant="ghost"
              size="sm"
              className="p-0"
              onClick={handleUpVote}
            >
              <ArrowBigUp
                size={16}
                className="mr-1"
                fill={status === 1 ? "#4b5563" : "none"}
              />
              {vote.upVotes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-0"
              onClick={handleDownVote}
            >
              <ArrowBigDown
                size={16}
                className="mr-1"
                fill={status === -1 ? "#4b5563" : "none"}
              />
              {vote.downVotes}
            </Button>
            <Button variant="ghost" size="sm" className="p-0">
              <MessageSquare size={16} className="mr-1" />
              {replyCount}
            </Button>
            {session?.user.id != post.authorId && (
              <Button
                variant="ghost"
                size="sm"
                className="p-0"
                onClick={handlePin}
              >
                <Bookmark size={16} fill={pinned ? "#4b5563" : "none"} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
