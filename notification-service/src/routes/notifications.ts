import express from "express";
import { getAllNotificationsByUserId, getUnreadNotificationsByUserId, markNotificationsAsSeenByUserId } from "../controllers/notificationController";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

router.use(authenticateToken);

// router.get("/", getAllNotifications); // This route is not used, we want only authenticated user to get their notifications
router.get("/", getAllNotificationsByUserId);
router.get("/unread", getUnreadNotificationsByUserId);
// router.post("/", createNotification); // Create a new notification done by message queue
router.patch("/", markNotificationsAsSeenByUserId);

export default router;
