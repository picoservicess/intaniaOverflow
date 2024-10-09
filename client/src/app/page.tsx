'use client';

import React from 'react';
import { MessageSquare, ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Input } from '@/components/ui/input';

import { useRouter } from 'next/navigation';

import Icon from './assets/icon.svg';

const ForumHeader = () => (
  <header className="bg-white border-b p-4 flex justify-between items-center">
    <div className="flex gap-4 justify-center items-center">
      <div className="w-8 h-8">
        <Icon />
      </div>
      <div className="text-xl">
        <span className="text-black">intania</span>
        <span className="text-[#872f2f] font-bold">Overflow</span>
      </div>
      <nav className="space-x-2">
        <Button variant="ghost" size="sm">
          ปุ่ม1
        </Button>
        <Button variant="ghost" size="sm">
          ปุ่ม2
        </Button>
        <Button variant="ghost" size="sm">
          ปุ่ม3
        </Button>
        <Button variant="ghost" size="sm">
          ปุ่ม4
        </Button>
      </nav>
    </div>

    <div className="space-x-2">
      <Button variant="default">สร้างเธรด</Button>
      <Button variant="outline">เข้าสู่ระบบ</Button>
    </div>
  </header>
);

const PostList = () => {
  const posts = [
    {
      id: 1,
      author: 'Joanna Dominik',
      title: 'Videoask Widget is overlaid with next Videoask Widget - how to dismiss first?',
      replies: 2,
      upvotes: 5,
      downvotes: 1,
      time: '5 hours ago',
    },
  ];

  const router = useRouter();

  return (
    <Card onClick={() => router.push('/1111')}>
      <CardHeader>
        <CardTitle>
          <div className="flex space-x-4 text-sm text-gray-600">
            <span className="font-medium">Conversations</span>
            <span>Help others</span>
            <span>Categories</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {posts.map((post) => (
          <div key={post.id} className="flex items-start space-x-3 py-3 border-b">
            <Avatar>
              <AvatarFallback>{post.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">{post.author}</span>
                <span className="mx-1">·</span>
                <span>{post.time}</span>
              </div>
              <h3 className="font-medium mt-1">{post.title}</h3>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <Button variant="ghost" size="sm" className="p-0">
                  <ArrowBigUp size={16} className="mr-1" />
                  {post.upvotes}
                </Button>
                <Button variant="ghost" size="sm" className="p-0">
                  <ArrowBigDown size={16} className="mr-1" />
                  {post.downvotes}
                </Button>
                <Button variant="ghost" size="sm" className="p-0">
                  <MessageSquare size={16} className="mr-1" />
                  {post.replies}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const Sidebar = () => {
  const creators = [
    { name: 'john.duxborough', points: 229 },
    { name: 'Ibrahim masud', points: 181 },
    { name: 'mark.th', points: 98 },
    { name: 'sy', points: 93 },
    { name: 'joeledwards', points: 88 },
    { name: 'christiandavis', points: 60 },
    { name: 'odaabraham', points: 57 },
  ];

  return (
    <Card className="w-full md:w-[350px]">
      <CardHeader>
        <CardTitle className="text-xl">Top authors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {creators.map((creator, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold">{index + 1}</span>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-sm">{creator.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{creator.name}</span>
              </div>
              <span className="text-gray-600 font-medium">{creator.points} points</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const TypeformForum = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <ForumHeader />
      <div className="max-w-6xl mx-auto mt-8 px-4 flex flex-col md:flex-row gap-4 justify-center">
        <div className="flex">
          <PostList />
        </div>
        <div className="flex justify-center items-center">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default TypeformForum;
