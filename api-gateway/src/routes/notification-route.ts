import axios from "axios";
import express, { Request, Response } from "express";

import { createLogMiddleware } from "../middleware/log";

const notificationRouter = express.Router();

const NOTIFICATION_SERVICE_URL =
    `http://${process.env.NOTIFICATION_SERVICE_HOST}:${process.env.NOTIFICATION_SERVICE_PORT}` ||
    "http://notification-service:5002";
console.log("📢 NOTIFICATION_SERVICE_URL", NOTIFICATION_SERVICE_URL);

notificationRouter.use(createLogMiddleware("notification-service"));

notificationRouter.get("/health", async (req: Request, res: Response) => {
    try {
        // Forward the request to the notification service health check
        const response = await axios.get(
            `${NOTIFICATION_SERVICE_URL}/notifications/health-check`,
            {
                headers: {
                    Authorization: req.headers.authorization,
                },
            }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error("Error in /notifications/health:", error.message);
        res.status(error.response?.status || 500).json({
            message: "Error checking notification service health",
        });
    }
});

notificationRouter.get("/", async (req: Request, res: Response) => {
    try {
        // Forward the request to the getAllNotificationsByUserId
        const response = await axios.get(
            `${NOTIFICATION_SERVICE_URL}/notifications`,
            {
                headers: {
                    Authorization: req.headers.authorization,
                },
            }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error("Error in /notifications:", error.message);
        res.status(error.response?.status || 500).json({
            message: "Error to getAllNotificationsByUserId from api-gateway",
        });
    }
});

notificationRouter.get("/unread", async (req: Request, res: Response) => {
    try {
        // Forward the request to the getAllNotificationsByUserId
        const response = await axios.get(
            `${NOTIFICATION_SERVICE_URL}/notifications/unread`,
            {
                headers: {
                    Authorization: req.headers.authorization,
                },
            }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error("Error in /notifications/unread:", error.message);
        res.status(error.response?.status || 500).json({
            message: "Error to getAllNotificationsByUserId from api-gateway",
        });
    }
});

notificationRouter.patch("/", async (req: Request, res: Response) => {
    try {
        // Forward the request to the markNotificationsAsSeenByUserId
        const response = await axios.patch(
            `${NOTIFICATION_SERVICE_URL}/notifications`,
            req.body,
            {
                headers: {
                    Authorization: req.headers.authorization,
                },
            }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error("Error in /notifications:", error.message);
        res.status(error.response?.status || 500).json({
            message:
                "Error to markNotificationsAsSeenByUserId from api-gateway",
        });
    }
});

export default notificationRouter;
