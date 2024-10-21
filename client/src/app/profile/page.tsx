"use client";

import PostList from "@/components/postList";
import { Thread } from "@/lib/data";
import getPinnedThreads from "@/lib/getPinnedThreads";
import getUserThreads from "@/lib/getUserThreads";
import { useSession } from "next-auth/react";
import React from "react";
import { useState, useEffect } from "react";

export default function Page() {
  const { data: session } = useSession();
  const [pinnedThreads, setPinnedThreads] = useState<Thread[]>([]);
  const [userThreads, setUserThreads] = useState<Thread[]>([]);

  // From session instead of hardcoded user id
  useEffect(() => {
    async function fetchThreads() {
      console.log(session);
      const pinned = await getPinnedThreads("1");
      const user = await getUserThreads("1");
      setPinnedThreads(pinned);
      setUserThreads(user);
    }
    fetchThreads();
  }, []);
  const [showPinned, setShowPinned] = useState(true);
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-1/2 mx-auto pt-8 px-4 flex-col gap-4 justify-center">
        <div className="flex justify-center mb-8">
          <p
            className={`w-full rounded-l-lg py-2 text-center ${
              !showPinned ? "bg-slate-800 text-white" : "bg-gray-200"
            }`}
            onClick={() => setShowPinned(false)}
          >
            ของฉัน
          </p>
          <p
            className={`w-full rounded-r-lg py-2 text-center ${
              showPinned ? "bg-slate-800 text-white" : "bg-gray-200"
            }`}
            onClick={() => setShowPinned(true)}
          >
            ที่บันทึกไว้
          </p>
        </div>
        <PostList threads={showPinned ? pinnedThreads : userThreads} />
      </div>
    </div>
  );
}
