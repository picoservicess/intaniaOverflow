"use client";

import { useEffect, useRef, useState } from "react";
import searchThreads from "@/lib/api/thread/searchThreads";
import getVotes from "@/lib/api/vote/getCountVote";
import isUserVote from "@/lib/api/vote/isUserVote";
import getRepliesByThread from "@/lib/api/reply/getRepliesByThread";
import viewPinned from "@/lib/api/user/viewPinned";
import { Pagination } from "@nextui-org/pagination";

import CreateThreadButton from "@/app/_components/home/createThreadButton";
import PostList from "@/app/_components/home/postList";
import { useSession } from "next-auth/react";
import getUserDetail from "@/lib/api/user/getUserDetail";
import PostListSkeleton from "@/app/_components/home/postListSkeleton";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const ANONYMOUS_USER: User = {
  displayname: "Anonymous",
  profileImage: "",
};

const Home = () => {
  // Session
  const { data: session } = useSession();

  // Filtered
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Related Data
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [userDetails, setUserDetails] = useState<User[]>([]);
  const [voteCounts, setVoteCounts] = useState<VoteCounts[]>([]);
  const [voteStatuses, setVoteStatuses] = useState<number[]>([]);
  const [replyCounts, setReplyCounts] = useState<number[]>([]);
  const [pinStatuses, setPinStatuses] = useState<boolean[]>([]);

  // Loading
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(true);

  // Refs to track previous values
  const prevSearchTerm = useRef(searchTerm);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      if (prevSearchTerm.current !== searchTerm) {
        setPaginationLoading(true);
      }
      try {
        const threadsResponse = await searchThreads(searchTerm, page);
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
        setMaxPage(threadsResponse.pagination.totalPages);
        prevSearchTerm.current = searchTerm;
      } catch (error) {
        console.error("Error fetching home page data:", error);
      } finally {
        setLoading(false);
        setPaginationLoading(false);
      }
    };

    fetchHomeData();
  }, [searchTerm, session, page]);

  const handleKeyDown = (event: { key: string; }) => {
    if (event.key === "Enter") {
      setSearchTerm(inputValue);
      setPage(0);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative w-full px-4 py-4 flex justify-center items-center">
        <input
          type="text"
          placeholder="ค้นหาเลย!"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full max-w-sm sm:max-w-md md:max-w-lg px-4 py-2 border border-gray-300 rounded-l-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
        <Button
          className="rounded-r-full h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            setSearchTerm(inputValue);
            setPage(0);
          }}
        >
          <Search />
        </Button>
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
              threads={threads}
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
        {paginationLoading ? (
          <Pagination
            className="mt-3 animate-pulse"
            classNames={{
              item: "text-transparent",
              cursor: "text-transparent bg-gray-100",
            }}
            total={10}
            isDisabled
          />
        ) : (
          threads.length > 0 && (
            <Pagination
              className="mt-3"
              total={maxPage}
              initialPage={page + 1}
              onChange={(page) => setPage(page - 1)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Home;
