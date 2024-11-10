import PostListSkeleton from "@/app/_components/home/postListSkeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-start gap-8 pt-8">
      <Card className="relative max-w-[250px]">
        <CardContent className="flex flex-col gap-6 pt-6 items-center animate-pulse">
          <Avatar className="size-[100px] animate-pulse">
            <AvatarFallback className="text-[32px]"></AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-3 text-center">
            <h4 className="break-words max-w-[220px] text-transparent bg-gray-300 rounded">
              xxxxxxxx
            </h4>
            <p className="text-sm text-transparent bg-gray-300 rounded">
              xxxxxxxxxx@xxxxxxx.xxxxx.xx.xx
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="w-1/2 flex-col gap-4 justify-center animate-pulse">
        <div className="flex justify-center mb-8">
          <p className="w-full rounded-l-lg py-2 text-center bg-gray-200 text-transparent">
            xxxxxxxx
          </p>
        </div>
        <PostListSkeleton />
      </div>
    </div>
  );
}
