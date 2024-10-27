"use client";

import { ArrowBigDown, ArrowBigUp, MessageSquare } from "lucide-react";

import React from "react";

import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PostList = () => {
  const posts = [
    {
      id: 1,
      author: "Joanna Dominik",
      title:
        "Videoask Widget is overlaid with next Videoask Widget - how to dismiss first?",
      replies: 2,
      upvotes: 5,
      downvotes: 1,
      time: "5 hours ago",
    },
  ];

  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex space-x-4 text-sm text-gray-600">
            <span className="font-medium">Conversations</span>
            <span>Help others</span>
            <span>Categories</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-start space-x-3 py-3 border-b cursor-pointer"
            onClick={() => router.push("/1111")}
          >
            <Avatar>
              <AvatarFallback>{post.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">{post.author}</span>
                <span className="mx-1">·</span>
                <span>{post.time}</span>
              </div>
              <h3 className="font-medium mt-1">{post.title}</h3>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <Button variant="ghost" size="sm" className="p-0">
                  <ArrowBigUp size={16} className="mr-1" />
                  {post.upvotes}
                </Button>
                <Button variant="ghost" size="sm" className="p-0">
                  <ArrowBigDown size={16} className="mr-1" />
                  {post.downvotes}
                </Button>
                <Button variant="ghost" size="sm" className="p-0">
                  <MessageSquare size={16} className="mr-1" />
                  {post.replies}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PostList;
