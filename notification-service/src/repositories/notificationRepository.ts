import { INotification, Notification } from "../models/notification";

export const getAllNotificationsRepo = async (): Promise<INotification[]> => {
  try {
    return await Notification.find();
  } catch (error) {
    console.error("Repository Error:", error);
    throw new Error("Error fetching notifications");
  }
};

export const getAllNotificationsByUserIdRepo = async (
  userId: string
): Promise<INotification[]> => {
  try {
    return await Notification.find({ userId }); // Query the notifications by userId
  } catch (error) {
    console.error("Repository Error:", error);
    throw new Error("Error fetching notifications by student ID");
  }
};

export const getUnreadNotificationsByUserIdRepo = async (
  userId: string
): Promise<INotification[]> => {
  try {
    return await Notification.find({ userId, isSeen: false });
  } catch (error) {
    console.error("Repository Error:", error);
    throw new Error("Error fetching unread notifications by student ID");
  }
};

export const createNotificationRepo = async (
  notificationData: INotification
): Promise<INotification> => {
  try {
    const newNotification = new Notification(notificationData);
    return await newNotification.save();
  } catch (error) {
    console.error("Repository Error:", error);
    throw new Error("Error creating notification");
  }
};

export const markNotificationsAsSeenByUserIdRepo = async (
  userId: string,
  timestamp: Date
): Promise<void> => {
  try {
    const result = await Notification.updateMany(
      { userId, createdAt: { $lt: timestamp }, isSeen: false },
      { isSeen: true }
    );
  } catch (error) {
    console.error("Repository Error:", error);
    throw new Error("Error updating notifications");
  }
};
