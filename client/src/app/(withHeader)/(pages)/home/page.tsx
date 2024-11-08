"use client";

import { useEffect, useState } from "react";
import getAllThreads from "@/lib/api/thread/getAllThreads";
import getVotes from "@/lib/api/vote/getCountVote";
import isUserVote from "@/lib/api/vote/isUserVote";
import getRepliesByThread from "@/lib/api/reply/getRepliesByThread";
import viewPinned from "@/lib/api/user/viewPinned";

import CreateThreadButton from "@/app/_components/home/createThreadButton";
import PostList from "@/app/_components/home/postList";
import { useSession } from "next-auth/react";
import getUserDetail from "@/lib/api/user/getUserDetail";
import PostListSkeleton from "@/app/_components/home/postListSkeleton";

const ANONYMOUS_USER: User = {
  displayname: "Anonymous",
  profileImage: "",
};

const Home = () => {
  // Session
  const { data: session } = useSession();

  // Filtered
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);

  // Related Data
  const [threads, setThreads] = useState<Thread[]>([]);
  const [userDetails, setUserDetails] = useState<User[]>([]);
  const [voteCounts, setVoteCounts] = useState<VoteCounts[]>([]);
  const [voteStatuses, setVoteStatuses] = useState<number[]>([]);
  const [replyCounts, setReplyCounts] = useState<number[]>([]);
  const [pinStatuses, setPinStatuses] = useState<boolean[]>([]);

  // Loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const threadsResponse = await getAllThreads();
        const threads = threadsResponse.threads;
        const voteCounts = await Promise.all(
          threads.map(async (thread) => await getVotes(true, thread.threadId))
        );
        const replyCounts = await Promise.all(
          threads.map(async (thread) => {
            const replies = await getRepliesByThread(thread.threadId);
            return replies.length;
          })
        );

        // Session Required
        const token = session?.user.accessToken as string;
        const voteStatuses = await Promise.all(
          threads.map(async (thread) => {
            if (token) {
              const response = await isUserVote(token, true, thread.threadId);
              return response.voteStatus;
            }
            return 0;
          })
        );

        let pinStatuses = new Array(threads.length).fill(false);
        if (session) {
          const allPinnedThreads = await viewPinned(token);
          pinStatuses = threads.map((thread) =>
            allPinnedThreads.threadIds.includes(thread.threadId)
          );
        }

        const userDetails = await Promise.all(
          threads.map(async (thread) => {
            if (token) {
              return await getUserDetail(token, thread.authorId);
            }
            return ANONYMOUS_USER;
          })
        );

        // Set States
        setThreads(threads);
        setUserDetails(userDetails);
        setVoteCounts(voteCounts);
        setVoteStatuses(voteStatuses);
        setReplyCounts(replyCounts);
        setPinStatuses(pinStatuses);
      } catch (error) {
        console.error("Error fetching home page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [session]);

  useEffect(() => {
    const filtered = threads.filter(
      (thread) =>
        thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredThreads(filtered);
  }, [searchTerm, threads]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative w-full px-4 py-4 flex justify-center items-center">
        <input
          type="text"
          placeholder="ค้นหาเลย!"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm sm:max-w-md md:max-w-lg px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <CreateThreadButton 
          setThread={setThreads}
          setUserDetails={setUserDetails}
          setVoteCounts={setVoteCounts}
          setVoteStatuses={setVoteStatuses}
          setReplyCounts={setReplyCounts}
          setPinStatuses={setPinStatuses}
        />
        <div className="space-y-4">
          {loading ? (
            <PostListSkeleton />
          ) : threads.length > 0 ? (
            <PostList
              threads={filteredThreads}
              userDetails={userDetails}
              voteCounts={voteCounts}
              voteStatuses={voteStatuses}
              replyCounts={replyCounts}
              pinStatuses={pinStatuses}
            />
          ) : (
            <div className="w-full flex justify-center items-center p-8">
              <p className="text-gray-500 text-center text-sm sm:text-base">
                ไม่พบผลลัพธ์ที่ค้นหา
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
