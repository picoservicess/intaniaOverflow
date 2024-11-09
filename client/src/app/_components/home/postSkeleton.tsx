import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowBigDown, ArrowBigUp, Bookmark, MessageSquare } from "lucide-react";

const PostSkeleton = () => {
    return (
    <div
      className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3 py-3 border-b cursor-pointer relative hover:bg-gray-50 transition-colors px-2 animate-pulse"
    >
      <div className="flex items-center sm:items-start space-x-3 w-full sm:w-auto">
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
          <AvatarFallback className="text-sm text-transparent">
            X
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex flex-wrap items-center text-xs sm:text-sm text-transparent">
            <span className="font-medium bg-gray-200 rounded">Placeholder</span>
            <span className="mx-1 text-gray-200">·</span>
            <span className="bg-gray-200 rounded">Placeholder day ago</span>
          </div>
          <p className="font-medium mt-1 text-sm sm:text-base line-clamp-2 sm:line-clamp-1 text-transparent bg-gray-200 rounded">
            Title Placeholder
          </p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-transparent bg-gray-200 rounded">
            <Button variant="ghost" size="sm" className="p-0">
              <ArrowBigUp size={16} className="mr-1" />
              0
            </Button>
            <Button variant="ghost" size="sm" className="p-0">
              <ArrowBigDown size={16} className="mr-1" />
              0
            </Button>
            <Button variant="ghost" size="sm" className="p-0">
              <MessageSquare size={16} className="mr-1" />
              0
            </Button>
            <Button variant="ghost" size="sm" className="p-0">
              <Bookmark size={16}/>
            </Button>
          </div>
        </div>
      </div>
    </div>
    );
  };
  
  export default PostSkeleton;
  