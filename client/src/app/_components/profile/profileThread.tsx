"use client";

import { useState } from 'react';
import PostList from '../home/postList';

interface ProfileThreadsProps {
  aboutMeThreads: PostListProps; 
  pinnedThreads: PostListProps; 
}

const ProfileThreads: React.FC<ProfileThreadsProps> = ({ aboutMeThreads, pinnedThreads }) => {
  const [showPinned, setShowPinned] = useState(false);

  return (
    <div className="w-1/2 flex-col gap-4 justify-center">
      <div className="flex justify-center mb-8">
        <p
          className={`w-full rounded-l-lg py-2 text-center ${
            !showPinned ? "bg-slate-800 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowPinned(false)}
        >
          ที่เกี่ยวกับฉัน
        </p>
        <p
          className={`w-full rounded-r-lg py-2 text-center ${
            showPinned ? "bg-slate-800 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowPinned(true)}
        >
          ที่บันทึกไว้
        </p>
      </div>
      <div>
        {showPinned ? (
          pinnedThreads.threads.length > 0 ? (
            <PostList 
              threads={pinnedThreads.threads}
              userDetails={pinnedThreads.userDetails}
              voteCounts={pinnedThreads.voteCounts}
              voteStatuses={pinnedThreads.voteStatuses}
              replyCounts={pinnedThreads.replyCounts} 
              pinStatuses={pinnedThreads.pinStatuses} 
            />
          ) : (
            <p className="text-center">ไม่พบผลลัพธ์</p>
          )
        ) : (
          aboutMeThreads.threads.length > 0 ? (
            <PostList 
              threads={aboutMeThreads.threads}
              userDetails={aboutMeThreads.userDetails}
              voteCounts={aboutMeThreads.voteCounts}
              voteStatuses={aboutMeThreads.voteStatuses}
              replyCounts={aboutMeThreads.replyCounts}
              pinStatuses={aboutMeThreads.pinStatuses}
            />
          ) : (
            <p className="text-center">ไม่พบผลลัพธ์</p>
          )
        )}
      </div>
    </div>
  );
};

export default ProfileThreads;
