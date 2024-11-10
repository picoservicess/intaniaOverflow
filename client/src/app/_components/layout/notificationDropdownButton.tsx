"use client";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Bell } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import markAllAsSeen from "@/lib/api/notification/markAllAsSeen";

import NotificationDropdownContent from "./notificationDropdownContent";

export default function NotificationDropdownButton({
  isNewNotification,
  notificationItems,
  token,
}: {
  isNewNotification: boolean;
  notificationItems: NotificationItem[];
  token: string;
}) {
  const [open, setOpen] = useState(false);
  const wasOpenedRef = useRef(false);

  useEffect(() => {
    const handleMarkAllAsSeen = async () => {
      if (!open && wasOpenedRef.current && isNewNotification) {
        await markAllAsSeen(token);
      }
      wasOpenedRef.current = open;
    };

    handleMarkAllAsSeen();
  }, [open, isNewNotification, token]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 md:h-10 md:w-10"
        >
          <Bell className="h-5 w-5" />
          {isNewNotification && (
            <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[320px] md:w-[450px]"
        align="end"
        sideOffset={8}
      >
        <ScrollArea className="max-h-[calc(100vh-120px)] rounded-md">
          <div className="flex flex-col p-2 gap-1">
            <NotificationDropdownContent
              notificationItems={notificationItems}
            />
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
