import { Request, Response } from "express";
import { getAllNotificationsService, getAllNotificationsByStudentIdService, getUnreadNotificationsByStudentIdService, createNotificationService, markNotificationsAsSeenByStudentIdService } from "../services/notificationService";
import { INotification } from "../models/notification";

export const getAllNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const notifications = await getAllNotificationsService();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving notifications" });
    }
};

export const getAllNotificationsByStudentId = async (req: Request, res: Response): Promise<void> => {
    const studentId = req.params.studentId;
    try {
        const notifications = await getAllNotificationsByStudentIdService(studentId);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving notifications by studentId" });
    }
};

export const getUnreadNotificationsByStudentId = async (req: Request, res: Response): Promise<void> => {
    const studentId = req.params.studentId;
    try {
        const notifications = await getUnreadNotificationsByStudentIdService(studentId);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving unread notifications by studentId" });
    }
};

export const createNotification = async (req: Request, res: Response): Promise<void> => {
    try {

        const notificationData: INotification = {
            studentId: req.body.studentId as string,
            targetId: req.body.targetId as string,
            isThread: req.body.isThread as boolean,
            isReply: req.body.isReply as boolean,
            isUser: req.body.isUser as boolean,
            isSeen: false,
            payload: req.body.payload as string
        } as INotification;

        const newNotification = await createNotificationService(notificationData);
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(500).json({ message: "Error creating notification" });
    }
}

export const markNotificationsAsSeenByStudentId = async (req: Request, res: Response): Promise<void> => {
    const studentId = req.params.studentId;
    const timestamp = new Date();

    console.log("timestamp: " + timestamp)
    console.log("studentId: " + studentId)
    try {
        await markNotificationsAsSeenByStudentIdService(studentId, timestamp);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error updating notifications" });
    }
};
