import { Router } from 'express';

import {
    applyDownvote,
    applyUpvote,
    checkVoteStatus,
    getVotes,
} from '../../controllers/voting-controller';
import { authMiddleware } from '../../middleware/auth';

const votingRouter = Router();

// Render the voting page with current vote counts
votingRouter.get('/votes/', getVotes);

// Apply upvote
votingRouter.post('/votes/upvote', authMiddleware, applyUpvote);

// Apply downvote
votingRouter.post('/votes/downvote', authMiddleware, applyDownvote);

// Check user vote status
votingRouter.get('/votes/checkvote', authMiddleware, checkVoteStatus);

export default votingRouter;
