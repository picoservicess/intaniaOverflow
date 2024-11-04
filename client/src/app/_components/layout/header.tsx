// "use client";

import { Bell, Bookmark, LogOut, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Icon from "@/app/assets/icon.svg";
import getUserProfile from "@/lib/api/getUserProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

interface Notification {
  isPinned: boolean;
  userName: string;
  userProfile: string;
  threadTitle: string;
}

// Sample notifications data
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
];

const NotificationItem = ({ notification }: { notification: Notification }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg relative",
        "hover:bg-muted/50 transition-colors cursor-pointer"
      )}
    >
      <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-destructive" />
      <div className="relative flex-shrink-0">
        <Avatar className="h-[52px] w-[52px]">
          <AvatarImage src={notification.userProfile} alt={notification.userName} />
          <AvatarFallback className="text-base">
            {notification.userName[0]}
          </AvatarFallback>
        </Avatar>
        {notification.isPinned && (
          <Bookmark
            className="absolute -right-1 -bottom-1 text-muted-foreground"
            size={14}
            fill="currentColor"
          />
        )}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-sm break-words pr-6">
          <span className="font-medium">{notification.userName}</span>{" "}
          ได้ตอบกลับเธรด{" "}
          <span className="font-medium">{notification.threadTitle}</span>{" "}
          {notification.isPinned ? "ที่คุณบันทึกไว้" : "ของคุณ"}
        </p>
        <span className="text-xs text-muted-foreground">20 นาทีที่แล้ว</span>
      </div>
    </div>
  );
};

export default async function Header() {
  // const { data: session } = useSession();
  // const [userProfile, setUserProfile] = useState<UserProfile>();
  const session = await  getServerSession(authOptions);
  const userProfile = await getUserProfile(session?.user.accessToken as string);

  // useEffect(() => {
  //   async function fetchProfile() {
  //     try {
  //       const profile = await getUserProfile(session?.user.accessToken as string);
  //       setUserProfile(profile);
  //     } catch (error) {
  //       console.error("Failed to fetch user profile:", error);
  //     }
  //   }

  //   fetchProfile();
  // }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition-colors hover:opacity-90">
            <div className="w-8 h-8">
              <Icon />
            </div>
            <div className="text-xl font-medium">
              <span className="text-foreground">intania</span>
              <span className="text-[#872f2f] font-bold">Overflow</span>
            </div>
          </Link>

          {session ? (
            <div className="flex items-center gap-2 md:gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-destructive" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[320px] md:w-[450px]" align="end" sideOffset={8}>
                  <ScrollArea className="h-[calc(100vh-120px)] rounded-md">
                    <div className="flex flex-col p-2 gap-1">
                      {notifications.map((notification, index) => (
                        <NotificationItem key={index} notification={notification} />
                      ))}
                    </div>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile?.profileImage || ""} alt={userProfile?.displayname || ""} className="size-full rounded-[inherit] object-cover" />
                      <AvatarFallback className="text-sm">
                        {userProfile?.displayname?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {userProfile?.displayname && <p className="font-medium">{userProfile?.displayname}</p>}
                      {userProfile?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {userProfile?.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>โปรไฟล์</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/api/auth/signout"
                      className="w-full cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>ออกจากระบบ</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button asChild>
              <Link href="/login">เข้าสู่ระบบ</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
