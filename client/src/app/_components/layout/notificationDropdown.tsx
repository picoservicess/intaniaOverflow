import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import NotificationDropdownContent from "./notificationDropdownContent";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Suspense } from "react";
import NotificationItemSkeleton from "./notificationItemSkeleton";

export default function NotificationDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[320px] md:w-[450px]" align="end" sideOffset={8}>
        <ScrollArea className="max-h-[calc(100vh-120px)] rounded-md">
          <div className="flex flex-col p-2 gap-1">
            <Suspense fallback={
              <div>
                {[...Array(5)].map((_, index) => (
                  <NotificationItemSkeleton key={index} />
                ))}
              </div>
            }>
              <NotificationDropdownContent />
            </Suspense>
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
