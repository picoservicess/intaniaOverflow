import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

import { decodeJWT } from "../../user-service/token.mjs"

const router = express.Router();

// Create a new reply
router.post("/", async (req, res) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized: No bearer token provided" });
    }

    // Extract and decode JWT token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decodedToken = decodeJWT(token);
    if (!decodedToken) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Extract the required fields from the request body
    const { threadId, text, assetUrls = [] } = req.body;

    // Use the userId from the decoded JWT
    const userId = decodedToken.userId;

    // Check if threadId and text are provided
    if (!threadId || !text) {
      return res.status(400).json({ error: "threadId and text are required" });
    }

    // Inser the new reply into the database
    const reply = { threadId, text, assetUrls, userId, replyAt: new Date(), editAt: null, edited: false, isDeleted: false };
    const result = await db.collection("replies").insertOne(reply);

    // Return a success message
    res.status(201).json({ message: "Create new reply succesfully" });
  } catch (err) {
    // Handle any errors that occur
    res.status(500).json({ error: err.message });
  }
});

// Read all replies for a specific threadId
router.get("/:threadId", async (req, res) => {
  try {
    // Extract the threadId from the request parameters
    const { threadId } = req.params;

    // Find all replies for the specified threadId that are not deleted
    const replies = await db.collection("replies").find({ threadId, isDeleted: false }).toArray();

    // Return the replies
    res.status(200).json(replies);
  } catch (err) {
    // Handle any errors that occur
    res.status(500).json({ error: err.message });
  }
});

// Read a reply by ID from specified threadId
router.get("/:threadId/:id", async (req, res) => {
  try {
    // Extract the threadId and ID from the request parameters
    const { threadId, id } = req.params;

    // Find the reply by ID and threadId
    const reply = await db.collection("replies").findOne({ _id: new ObjectId(id), threadId, isDeleted: false });

    // Check if the reply exists
    if (!reply) {
      return res.status(404).json({ error: "Reply not found" });
    }

    // Return the reply
    res.status(200).json(reply);
  } catch (err) {
    // Handle any errors that occur
    res.status(500).json({ error: err.message });
  }
});

// Update a reply by ID
router.put("/reply/:id", async (req, res) => {
  try {
    // Extract the required fields from the request body and parameters
    const { id } = req.params;
    const { text, assetUrls, userId } = req.body;

    // Check if userId is provided
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: uid is required" });
    }

    // Find the reply by ID
    const reply = await db.collection("replies").findOne({ _id: new ObjectId(id) });

    // Check if the reply exists
    if (!reply) {
      return res.status(404).json({ error: "Reply not found" });
    }

    // Check if the user is authorized to edit the reply
    if (reply.userId !== userId) {
      return res.status(403).json({ error: "You are not authorized to edit this reply" });
    }

    // Create the reply with the new text and assetUrls
    const updatedReply = { text, assetUrls, edited: true, editAt: new Date() };

    // Update the reply in the database
    const result = await db.collection("replies").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedReply }
    );

    // Return a success message
    res.status(200).json({ message: "Reply updated successfully" });
  } catch (err) {
    // Handle any errors that occur
    res.status(500).json({ error: err.message });
  }
});

// Delete a reply by ID
router.delete("/reply/:id", async (req, res) => {
  try {
    // Extract the ID and userId from the request parameters and body
    const { id } = req.params;
    const { userId } = req.body;

    // Check if userId is provided
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: uid is required" });
    }

    // Find the reply by ID
    const reply = await db.collection("replies").findOne({ _id: new ObjectId(id) });

    // Check if the reply exists
    if (!reply) {
      return res.status(404).json({ error: "Reply not found" });
    }

    // Check if the user is authorized to delete the reply
    if (reply.userId !== userId) {
      return res.status(403).json({ error: "You are not authorized to delete this reply" });
    }

    // Soft delete the reply by setting isDeleted to true
    const result = await db.collection("replies").updateOne(
      { _id: new ObjectId(id) },
      { $set: { isDeleted: true } }
    );

    // Return a success message
    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;