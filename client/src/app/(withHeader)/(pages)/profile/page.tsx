import EditProfileButton from "@/app/_components/profile/editProfileButton";
import ProfileThreads from "@/app/_components/profile/profileThread";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import getUserProfile from "@/lib/api/user/getUserProfile";
import viewPinned from "@/lib/api/user/viewPinned";
import { getServerSession } from "next-auth";
import getThread from "@/lib/api/thread/getThread";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const userProfile = await getUserProfile(session?.user.accessToken as string);

  const pinnedThreadIds: ViewPinned = await viewPinned(session?.user.accessToken as string);
  const aboutMeThreads: Thread[] = []; // Assuming you will populate this as needed

  const pinnedThreadsPromises = pinnedThreadIds.threadIds.map(async (threadId) => {
    return await getThread(session?.user.accessToken as string, threadId);
  });

  const pinnedThreads = await Promise.all(pinnedThreadsPromises);

  if (!userProfile) return <p>Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-start gap-8 pt-8">
      <Card className="relative max-w-[250px]">
        <CardContent className="flex flex-col gap-6 pt-6 items-center">
          <div className="relative">
            <Avatar className="size-[100px]">
              <AvatarImage
                src={userProfile.profileImage}
                className="size-full rounded-[inherit] object-cover"
              />
              <AvatarFallback className="text-[32px]">
                {userProfile.displayname[0]}
              </AvatarFallback>
            </Avatar>
            <EditProfileButton />
          </div>

          <div className="flex flex-col gap-3 text-center">
            <h4 className="break-words max-w-[220px]">{userProfile.displayname}</h4>
            <p className="text-sm text-slate-500">{userProfile.email}</p>
          </div>
        </CardContent>
      </Card>
      <ProfileThreads aboutMeThreads={aboutMeThreads} pinnedThreads={pinnedThreads} />
    </div>
  );
}
