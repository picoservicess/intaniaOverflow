"use client";

import React from "react";
import { MessageSquare, ArrowBigUp, ArrowBigDown } from "lucide-react";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { Avatar, AvatarFallback } from "@/components/avatar";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/lib/utils";
import { Thread } from "@/lib/data";
import PinButton from "./PinButton";

interface PostListProps {
  threads: Thread[];
}

export default function PostList({ threads }: PostListProps) {
  const router = useRouter();

  return (
    <Card className="w-full">
      <CardContent className="mt-5">
        {threads.map((post) => (
          <div
            key={post.id}
            className="flex items-start space-x-3 py-3 border-b cursor-pointer relative"
            onClick={() => router.push("/" + post.id)}
          >
            <Avatar>
              <AvatarFallback>{post.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">{post.author}</span>
                <span className="mx-1">·</span>
                <span>{timeAgo(post.createdAt)}</span>
              </div>
              <p className="font-medium mt-1">{post.title}</p>

              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <Button variant="ghost" size="sm" className="p-0">
                  <ArrowBigUp size={18} />
                  {post.upvotes}
                </Button>
                <Button variant="ghost" size="sm" className="p-0">
                  <ArrowBigDown size={18} />
                  {post.downvotes}
                </Button>
                <Button variant="ghost" size="sm" className="p-0">
                  <MessageSquare size={16} className="mr-0.5" />
                  {post.replies}
                </Button>
                <PinButton size={16} />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
