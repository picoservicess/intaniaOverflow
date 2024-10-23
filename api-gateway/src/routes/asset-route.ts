import express, { Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const assetRouter = express.Router();

// Asset Service URL (replace with your actual asset service URL)
const ASSET_SERVICE_URL =
    process.env.ASSET_SERVICE_URL || "http://localhost:3000";

assetRouter.post(
    "/assets",
    createProxyMiddleware<Request, Response>({
        target: `${ASSET_SERVICE_URL}`,
        changeOrigin: true,
        pathRewrite: {
            [`^/assets`]: "/asset/upload",
        },
    })
);

assetRouter.get(
    "/assets/health",
    createProxyMiddleware<Request, Response>({
        target: `${ASSET_SERVICE_URL}`,
        changeOrigin: true,
        pathRewrite: {
            [`^/assets/health`]: "/health-check",
        },
    })
);

export default assetRouter;
