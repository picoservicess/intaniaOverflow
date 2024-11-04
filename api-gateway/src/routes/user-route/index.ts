import { Router } from "express";

import { updateUserProfile, getUserProfile, login, applyPin, viewPinned, getUserDetail, getUsersWhoPinnedThread, healthCheck } from "../../controllers/user-controller";
import { authMiddleware } from "../../middleware/auth";
import { createLogMiddleware } from "../../middleware/log";

const userRouter = Router();

// Register a middleware to log all requests
userRouter.use(createLogMiddleware('user-service'));

// Health check
userRouter.get("/health", healthCheck);

// User profile operations
userRouter.post("/login", login);
userRouter.get("/userProfile", authMiddleware, getUserProfile);
userRouter.put("/userProfile", authMiddleware, updateUserProfile);
userRouter.get("/userDetail/:userId", authMiddleware, getUserDetail);
userRouter.post("/applyPin", authMiddleware, applyPin);
userRouter.get("/viewPinned", authMiddleware, viewPinned);

export default userRouter;