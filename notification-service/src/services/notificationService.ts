import { getAllNotificationsRepo, getAllNotificationsByUserIdRepo, getUnreadNotificationsByUserIdRepo, createNotificationRepo, markNotificationsAsSeenByUserIdRepo } from "../repositories/notificationRepository";
import { INotification } from "../models/notification";

export const getAllNotificationsService = async (): Promise<INotification[]> => {
    return await getAllNotificationsRepo();
};

export const getAllNotificationsByUserIdService = async (userId: string): Promise<INotification[]> => {
    return await getAllNotificationsByUserIdRepo(userId);
};

export const getUnreadNotificationsByUserIdService = async (userId: string): Promise<INotification[]> => {
    return await getUnreadNotificationsByUserIdRepo(userId);
};

export const createNotificationService = async (notification: INotification): Promise<INotification> => {
    return await createNotificationRepo(notification);
};

export const markNotificationsAsSeenByUserIdService = async (userId: string, timestamp: Date): Promise<void> => {
    await markNotificationsAsSeenByUserIdRepo(userId, timestamp);
};