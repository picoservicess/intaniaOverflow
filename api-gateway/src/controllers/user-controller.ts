import { Request, Response } from "express";

import { controllerWrapper, validateAuth } from "../middleware/auth";
import {
    ApplyPinRequest,
    ApplyPinResponse,
    GetUserDetailRequest,
    GetUserDetailResponse,
    GetUserProfileRequest,
    GetUsersWhoPinnedThreadRequest,
    GetUsersWhoPinnedThreadResponse,
    HealthCheckRequest,
    HealthCheckResponse,
    LoginRequest,
    LoginResponse,
    UpdateUserProfileRequest,
    UserProfileResponse,
    ViewPinnedRequest,
    ViewPinnedResponse,
} from "../models/user-model";
import userClient from "../routes/user-route/client";
import { getGrpcRequest } from "../utils/grpc";

const grpcRequest = getGrpcRequest(userClient);

// Update user profile
export const updateUserProfile = controllerWrapper(
    async (req: Request, res: Response) => {
        const token = validateAuth(req);
        try {
            const userProfileUpdate = req.body;
            const updatedProfile = await grpcRequest(
                "UpdateUserProfile",
                userProfileUpdate,
                { token }
            );
            res.status(200).json(updatedProfile);
        } catch (error) {
            res.status(500).json({ error: "Failed to update user profile" });
        }
    }
);

// Get user profile
export const getUserProfile = controllerWrapper(
    async (req: Request, res: Response) => {
        const token = validateAuth(req);
        try {
            const userProfile = await grpcRequest(
                "GetUserProfile",
                {},
                { token }
            );

            if (!userProfile) {
                res.status(404).json({ error: "User profile not found" });
                return;
            }

            res.status(200).json(userProfile);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve user profile" });
        }
    }
);

// User login
export const login = controllerWrapper(async (req: Request, res: Response) => {
    try {
        const loginData = req.body;
        const loginResponse = await grpcRequest("Login", loginData);
        res.status(200).json(loginResponse);
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

// Apply a pin
export const applyPin = controllerWrapper(
    async (req: Request, res: Response) => {
        const token = validateAuth(req);
        try {
            const pinData = req.body;
            const applyPinResponse = await grpcRequest("ApplyPin", pinData, {
                token,
            });
            res.status(200).json(applyPinResponse);
        } catch (error) {
            res.status(500).json({ error: "Failed to apply pin" });
        }
    }
);

// View pinned items
export const viewPinned = controllerWrapper(
    async (req: Request, res: Response) => {
        const token = validateAuth(req);
        try {
            const pinnedItems = await grpcRequest("ViewPinned", {}, { token });
            res.status(200).json(pinnedItems);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve pinned items" });
        }
    }
);

// Get user details
export const getUserDetail = controllerWrapper(
    async (req: Request, res: Response) => {
        const token = validateAuth(req);
        try {
            const userDetail = req.body;

            const userDetails = await grpcRequest("GetUserDetail", userDetail, {
                token,
            });

            if (!userDetails) {
                res.status(404).json({ error: "User details not found" });
                return;
            }

            res.status(200).json(userDetails);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve user details" });
        }
    }
);

// Get users who pinned a thread
export const getUsersWhoPinnedThread = controllerWrapper(
    async (req: Request, res: Response) => {
        const token = validateAuth(req);
        try {
            const pinnedUsers = await grpcRequest(
                "GetUsersWhoPinnedThread",
                {},
                { token }
            );
            res.status(200).json({ userIds: pinnedUsers });
        } catch (error) {
            res.status(500).json({
                error: "Failed to retrieve users who pinned the thread",
            });
        }
    }
);

// Health check
export const healthCheck = controllerWrapper(
    async (_req: Request, res: Response) => {
        try {
            const healthStatus = await grpcRequest("HealthCheck", {});
            res.status(200).json(healthStatus);
        } catch (error) {
            res.status(500).json({ error: "Failed to perform health check" });
        }
    }
);
