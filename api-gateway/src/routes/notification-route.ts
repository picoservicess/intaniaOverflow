import axios from "axios";
import express, { Request, Response } from "express";
import { createLogMiddleware } from "../middleware/log";

const notificationRouter = express.Router();

const NOTIFICATION_SERVICE_URL =
    `http://${process.env.NOTIFICATION_SERVICE_HOST}:${process.env.NOTIFICATION_SERVICE_PORT}` ||
    "http://notification-service:5002";
console.log("📢 NOTIFICATION_SERVICE_URL", NOTIFICATION_SERVICE_URL);

notificationRouter.use(createLogMiddleware('notification-service'));

notificationRouter.get('/health', async (req: Request, res: Response) => {
    try {
        // Forward the request to the notification service health check
        console.log(`${NOTIFICATION_SERVICE_URL}/notifications/health-check`);
        const response = await axios.get(`${NOTIFICATION_SERVICE_URL}/notifications/health-check`,
            {
                headers: {
                    'Authorization': req.headers.authorization, // Add the token to the request headers
                },
            }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error("Error in /notifications/health:", error.message);
        console.log(error.response.message);
        res.status(error.response?.status || 500).json({
            message: "Error checking notification service health",
        });
    }
})

export default notificationRouter