import { LogOut, User } from "lucide-react";
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
import Icon from "@/app/assets/icon.svg";
import getUserProfile from "@/lib/api/user/getUserProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import NotificationDropdown from "./notificationDropdown";

export default async function Header() {
  const session = await  getServerSession(authOptions);
  const userProfile = await getUserProfile(session?.user.accessToken as string);

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
              {/* <NotificationDropdown /> */}
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
