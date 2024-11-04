// components/ImageGallery.tsx
"use client";

import React, { useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="flex justify-center">
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
                  title="Go to slide"
                  type="button"
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    current === index ? "w-8 bg-primary" : "w-2 bg-primary/30"
                  }`}
                  onClick={() => api?.scrollTo(index)}
                />
              ))}
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default ImageGallery;
