import { Router } from "express";
import {
    applyDownvote,
    applyUpvote,
    checkVoteStatus,
    getVotes,
    healthCheck,
} from "../../controllers/voting-controller";

const votingRouter = Router();

// Render the voting page with current vote counts
votingRouter.get("/votes/", getVotes);

// Apply upvote
votingRouter.post("/votes/upvote", applyUpvote);

// Apply downvote
votingRouter.post("/votes/downvote", applyDownvote);

// Check user vote status
votingRouter.get("/votes/checkvote", checkVoteStatus);

// Check user vote status
votingRouter.get("/health/votes", healthCheck);

export default votingRouter;
