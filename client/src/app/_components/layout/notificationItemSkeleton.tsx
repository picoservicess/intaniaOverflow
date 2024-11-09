import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const NotificationItemNotification = () => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg relative",
        "hover:bg-muted/50 transition-colors cursor-pointer animate-pulse"
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-[52px] w-[52px]">
          <AvatarFallback className="text-base">
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-sm break-words pr-6">
          <span className="font-medium">Sample Name</span>{" "}
          Sample Text
          <span className="font-medium">Sample Thread Title</span>{" "}
          Sample Text
        </p>
        <span className="text-xs text-muted-foreground">Sample Timestamp</span>
      </div>
    </div>
  );
};

export default NotificationItemNotification;
