"use client";

import { Bookmark } from "lucide-react";
import { useState, useEffect } from "react";

import applyPin from "@/lib/api/applyPin";
import { useSession } from "next-auth/react";
import viewPinned from "@/lib/api/viewPinned";

export default function PinButton({
  className = "",
  size,
  threadId,
}: {
  className?: string;
  size?: number;
  threadId: string;
}) {
  const { data: session } = useSession();
  const [pinned, setPinned] = useState<boolean>(false);

  useEffect(() => {
    const fetchIsPinned = async () => {
      if (!session?.user.accessToken) return;
      try {
        const pinnedThreadIds = await viewPinned(session.user.accessToken);
        setPinned(pinnedThreadIds.threadIds.includes(threadId));
      } catch (err) {
        console.error("Error checking if thread is pinned:", err);
      }
    };

    if(!session?.user.accessToken) return;
    fetchIsPinned();
  }, [session, threadId]);

  const handlePin = async () => {
    if (!session?.user.accessToken || pinned) return;

    try {
      await applyPin(session.user.accessToken, threadId);
      setPinned(true);
    } catch (error) {
      console.error("Error applying pin:", error);
    }
  };

  return (
    <div
      title="Pin"
      className={`cursor-pointer ${className}`}
      role="button"
      aria-pressed={pinned}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handlePin();
      }}
    >
      <Bookmark size={size} fill={pinned ? "#000000" : "none"} />
    </div>
  );
}
