import { Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const NotificationItem = ({ notificationItem }: { notificationItem: NotificationItem }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg relative",
        "hover:bg-muted/50 transition-colors cursor-pointer"
      )}
    >
      {notificationItem.isSeen && (
        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-destructive" />
      )}
      <div className="relative flex-shrink-0">
        <Avatar className="h-[52px] w-[52px]">
          <AvatarImage src={notificationItem.userProfile} alt={notificationItem.userName} />
          <AvatarFallback className="text-base">
            {notificationItem.userName[0]}
          </AvatarFallback>
        </Avatar>
        {notificationItem.isPinned && (
          <Bookmark
            className="absolute -right-1 -bottom-1 text-muted-foreground"
            size={14}
            fill="currentColor"
          />
        )}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-sm break-words pr-6">
          <span className="font-medium">{notificationItem.userName}</span>{" "}
          ได้ตอบกลับเธรด{" "}
          <span className="font-medium">{notificationItem.threadTitle}</span>{" "}
          {notificationItem.isPinned ? "ที่คุณบันทึกไว้" : "ของคุณ"}
        </p>
        <span className="text-xs text-muted-foreground">20 นาทีที่แล้ว</span>
      </div>
    </div>
  );
};

export default NotificationItem;



