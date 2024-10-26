import axios from "axios";
import express, { Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const assetRouter = express.Router();

// Asset Service URL (replace with your actual asset service URL)
const ASSET_SERVICE_URL =
    `http://${process.env.ASSET_SERVICE_HOST}:${process.env.ASSET_SERVICE_PORT}` || "http://asset-service:5001";
console.log("ASSET_SERVICE_URL", ASSET_SERVICE_URL);

assetRouter.post("/asset/upload", async (req: Request, res: Response) => {
    try {
        // Forward the request to the asset service
        const response = await axios.post(
            `${ASSET_SERVICE_URL}/asset/upload`,
            req.body,
            {
                headers: {
                    ...req.headers,
                },
            }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error("Error in /asset/upload:", error.message);
        res.status(error.response?.status || 500).json({
            message: "Error uploading asset",
        });
    }
});

assetRouter.get("/health/asset", async (req: Request, res: Response) => {
    try {
        // Forward the request to the asset service health check
        console.log(`${ASSET_SERVICE_URL}/health-check`);
        const response = await axios.get(`${ASSET_SERVICE_URL}/health-check`);
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error("Error in /health/assets:", error.message);
        res.status(error.response?.status || 500).json({
            message: "Error checking asset service health",
        });
    }
});

export default assetRouter;
