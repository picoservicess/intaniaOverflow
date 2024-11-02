import axios from "axios";
import express, { Request, Response } from "express";
import { createLogMiddleware } from "../middleware/log";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";

const assetRouter = express.Router();
const upload = multer({ dest: "uploads/" });

// Asset Service URL (replace with your actual asset service URL)
const ASSET_SERVICE_URL =
    `http://${process.env.ASSET_SERVICE_HOST}:${process.env.ASSET_SERVICE_PORT}` ||
    "http://asset-service:5001";
console.log("ASSET_SERVICE_URL", ASSET_SERVICE_URL);

assetRouter.use(createLogMiddleware('asset-service'));

assetRouter.post("/upload", upload.single("file"),
    async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                res.status(400).json({ message: "No file uploaded" });
                return;
            }

            // Forward the request to the asset service
            const formData = new FormData();
            formData.append("file", fs.createReadStream(req.file.path), req.file.originalname);

            const response = await axios.post(
                `${ASSET_SERVICE_URL}/asset/upload`,
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        'Authorization': `${req.headers.authorization}`, // Add the token to the request headers
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

assetRouter.get("/health", async (req: Request, res: Response) => {
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
