import { Router } from "express";

import {
    applyDownvote,
    applyUpvote,
    checkVoteStatus,
    getVotes,
    healthCheck,
} from "../../controllers/voting-controller";
import { authMiddleware } from "../../middleware/auth";
import { createLogMiddleware } from "../../middleware/log";

const votingRouter = Router();

// Register a middleware to log all requests
votingRouter.use(createLogMiddleware('voting-service'));

// Check user vote status
votingRouter.get("/health", healthCheck);

// Render the voting page with current vote counts
votingRouter.get("/", getVotes);

// Apply upvote
votingRouter.post("/upvote", authMiddleware, applyUpvote);

// Apply downvote
votingRouter.post("/downvote", authMiddleware, applyDownvote);

// Check user vote status
votingRouter.post("/checkvote", authMiddleware, checkVoteStatus);

export default votingRouter;
