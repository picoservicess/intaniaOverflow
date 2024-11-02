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
          thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          thread.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setThreads(filteredThreads);
    };

    fetchThreads();
  }, [searchTerm]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="relative w-full px-4 py-4 flex justify-center items-center">
        <input
          type="text"
          placeholder="ค้นหาเลย!"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm sm:max-w-md md:max-w-lg px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
      </div>

      {/* Create Button and Content Section */}
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <CreateThreadButton />

        <div className="mt-6 space-y-4">
          {threads?.length > 0 ? (
            <PostList threads={threads} />
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
