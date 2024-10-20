import express from "express";
import { getAllNotifications, getAllNotificationsByStudentId, getUnreadNotificationsByStudentId, createNotification, markNotificationsAsSeenByStudentId } from "../controllers/notificationController";

const router = express.Router();

router.get("/", getAllNotifications);
router.get("/:studentId", getAllNotificationsByStudentId);
router.get("/:studentId/unread", getUnreadNotificationsByStudentId);
router.post("/", createNotification);
router.patch("/:studentId", markNotificationsAsSeenByStudentId);

export default router;
