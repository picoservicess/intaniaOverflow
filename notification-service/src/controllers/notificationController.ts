import { Request, Response } from "express";
import { getAllNotificationsService } from "../services/notificationService";

export const getAllNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const notifications = await getAllNotificationsService();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving notifications" });
    }
};
