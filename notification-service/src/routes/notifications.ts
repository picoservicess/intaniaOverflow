import express from "express";
import { getAllNotificationsByStudentId, getUnreadNotificationsByStudentId, markNotificationsAsSeenByStudentId } from "../controllers/notificationController";
import { authenticateToken } from "../middlewares/auth";

const router = express.Router();

router.use(authenticateToken);

// router.get("/", getAllNotifications); // This route is not used, we want only authenticated user to get their notifications
router.get("/", getAllNotificationsByStudentId);
router.get("/unread", getUnreadNotificationsByStudentId);
// router.post("/", createNotification); // Create a new notification done by message queue
router.patch("/", markNotificationsAsSeenByStudentId);

export default router;
