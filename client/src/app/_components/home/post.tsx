"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PinButton from "../input/pinButton";
import getUserDetail from "@/lib/api/user/getUserDetail";
import { timeAgo } from "@/lib/utils";
import { useSession } from "next-auth/react";
import VoteButton from "../input/voteButton";
import getRepliesByThread from "@/lib/api/reply/getRepliesByThread";
interface PostProps {
  post: Thread;
}

const ANONYMOUS_USER: User = {
  displayname: "Anonymous",
  profileImage: "",
};

export default function Post({ post }: PostProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [userDetail, setUserDetail] = useState<User>(ANONYMOUS_USER);
  const [replyCount, setReplyCount] = useState<number>(0);
  
  useEffect(() => {
    const fetchData = async () => {
      if (post.isAnonymous || !session?.user.accessToken) {
        setUserDetail(ANONYMOUS_USER);
        return;
      }
  
      const accessToken = session.user.accessToken as string;
      try {
        const [detail, replies] = await Promise.all([
          getUserDetail(accessToken, post.authorId),
          getRepliesByThread(accessToken, post.threadId),
        ]);
  
        setUserDetail(detail);
        setReplyCount(replies.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);  

  return (
    <div
      className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3 py-3 border-b cursor-pointer relative hover:bg-gray-50 transition-colors px-2"
      onClick={() => router.push("/thread/" + post.threadId)}
    >
      <div className="flex items-center sm:items-start space-x-3 w-full sm:w-auto">
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
          <AvatarImage
            src={userDetail?.profileImage}
            className="size-full rounded-[inherit] object-cover"
          />
          <AvatarFallback className="text-sm">
            {userDetail?.displayname[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600">
            <span className="font-medium">{userDetail?.displayname}</span>
            <span className="mx-1">·</span>
            <span>{timeAgo(new Date(post.createdAt))}</span>
          </div>
          <p className="font-medium mt-1 text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
            {post.title}
          </p>
          <div className="flex items-center flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600">
            <VoteButton 
              isThread={true} 
              targetId={post.threadId}
            />
            <Button variant="ghost" size="sm" className="h-auto p-1 gap-1">
              <MessageSquare className="w-4 h-4 sm:w-4 sm:h-4" />
              <span className="ml-1 text-xs sm:text-sm">{replyCount}</span> {/* Displaying the reply count */}
            </Button>
            <div className="ml-auto sm:ml-0">
              <PinButton threadId={post.threadId} size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
