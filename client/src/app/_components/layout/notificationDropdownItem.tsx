import { AvatarImage } from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bookmark } from "lucide-react";

import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Notification {
  isPinned: boolean;
  userName: string;
  userProfile: string;
  threadTitle: string;
}

export default function NotificationDropdownItem(notification: Notification) {
  return (
    <DropdownMenu.Item className="flex items-center gap-3 p-2 mb-2 pr-10 rounded-lg outline-none hover:bg-slate-200 relative">
      <div className="absolute right-3 w-2 h-2 bg-red-500 rounded-full" />
      <div className="relative">
        <Avatar className="size-[60px]">
          <AvatarImage
            src={notification.userProfile}
            className="size-full rounded-[inherit] object-cover"
          />
          <AvatarFallback className="text-[20px]">
            {notification.userName[0]}
          </AvatarFallback>
        </Avatar>
        {notification.isPinned ? (
          <Bookmark
            stroke="#94a3b8"
            fill="#94a3b8"
            size={14}
            className="absolute right-0 bottom-0"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <p className="break-words text-base">
          <strong>{notification.userName}</strong> ได้ตอบกลับเธรด{" "}
          <strong>{notification.threadTitle}</strong>{" "}
          {notification.isPinned ? "ที่คุณบันทึกไว้" : "ของคุณ"}
        </p>
        <p className="text-xs">20 นาทีที่แล้ว</p>
      </div>
    </DropdownMenu.Item>
  );
}

// caption, message-square, user

// const NotificationSchema: Schema = new mongoose.Schema({
//   userId: { type: String, required: true },
//   targetId: { type: String, required: true },
//   isThread: { type: Boolean, required: true },
//   isReply: { type: Boolean, required: true },
//   isUser: { type: Boolean, required: true },
//   isSeen: { type: Boolean, required: true },
//   payload: { type: String, required: true }
// }, { timestamps: true });
