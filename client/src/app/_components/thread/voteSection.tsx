"use client";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";

interface VoteButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
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
  initialVotes: number;
}

const VoteSection: React.FC<VoteSectionProps> = ({ initialVotes }) => {
  const [votes, setVotes] = useState<number>(initialVotes);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  const handleVote = (type: "up" | "down") => {
    if (userVote === type) {
      setUserVote(null);
      setVotes(initialVotes);
    } else {
      setUserVote(type);
      setVotes((prevVotes) => (type === "up" ? prevVotes + 1 : prevVotes - 1));
    }
  };

  return (
    <div className="flex flex-col items-center mr-2 sm:mr-4 mb-4 sm:mb-0">
      <VoteButton
        icon={ArrowBigUp}
        onClick={() => handleVote("up")}
        isActive={userVote === "up"}
      />
      <span className="text-sm sm:text-base font-bold my-1 sm:my-2">
        {votes}
      </span>
      <VoteButton
        icon={ArrowBigDown}
        onClick={() => handleVote("down")}
        isActive={userVote === "down"}
      />
    </div>
  );
};

export default VoteSection;
