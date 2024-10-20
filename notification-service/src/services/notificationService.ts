import { getAllNotificationsRepo, getAllNotificationsByStudentIdRepo, getUnreadNotificationsByStudentIdRepo, createNotificationRepo, markNotificationsAsSeenByStudentIdRepo } from "../repositories/notificationRepository";
import { INotification } from "../models/notification";

export const getAllNotificationsService = async (): Promise<INotification[]> => {
    return await getAllNotificationsRepo();
};

export const getAllNotificationsByStudentIdService = async (studentId: string): Promise<INotification[]> => {
    return await getAllNotificationsByStudentIdRepo(studentId);
};

export const getUnreadNotificationsByStudentIdService = async (studentId: string): Promise<INotification[]> => {
    return await getUnreadNotificationsByStudentIdRepo(studentId);
};

export const createNotificationService = async (notification: INotification): Promise<INotification> => {
    return await createNotificationRepo(notification);
};

export const markNotificationsAsSeenByStudentIdService = async (studentId: string, timestamp: Date): Promise<void> => {
    await markNotificationsAsSeenByStudentIdRepo(studentId, timestamp);
};