"use client";

import { ArrowBigDown, ArrowBigUp, MessageSquare } from "lucide-react";

import React from "react";

import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IThread } from "@/lib/api/data";
import { timeAgo } from "@/lib/utils";

import PinButton from "../input/pinButton";

interface PostListProps {
  threads: IThread[];
}

export default function PostList({ threads }: PostListProps) {
  const router = useRouter();

  return (
    <Card className="w-full">
      <CardContent className="mt-5 px-2 sm:px-6">
        {threads.map((post) => (
          <div
            key={post.id}
            className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3 py-3 border-b cursor-pointer relative hover:bg-gray-50 transition-colors px-2"
            onClick={() => router.push("/thread/" + post.id)}
          >
            <div className="flex items-center sm:items-start space-x-3 w-full sm:w-auto">
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                <AvatarFallback>{post.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">{post.author}</span>
                  <span className="mx-1">·</span>
                  <span>{timeAgo(post.createdAt)}</span>
                </div>
                <p className="font-medium mt-1 text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
                  {post.title}
                </p>

                <div className="flex items-center flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600">
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    <ArrowBigUp className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    <span className="ml-1">{post.upvotes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    <ArrowBigDown className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    <span className="ml-1">{post.downvotes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    <MessageSquare className="w-4 h-4 sm:w-4 sm:h-4" />
                    <span className="ml-1">{post.replies}</span>
                  </Button>
                  <div className="ml-auto sm:ml-0">
                    <PinButton size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
