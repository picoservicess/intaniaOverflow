"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import PostListSkeleton from "./postListSkeleton";
import Post from "./post";

export default function PostList({ threads, isParentLoading }: { threads: Thread[], isParentLoading?: boolean }) {
  return (
    <Card className="w-full">
      <CardContent className="mt-5 px-2 sm:px-6">
        {isParentLoading ? (
          Array.from({ length: 5 }).map((_, index) => <PostListSkeleton key={index} />)
        ) : (
          threads.map((post) => <Post key={post.threadId} post={post} />)
        )}
      </CardContent>
    </Card>
  );
}
