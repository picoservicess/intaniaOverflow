"use client";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";

import { useState } from "react";

import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import applyDownVote from "@/lib/api/vote/applyDownVote";
import applyUpVote from "@/lib/api/vote/applyUpVote";

interface VoteButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  isActive: boolean;
}

const VoteButton: React.FC<VoteButtonProps> = ({
  icon: Icon,
  onClick,
  isActive,
}) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    className="rounded-full w-8 h-8 sm:w-10 sm:h-10 hover:bg-transparent"
  >
    <Icon
      className={`w-4 h-4 sm:w-6 sm:h-6 transition-colors ${
        isActive ? "text-[#8F2F2F] fill-[#8F2F2F]" : "hover:text-[#8F2F2F]"
      }`}
    />
  </Button>
);

interface VoteSectionProps {
  voteCount: VoteCounts;
  voteStatus: number;
  isThread: boolean;
  targetId: string;
}

const VoteSection: React.FC<VoteSectionProps> = ({
  voteCount,
  voteStatus,
  isThread,
  targetId,
}) => {
  const { data: session } = useSession();
  const [vote, setVote] = useState<VoteCounts>(voteCount);
  const [status, setStatus] = useState<number>(voteStatus);

  const handleUpVote: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.stopPropagation();
    if (!session) return;
    const token = session.user.accessToken as string;

    try {
      await applyUpVote(token, isThread, targetId);
      if (status === 1) {
        setStatus(0);
        setVote((prev) => ({ ...prev, upVotes: prev.upVotes - 1 }));
      } else {
        setStatus(1);
        setVote((prev) => ({
          ...prev,
          upVotes: prev.upVotes + 1,
          downVotes: status === -1 ? prev.downVotes - 1 : prev.downVotes,
        }));
      }
    } catch (error) {
      console.error("Error applying upvote:", error);
    }
  };

  const handleDownVote: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.stopPropagation();
    if (!session) return;
    const token = session.user.accessToken as string;

    try {
      await applyDownVote(token, isThread, targetId);
      if (status === -1) {
        setStatus(0);
        setVote((prev) => ({ ...prev, downVotes: prev.downVotes - 1 }));
      } else {
        setStatus(-1);
        setVote((prev) => ({
          ...prev,
          downVotes: prev.downVotes + 1,
          upVotes: status === 1 ? prev.upVotes - 1 : prev.upVotes,
        }));
      }
    } catch (error) {
      console.error("Error applying downvote:", error);
    }
  };

  return (
    <div className="flex flex-col items-center mr-2 sm:mr-4 mb-4 sm:mb-0">
      <VoteButton
        icon={ArrowBigUp}
        onClick={handleUpVote}
        isActive={status === 1}
      />
      <span className="text-sm sm:text-base font-bold my-1 sm:my-2">
        {vote.upVotes - vote.downVotes}
      </span>
      <VoteButton
        icon={ArrowBigDown}
        onClick={handleDownVote}
        isActive={status === -1}
      />
    </div>
  );
};

export default VoteSection;
