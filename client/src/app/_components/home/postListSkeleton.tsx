import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const PostListSkeleton = () => {
    return (
      <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3 px-2 py-3 border-b cursor-default relative">
        <div className="flex items-center sm:items-start space-x-3 w-full sm:w-auto">
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
              <AvatarFallback>
              </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600">
              <div className="bg-gray-200 h-4 w-32 rounded animate-pulse"></div>
              <span className="mx-1">·</span>
              <div className="bg-gray-200 h-4 w-20 rounded animate-pulse"></div>
            </div>
            <div className="font-medium mt-1 text-sm sm:text-base line-clamp-2 sm:line-clamp-1 bg-gray-200 h-6 w-full rounded animate-pulse"></div>
            <div className="flex items-center flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600">
              <div className="bg-gray-200 h-6 w-16 rounded animate-pulse"></div>
              <div className="bg-gray-200 h-6 w-16 rounded animate-pulse"></div>
              <div className="bg-gray-200 h-6 w-16 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default PostListSkeleton;
  