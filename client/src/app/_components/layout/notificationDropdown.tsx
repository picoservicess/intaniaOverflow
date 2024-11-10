import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getAllNotification from "@/lib/api/notification/getAllNotification";
import getMyThread from "@/lib/api/thread/getMyThreads";
import getThread from "@/lib/api/thread/getThread";
import getUserDetail from "@/lib/api/user/getUserDetail";

import NotificationDropdownButton from "./notificationDropdownButton";

export default async function NotificationDropdown() {
  // Session
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const token = session.user.accessToken;

  // Fetching Related Data
  const notifications: NotificationResponse[] = await getAllNotification(token);
  const isNewNotification = notifications.some(
    (notification) => !notification.isSeen
  );
  const threads = await Promise.all(
    notifications.map(async (notification) => {
      const thread = await getThread(token, notification.threadId);
      return thread;
    })
  );
  const myThreads = await getMyThread(token);

  // Modify thread in threads if thread.threadId is in myThreads.threads
  threads.forEach((thread) => {
    if (
      myThreads.threads.some(
        (myThread: Thread) => myThread.threadId === thread.threadId
      )
    ) {
      thread.authorId = session.user.id; // Update authorId if thread is in myThreads
    }
  });

  const userDetails = await Promise.all(
    notifications.map(async (notification) => {
      return await getUserDetail(token, notification.senderId);
    })
  );

  const notificationItems: NotificationItem[] = notifications
    .map((notification, index) => {
      const thread = threads[index];
      const user = userDetails[index];
      if (!thread || !thread.title) {
        return null;
      }
      return {
        isThread: notification.isThread,
        isPinned: !(thread.authorId == session.user.id),
        userName: user.displayname,
        userProfile: user.profileImage,
        threadTitle: thread.title,
        threadId: thread.threadId,
        isSeen: notification.isSeen,
        createdAt: notification.createdAt,
      };
    })
    .filter((item): item is NotificationItem => item !== null)
    .reverse();

  return (
    <NotificationDropdownButton
      isNewNotification={isNewNotification}
      notificationItems={notificationItems}
      token={token}
    />
  );
}
