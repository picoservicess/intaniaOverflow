"use client";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import getRepliesByThread from "@/lib/api/reply/getRepliesByThread";
import getUserDetail from "@/lib/api/user/getUserDetail";
import getVotes from "@/lib/api/vote/getCountVote";
import isUserVote from "@/lib/api/vote/isUserVote";

import CreateReplyButton from "./createReplyButton";
import Reply from "./reply";
import ReplySectionSkeleton from "./replySectionSkeleton";

export default function ReplySection({ threadId }: { threadId: string }) {
  // Session
  const { data: session } = useSession();

  // Related Data
  const [replies, setReplies] = useState<Reply[]>([]);
  const [userDetails, setUserDetails] = useState<User[]>([]);
  const [voteCounts, setVoteCounts] = useState<VoteCounts[]>([]);
  const [voteStatuses, setVoteStatuses] = useState<number[]>([]);

  // Loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReplySectionData = async () => {
      setLoading(true);
      try {
        const token = session?.user.accessToken as string;
        const replies = await getRepliesByThread(threadId);
        replies.reverse();
        const voteCounts = await Promise.all(
          replies.map(async (reply) => await getVotes(false, reply.replyId))
        );
        const voteStatuses = await Promise.all(
          replies.map(async (reply) => {
            const response = await isUserVote(token, false, reply.replyId);
            return response.voteStatus;
          })
        );
        const userDetails = await Promise.all(
          replies.map(async (reply) => {
            return await getUserDetail(token, reply.userId);
          })
        );

        // Set States
        setReplies(replies);
        setVoteCounts(voteCounts);
        setVoteStatuses(voteStatuses);
        setUserDetails(userDetails);
      } catch (error) {
        console.error("Error fetching reply section data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReplySectionData();
  }, [session, threadId]);

  return (
    <div className="max-w-4xl mx-auto">
      {loading ? (
        <ReplySectionSkeleton />
      ) : (
        <>
          <CreateReplyButton
            setReplies={setReplies}
            setUserDetails={setUserDetails}
            setVoteCounts={setVoteCounts}
            setVoteStatuses={setVoteStatuses}
          />
          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
            {replies.length} Answers
          </h2>
          {replies.map((reply, index) => (
            <Reply
              key={reply.replyId}
              reply={reply}
              voteCount={voteCounts[index]}
              voteStatus={voteStatuses[index]}
              userDetail={userDetails[index]}
            />
          ))}
        </>
      )}
    </div>
  );
}
