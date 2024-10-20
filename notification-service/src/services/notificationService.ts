import { getAllNotificationsRepo } from "../repositories/notificationRepository";
import { INotification } from "../models/notification";

export const getAllNotificationsService = async (): Promise<INotification[]> => {
    return await getAllNotificationsRepo();
};

