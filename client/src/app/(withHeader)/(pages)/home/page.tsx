"use client";

import { useEffect, useState } from "react";
import getAllThreads from "@/lib/api/thread/getAllThreads";

import CreateThreadButton from "@/app/_components/home/createThreadButton";
import PostList from "@/app/_components/home/postList";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch threads on component mount
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const allThreads = await getAllThreads();
        setThreads(allThreads.threads.reverse());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    };

    fetchThreads();
  }, []); // Empty dependency array ensures this runs only once

  // Filter threads based on search term
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
        <CreateThreadButton setThread={setThreads} />
        <div className="space-y-4">
          {loading || threads.length > 0 ? (
            <PostList threads={filteredThreads} isParentLoading={loading} />
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


