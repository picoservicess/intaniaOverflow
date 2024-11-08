"use client";

import { Card, CardContent } from "@/components/ui/card";
import PostSkeleton from "./postSkeleton";

export default function PostListSkeleton () {
  return (
    <Card className="w-full">
      <CardContent className="mt-5 px-2 sm:px-6">
        {Array.from({ length: 5 }).map((_, index) => <PostSkeleton key={index} />)}
      </CardContent>
    </Card>
  );
}
