import { INotification, Notification } from "../models/notification";

export const getAllNotificationsRepo = async (): Promise<INotification[]> => {
    try {
        return await Notification.find();
    } catch (error) {
        console.error("Repository Error:", error);
        throw new Error("Error fetching notifications");
    }
};

export const getAllNotificationsByStudentIdRepo = async (studentId: string): Promise<INotification[]> => {
    try {
        return await Notification.find({ studentId });  // Query the notifications by studentId
    } catch (error) {
        console.error("Repository Error:", error);
        throw new Error("Error fetching notifications by student ID");
    }
};

export const getUnreadNotificationsByStudentIdRepo = async (studentId: string): Promise<INotification[]> => {
    try {
        return await Notification.find({ studentId, isSeen: false });
    } catch (error) {
        console.error("Repository Error:", error);
        throw new Error("Error fetching unread notifications by student ID");
    }
}

export const createNotificationRepo = async (notificationData: INotification): Promise<INotification> => {
    try {
        const newNotification = new Notification(notificationData);
        return await newNotification.save();
    } catch (error) {
        console.error("Repository Error:", error);
        throw new Error("Error creating notification");
    }
}

export const markNotificationsAsSeenByStudentIdRepo = async (studentId: string, timestamp: Date): Promise<void> => {
    try {
        const result = await Notification.updateMany(
            { studentId, createdAt: { $lt: timestamp }, isSeen: false },
            { isSeen: true }
        );

        if (result.modifiedCount === 0) {
            throw new Error("No notifications found to update");
        }
    } catch (error) {
        console.error("Repository Error:", error);
        throw new Error("Error updating notifications");
    }
}