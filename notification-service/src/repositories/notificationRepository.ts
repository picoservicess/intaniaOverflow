import { INotification, Notification } from "../models/notification";

export const getAllNotificationsRepo = async (): Promise<INotification[]> => {
    try {
        return await Notification.find();
    } catch (error) {
        throw new Error("Error fetching notifications");
    }
};
