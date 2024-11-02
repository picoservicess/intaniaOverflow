"use client";

import React from "react";
import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import PostList from "@/app/_components/home/postList";
import EditProfileButton from "@/app/_components/profile/editProfileButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { IThread } from "@/lib/api/data";
import getPinnedThreads from "@/lib/api/getPinnedThreads";
import getUserThreads from "@/lib/api/getUserThreads";

export default function Page() {
  const { data: session } = useSession();
  const [pinnedThreads, setPinnedThreads] = useState<IThread[]>([]);
  const [userThreads, setUserThreads] = useState<IThread[]>([]);

  const profilePicture =
    "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80";
  const authorNorth = "Surapee";

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
    <div className="bg-gray-50 min-h-screen flex justify-center items-start gap-8 pt-8">
      <Card className="relative max-w-[250px]">
        <CardContent className="flex flex-col gap-6 pt-6 items-center">
          <div className="relative">
            <Avatar className="size-[100px]">
              <AvatarImage
                src={profilePicture}
                className="size-full rounded-[inherit] object-cover"
              />
              <AvatarFallback className="text-[32px]">
                {authorNorth[0]}
              </AvatarFallback>
            </Avatar>
            <EditProfileButton />
          </div>

          <div className="flex flex-col gap-3 text-center">
            <h4 className="break-words max-w-[220px]">___supee</h4>
            <p className="text-sm text-slate-500">
              6432193321@student.chula.ac.th
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="w-1/2flex-col gap-4 justify-center">
        <div className="flex justify-center mb-8">
          <p
            className={`w-full rounded-l-lg py-2 text-center ${
              !showPinned ? "bg-slate-800 text-white" : "bg-gray-200"
            }`}
            onClick={() => setShowPinned(false)}
          >
            ที่เกี่ยวกับฉัน
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
