import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getAllNotification from "@/lib/api/notification/getAllNotification";
import getThread from "@/lib/api/thread/getThread";
import getUserDetail from "@/lib/api/user/getUserDetail";
import { getServerSession } from "next-auth";
import NotificationItem from "./notificationItem";

export default async function NotificationDropdownContent() {
    // Session
    const session = await getServerSession(authOptions);
    if (!session) return;
    const token = session.user.accessToken;

    // Fetching Related Data
    const notifications: NotificationResponse[] = await getAllNotification(token);
    const threadIds = notifications.map((notification) => {
        // Return the targetId of the notification
        return notification.targetId;
    });
    const threads = await Promise.all(
        threadIds.map(async (threadId) => await getThread(token, threadId))
    );
    const userDetails = await Promise.all(
        threadNotification.map(async (notification) => await getUserDetail(token, notification.senderId))
    );
    const notificationItems: NotificationItem[] = threadNotification
    .map((notification, index) => {
        const thread = threads[index];
        const user = userDetails[index];
        
        if (!thread.title) {
            return null; 
        }

        return {
            isPinned: true,
            userName: user.displayname,
            userProfile: user.profileImage,
            threadTitle: thread.title,
            threadId: thread._id,
            isSeen: notification.isSeen
        };
    })
    .filter((item) => item !== null);

    return (
        <>
            {notificationItems.map((notificationItem, index) => (
                <NotificationItem key={index} notificationItem={notificationItem} />
            ))}
        </>
    )
}
