import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ReplySectionSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="h-10 bg-gray-300 rounded-md mb-4" />
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="p-4 bg-gray-200 rounded-md mb-2">
          <div className="flex items-center gap-2 mb-2">
            <Avatar>
              <AvatarFallback className="bg-gray-300" />
            </Avatar>
            <div className="flex flex-col space-y-1">
              <div className="w-20 h-4 bg-gray-300 rounded-md" />
              <div className="w-16 h-4 bg-gray-300 rounded-md" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded-md" />
            <div className="h-4 bg-gray-300 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
