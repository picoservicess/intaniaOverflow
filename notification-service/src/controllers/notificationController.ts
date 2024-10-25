import { Request, Response } from "express";
import { getAllNotificationsService, getAllNotificationsByUserIdService, getUnreadNotificationsByUserIdService, createNotificationService, markNotificationsAsSeenByUserIdService } from "../services/notificationService";
import { INotification } from "../models/notification";
import { AuthenticatedRequest } from "../middlewares/auth";

// export const getAllNotifications = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const notifications = await getAllNotificationsService();
//         res.status(200).json(notifications);
//     } catch (error) {
//         res.status(500).json({ message: "Error retrieving notifications" });
//     }
// };

export const getAllNotificationsByUserId = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ error: 'No bearer token provided' });
        return;
    }

    try {
        const notifications = await getAllNotificationsByUserIdService(userId);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving notifications by userId" });
    }
};

export const getUnreadNotificationsByUserId = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ error: 'No bearer token provided' });
        return;
    }

    try {
        const notifications = await getUnreadNotificationsByUserIdService(userId);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving unread notifications by userId" });
    }
};

// export const createNotification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
//     const userId = req.user?.userId;
//     if (!userId) {
//         res.status(401).json({ error: 'No bearer token provided' });
//         return;
//     }

//     try {
//         const notificationData: INotification = {
//             userId: userId,
//             targetId: req.body.targetId as string,
//             isThread: req.body.isThread as boolean,
//             isReply: req.body.isReply as boolean,
//             isUser: req.body.isUser as boolean,
//             isSeen: false,
//             payload: req.body.payload as string
//         } as INotification;

//         const newNotification = await createNotificationService(notificationData);
//         res.status(201).json(newNotification);
//     } catch (error) {
//         res.status(500).json({ message: "Error creating notification" });
//     }
// }

export const markNotificationsAsSeenByUserId = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(401).json({ error: 'No bearer token provided' });
        return;
    }

    const timestamp = new Date();

    console.log("timestamp: " + timestamp)
    console.log("userId: " + userId)
    try {
        await markNotificationsAsSeenByUserIdService(userId, timestamp);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error updating notifications" });
    }
};
