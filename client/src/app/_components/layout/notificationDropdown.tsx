import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";

import React from "react";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import NotificationDropdownItem from "./notificationDropdownItem";

interface Notification {
  isPinned: boolean;
  userName: string;
  userProfile: string;
  threadTitle: string;
}

const notifications: Notification[] = [
  {
    isPinned: true,
    userName: "John Doe",
    userProfile: "https://example.com/profiles/john_doe",
    threadTitle: "How to use TypeScript interfaces effectively",
  },
  {
    isPinned: false,
    userName: "Jane Smith",
    userProfile: "https://example.com/profiles/jane_smith",
    threadTitle: "JavaScript ES6 features and beyond",
  },
  {
    isPinned: true,
    userName: "Mike Johnson",
    userProfile: "https://example.com/profiles/mike_johnson",
    threadTitle: "Understanding React component lifecycle",
  },
  {
    isPinned: false,
    userName: "Emily Davis",
    userProfile: "https://example.com/profiles/emily_davis",
    threadTitle: "CSS tips for responsive design",
  },
  {
    isPinned: true,
    userName: "Chris Lee",
    userProfile: "https://example.com/profiles/chris_lee",
    threadTitle: "Exploring GraphQL with Node.js",
  },
  {
    isPinned: true,
    userName: "Chris Lee",
    userProfile: "https://example.com/profiles/chris_lee",
    threadTitle: "Exploring GraphQL with Node.js",
  },
  {
    isPinned: true,
    userName: "Chris Lee",
    userProfile: "https://example.com/profiles/chris_lee",
    threadTitle: "Exploring GraphQL with Node.js",
  },
  {
    isPinned: true,
    userName: "Chris Lee",
    userProfile: "https://example.com/profiles/chris_lee",
    threadTitle: "Exploring GraphQL with Node.js",
  },
  {
    isPinned: true,
    userName: "Chris Lee",
    userProfile: "https://example.com/profiles/chris_lee",
    threadTitle: "Exploring GraphQL with Node.js",
  },
  {
    isPinned: true,
    userName: "Chris Lee",
    userProfile: "https://example.com/profiles/chris_lee",
    threadTitle: "Exploring GraphQL with Node.js",
  },
  {
    isPinned: true,
    userName: "Chris Lee",
    userProfile: "https://example.com/profiles/chris_lee",
    threadTitle: "Exploring GraphQL with Node.js",
  },
  {
    isPinned: true,
    userName: "Chris Lee",
    userProfile: "https://example.com/profiles/chris_lee",
    threadTitle: "Exploring GraphQL with Node.js",
  },
  {
    isPinned: true,
    userName: "Chris Lee",
    userProfile: "https://example.com/profiles/chris_lee",
    threadTitle: "Exploring GraphQL with Node.js",
  },
  {
    isPinned: true,
    userName: "Chris Lee",
    userProfile: "https://example.com/profiles/chris_lee",
    threadTitle: "Exploring GraphQL with Node.js",
  },
  {
    isPinned: true,
    userName: "Chris Lee",
    userProfile: "https://example.com/profiles/chris_lee",
    threadTitle: "Exploring GraphQL with Node.js",
  },
];

const notificationDropdown = () => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState("pedro");

  const profilePicture =
    "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80";
  const authorNorth = "Surapee";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="relative">
          <Bell />
          <div className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="max-w-[550px] max-h-screen-90 overflow-y-auto mr-3 rounded-xl bg-white p-3 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
          sideOffset={5}
        >
          {notifications.map((notification, index) =>
            NotificationDropdownItem(notification)
          )}
          <DropdownMenu.Arrow className="fill-white size-3" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default notificationDropdown;
