"use client";

import { Bookmark } from "lucide-react";

import { useState } from "react";

import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import applyPin from "@/lib/api/user/applyPin";

export default function PinButton({
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
    <Button
      variant="ghost"
      size="sm"
      className="p-2 mt-1"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handlePin();
      }}
    >
      <Bookmark size={24} fill={pinned ? "#000000" : "none"} />
    </Button>
  );
}
