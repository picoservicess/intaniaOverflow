"use client";

import { useEffect, useState } from "react";

import { IThread } from "@/lib/data";
import getThreads from "@/lib/getThreads";

import CreateThreadButton from "./_components/home/createThreadButton";
import PostList from "./_components/home/postList";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [threads, setThreads] = useState<IThread[]>([]);

  useEffect(() => {
    const fetchThreads = async () => {
      const allThreads = await getThreads();
      const filteredThreads = allThreads.filter(
        (thread) =>
          thread.title.includes(searchTerm) ||
          thread.tags.some((tag) => tag.includes(searchTerm))
      );
      setThreads(filteredThreads);
    };

    fetchThreads();
  }, [searchTerm]);
  return (
    <div className="bg-gray-50 min-h-screen">
      <CreateThreadButton />
      <div className="w-1/2 mx-auto pt-8 px-4 flex flex-col md:flex-row gap-4 justify-center">
        <input
          type="text"
          placeholder="ค้นหาเลย!"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="absolute w-1/3 top-[14px] px-3 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {threads?.length > 0 ? (
          <PostList threads={threads} />
        ) : (
          <p>No Result</p>
        )}
      </div>
    </div>
  );
};

export default Home;
