import axios from "axios";
import express, { Request, Response } from "express";
import { createLogMiddleware } from "../middleware/log";

const replyRouter = express.Router();

const REPLY_SERVICE_URL =
    `http://${process.env.REPLY_SERVICE_HOST}:${process.env.REPLY_SERVICE_PORT}` ||
    "http://reply-service:5003";
console.log("REPLY_SERVICE_URL", REPLY_SERVICE_URL);

replyRouter.use(createLogMiddleware('reply-service'));

replyRouter.get("/health", async (req: Request, res: Response) => {
    try {
        // Forward the request to the asset service health check
        console.log(`${REPLY_SERVICE_URL}/replies/health-check`);
        const response = await axios.get(`${REPLY_SERVICE_URL}/replies/health-check`);
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error("Error in /replies/health:", error.message);
        res.status(error.response?.status || 500).json({
            message: "Error checking reply service health",
        });
    }
});

replyRouter.post("/:threadId", async (req: Request, res: Response) => {
    // Extract threadId from request parameters
    const { threadId } = req.params;
    try {
        const response = await axios.post(
            `${REPLY_SERVICE_URL}/replies/${threadId}`,
            req.body,
            {
                headers: {
                    ...req.headers,
                },
                timeout: 10000,
            }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error("Error in /replies:", error.message);
        // res.status(error.response?.status || 500).json({
        //     message: "Error uploading reply",
        // });
        if (error.response) {
            console.error("Response data:", error.response.data); // Log the response data if available
            console.error("Response status:", error.response.status); // Log the status code
            console.error("Response headers:", error.response.headers); // Log the response headers
            res.status(error.response.status).json({
                message: "Error creating reply",
                details: error.response.data,
            });
        } else {
            // If no response object, log the error and send a generic message
            console.error("Error without response:", error);
            res.status(500).json({
                message: "Error creating reply",
                details: "Internal Server Error",
            });
        }
    }
});

replyRouter.get("/:threadId", async (req: Request, res: Response) => {
    const { threadId } = req.params;
    try {
        const response = await axios.get(
            `${REPLY_SERVICE_URL}/replies/${threadId}`,
            {
                headers: {
                    ...req.headers,
                }
            }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error("Error in /replies:", error.message);
        res.status(error.response?.status || 500).json({
            message: "Error to get all replies for a specific thread",
        });
    }
});

replyRouter.get("/:threadId/:replyId", async (req: Request, res: Response) => {
    const { threadId, replyId } = req.params;
    try {
        const response = await axios.get(
            `${REPLY_SERVICE_URL}/replies/${threadId}/${replyId}`,
            {
                headers: {
                    ...req.headers,
                }
            }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error("Error in /replies:", error.message);
        res.status(error.response?.status || 500).json({
            message: "Error to get a specific reply by ID within a thread",
        });
    }
});

replyRouter.put("/:threadId/:replyId", async (req: Request, res: Response) => {
    const { threadId, replyId } = req.params;
    try {
        const response = await axios.put(
            `${REPLY_SERVICE_URL}/replies/${threadId}/${replyId}`,
            req.body,
            {
                headers: {
                    ...req.headers,
                }
            }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error("Error in /replies:", error.message);
        res.status(error.response?.status || 500).json({
            message: "Error to update a reply",
        });
    }
});

replyRouter.delete("/:threadId/:replyId", async (req: Request, res: Response) => {
    const { threadId, replyId } = req.params;
    try {
        const response = await axios.delete(
            `${REPLY_SERVICE_URL}/replies/${threadId}/${replyId}`,
            {
                headers: {
                    ...req.headers,
                }
            }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        console.error("Error in /replies:", error.message);
        res.status(error.response?.status || 500).json({
            message: "Error to soft delete a reply",
        });
    }
});



export default replyRouter;
