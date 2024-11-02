"use client";

import React, { useEffect, useState } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { IReply, IThread } from "@/lib/data";
import getReplies from "@/lib/getReplies";
import getThread from "@/lib/getThread";
import { timeAgo } from "@/lib/utils";

import PinButton from "../../../_components/input/pinButton";
import CreateReplyButton from "../../../_components/thread/createReplyButton";
import FileList from "../../../_components/thread/fileList";
import Reply from "../../../_components/thread/reply";
import VoteSection from "../../../_components/thread/voteSection";

export default function ThreadPage({ params }: { params: { slug: string } }) {
  const [thread, setThread] = useState<IThread | undefined>(undefined);
  const [replies, setReplies] = useState<IReply[]>([]);
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);

  const images = [
    "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca",
  ];

  useEffect(() => {
    const fetchData = async () => {
      console.log(params.slug);
      const threadData = await getThread(params.slug);
      const repliesData = await getReplies(params.slug);
      setThread(threadData);
      setReplies(repliesData);
    };

    fetchData();
  }, [params.slug]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!thread) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <div className="flex-grow">
            <Card className="p-4 sm:p-6 mb-4 sm:mb-6 relative max-w-4xl mx-auto">
              <PinButton className="absolute top-9 right-8" size={24} />
              <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
                {thread.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-3">
                {thread.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-gray-200 px-2 py-1 rounded-md"
                  >
                    # {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Avatar>
                  <AvatarFallback>{thread.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">{thread.author}</span>
                  <span className="mx-1">·</span>
                  <span>{timeAgo(thread.createdAt)}</span>
                </div>
              </div>
              <div className="w-full bg-gray-300 my-4 rounded-full h-[2px]" />
              <div className="flex flex-col sm:flex-row gap-4">
                <VoteSection initialVotes={2838} />
                <div className="flex-grow">
                  <p className="mb-2 sm:mb-4 text-sm sm:text-base">
                    {thread.body}
                  </p>
                </div>
              </div>

              {/* Carousel Section */}
              <div className="my-6 flex justify-center">
                <div className="w-full sm:w-4/5">
                  <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                      {images.map((image, index) => (
                        <CarouselItem key={index}>
                          <AspectRatio ratio={16 / 9}>
                            <img
                              src={image}
                              alt={`Slide ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </AspectRatio>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-12 sm:-left-16" />
                    <CarouselNext className="-right-12 sm:-right-16" />
                    <div className="py-2 text-center">
                      <div className="flex items-center justify-center gap-2 mt-4">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            className={`h-2 rounded-full transition-all ${
                              current === index
                                ? "w-8 bg-primary"
                                : "w-2 bg-primary/30"
                            }`}
                            onClick={() => api?.scrollTo(index)}
                          />
                        ))}
                      </div>
                    </div>
                  </Carousel>
                </div>
              </div>

              <FileList />
            </Card>
            <div className="max-w-4xl mx-auto">
              <CreateReplyButton />
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">
                {thread.replies} Answers
              </h2>
              {replies.map((reply) => (
                <Reply key={reply.id} reply={reply} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
