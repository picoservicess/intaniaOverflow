import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";

import { AuthenticatedRequest, authenticateToken } from "../middleware/auth";
import { ReplySchema, UpdateReplySchema } from "../models";
import { rabbitMQManager } from "../rabbitMQManager";

// Initialize Prisma client and router
const prisma = new PrismaClient();

// Create a new Express router instance
const router = Router();

router.get("/health-check", async (_req: Request, res: Response) => {
  console.log("💛 Health check request received");
  res.status(200).json({ status: "OK", message: "Reply-Service is healthy" });
});


/**
 * Route to create a new reply
 * Method: POST
 * URL: /
 * Access: Requires authentication
 */
router.post(
  "/:threadId",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Extract threadId from the URL parameters
      const { threadId } = req.params;

      // Add threadId to the request body
      req.body.threadId = threadId;

      // Validate request body against the ReplySchema using Zod
      const validatedData = ReplySchema.safeParse(req.body);
      if (!validatedData.success) {
        // If validation fails, send a 400 Bad Request with error details
        res.status(400).json({
          error: "Validation failed",
          details: validatedData.error.issues,
        });
        return;
      }

      // Destructure validated data
      const { text, assetUrls } = validatedData.data;
      const userId = req.user?.userId;

      // Ensure user is authenticated
      if (!userId) {
        res.status(401).json({ error: "User ID is required" });
        return;
      }
      // Create new reply in database
      const newReply = await prisma.reply.create({
        data: {
          threadId,
          text,
          assetUrls,
          userId,
          replyAt: new Date(),
        },
      });
      
      try {
        await rabbitMQManager.publishMessage(newReply);
      } catch (mqError) {
        console.error("Failed to publish message to RabbitMQ: ", mqError)
      }

      // Send a 201 Created response with the new reply
      res.status(201).json({
        message: "Reply created successfully",
        newReply,
      });
    } catch (error) {
      console.error("Create reply error:", error);
      res.status(500).json({ error: "Failed to create reply" });
    }
  }
);


/**
 * Route to get all replies for a specific thread
 * Method: GET
 * URL: /:threadId
 * Access: Public
 */
router.get("/:threadId", async (req: Request, res: Response) => {
  try {
    // Extract threadId from the URL parameters
    const { threadId } = req.params;

    // Fetch all non-deleted replies for the thread, ordered by reply time in ascending order
    const replies = await prisma.reply.findMany({
      where: {
        threadId,
        isDeleted: false, // Only include replies that are not deleted
      },
      orderBy: {
        replyAt: "asc", // Order replies by replyAt in ascending order
      },
    });

    // Send a 200 OK response with the list of replies
    res.status(200).json(replies);
  } catch (error) {
    // Log any errors to the console
    console.error("Get replies error:", error);
    // Send a 500 Internal Server Error response
    res.status(500).json({ error: "Failed to fetch replies" });
  }
});

/**
 * Route to get a specific reply by ID within a thread
 * Method: GET
 * URL: /:threadId/:replyId
 * Access: Public
 */
router.get("/:threadId/:replyId", async (req: Request, res: Response) => {
  try {
    // Extract threadId and replyId from the URL parameters
    const { threadId, replyId } = req.params;

    // Find the specific reply that matches both threadId and replyId
    const reply = await prisma.reply.findFirst({
      where: {
        replyId,
        threadId,
        isDeleted: false, // Only include replies that are not deleted
      },
    });

    // Check if the reply exists
    if (!reply) {
      // If not found, send a 404 Not Found response
      res.status(404).json({ error: "Reply not found" });
      return;
    }

    // Send a 200 OK response with the reply data
    res.status(200).json(reply);
  } catch (error) {
    // Log any errors to the console
    console.error("Get reply error:", error);
    // Send a 500 Internal Server Error response
    res.status(500).json({ error: "Failed to fetch reply" });
  }
});

/**
 * Route to update a reply
 * Method: PUT
 * URL: /reply/:replyId
 * Access: Requires authentication and ownership of the reply
 */
router.put(
  "/:threadId/:replyId",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Extract replyId from the URL parameters
      const { threadId, replyId } = req.params;
      // Get userId from authenticated request
      const userId = req.user?.userId;

      // Ensure user is authenticated
      if (!userId) {
        // If userId is not present, send a 401 Unauthorized error
        res.status(401).json({ error: "User ID is required" });
        return;
      }

      // Validate the update data against the UpdateReplySchema using Zod
      const validatedData = UpdateReplySchema.safeParse(req.body);
      if (!validatedData.success) {
        // If validation fails, send a 400 Bad Request with error details
        res.status(400).json({
          error: "Validation failed",
          details: validatedData.error.issues,
        });
        return;
      }

      // Check if the reply exists in the database
      const existingReply = await prisma.reply.findUnique({
        where: {
          threadId,
          replyId,
        },
      });

      if (!existingReply) {
        // If reply does not exist, send a 404 Not Found response
        res.status(404).json({ error: "Reply not found" });
        return;
      }

      // Verify that the authenticated user owns the reply
      if (existingReply.userId !== userId) {
        // If not the owner, send a 403 Forbidden response
        res.status(403).json({
          error: "You are not authorized to edit this reply",
        });
        return;
      }

      // Destructure the validated data
      const { text, assetUrls } = validatedData.data;

      // Update the reply in the database
      const updatedReply = await prisma.reply.update({
        where: {
          threadId,
          replyId,
        },
        data: {
          text,
          assetUrls,
          edited: true, // Mark the reply as edited
          editAt: new Date(), // Set the edit time to the current date and time
        },
      });

      // Send a 200 OK response with the updated reply
      res.status(200).json({
        message: "Reply updated successfully",
        reply: updatedReply,
      });
    } catch (error) {
      // Log any errors to the console
      console.error("Update reply error:", error);
      // Send a 500 Internal Server Error response
      res.status(500).json({ error: "Failed to update reply" });
    }
  }
);

/**
 * Route to soft delete a reply
 * Method: DELETE
 * URL: /reply/:replyId
 * Access: Requires authentication and ownership of the reply
 */
router.delete(
  "/:threadId/:replyId",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Extract replyId from the URL parameters
      const { threadId, replyId } = req.params;
      // Get userId from authenticated request
      const userId = req.user?.userId;

      // Ensure user is authenticated
      if (!userId) {
        // If userId is not present, send a 401 Unauthorized error
        res.status(401).json({ error: "User ID is required" });
        return;
      }

      // Check if the reply exists in the database
      const existingReply = await prisma.reply.findUnique({
        where: {
          threadId,
          replyId,
        },
      });

      if (!existingReply) {
        // If reply does not exist, send a 404 Not Found response
        res.status(404).json({ error: "Reply not found" });
        return;
      }

      // Verify that the authenticated user owns the reply
      if (existingReply.userId !== userId) {
        // If not the owner, send a 403 Forbidden response
        res.status(403).json({
          error: "You are not authorized to delete this reply",
        });
        return;
      }

      // Perform a soft delete by setting isDeleted to true
      await prisma.reply.update({
        where: {
          threadId,
          replyId,
        },
        data: { isDeleted: true },
      });

      // Send a 200 OK response indicating successful deletion
      res.status(200).json({ message: "Reply deleted successfully" });
    } catch (error) {
      // Log any errors to the console
      console.error("Delete reply error:", error);
      // Send a 500 Internal Server Error response
      res.status(500).json({ error: "Failed to delete reply" });
    }
  }
);

export default router;
