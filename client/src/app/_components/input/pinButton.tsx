"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";

import applyPin from "@/lib/api/user/applyPin";
import { useSession } from "next-auth/react";

export default function PinButton({
  className = "",
  size,
  threadId,
  pinnedStatus,
}: {
  className?: string;
  size?: number;
  threadId: string;
  pinnedStatus: boolean;
}) {
  const { data: session } = useSession();
  const [pinned, setPinned] = useState<boolean>(pinnedStatus);

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
