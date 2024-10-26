import { controllerWrapper, validateAuth } from "../middleware/auth";
import votingClient from "../routes/voting-route/client";
import { getGrpcRequest } from "../utils/grpc";

interface VoteRequest {
    isThread: boolean;
    targetId: string;
    studentId?: string;
}

interface VoteCount {
    upVotes: number;
    downVotes: number;
    netVotes: number;
}

interface VoteStatus {
    voteStatus: {
        hasVoted: boolean;
        voteType?: 'up' | 'down';
    };
}

const grpcRequest = getGrpcRequest(votingClient);

// Get current vote counts
export const getVotes = controllerWrapper(async (req: any, res: any) => {
    try {
        const { isThread, targetId }: VoteRequest = req.body;

        if (!targetId) {
            res.status(400).json({ error: "targetId is required" });
            return;
        }

        const countVote = await grpcRequest("GetCountVote", {
            isThread,
            targetId,
        });

        const response: VoteCount = {
            upVotes: countVote.upVotes,
            downVotes: countVote.downVotes,
            netVotes: countVote.netVotes,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching vote counts:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Apply upvote
export const applyUpvote = controllerWrapper(async (req: any, res: any) => {
    const token = validateAuth(req);
    const { isThread, targetId, studentId }: VoteRequest = req.body;

    if (!targetId || !studentId) {
        res.status(400).json({ error: "targetId and studentId are required" });
        return;
    }

    const result = await grpcRequest("ApplyUpVote",
        {
            isThread,
            targetId,
            studentId,
        },
        { token }
    );

    console.log("Upvote applied successfully", result);

    res.status(200).json({
        message: "Upvote applied successfully",
        result
    });
});

// Apply downvote
export const applyDownvote = controllerWrapper(async (req: any, res: any) => {
    const token = validateAuth(req);
    const { isThread, targetId, studentId }: VoteRequest = req.body;

    if (!targetId || !studentId) {
        res.status(400).json({ error: "targetId and studentId are required" });
        return;
    }

    const result = await grpcRequest("ApplyDownVote",
        {
            isThread,
            targetId,
            studentId,
        },
        { token }
    );

    console.log("Downvote applied successfully", result);

    res.status(200).json({
        message: "Downvote applied successfully",
        result
    });
});

// Check user vote status
export const checkVoteStatus = controllerWrapper(async (req: any, res: any) => {
    const token = validateAuth(req);
    const { isThread, targetId, studentId }: VoteRequest = req.body;

    if (!targetId || !studentId) {
        res.status(400).json({ error: "targetId and studentId are required" });
        return;
    }

    const voteStatus = await grpcRequest("IsUserVote",
        {
            isThread,
            targetId,
            studentId,
        },
        { token }
    );

    const response: VoteStatus = {
        voteStatus: {
            hasVoted: !!voteStatus.voteType,
            voteType: voteStatus.voteType as 'up' | 'down'
        }
    };

    res.status(200).json(response);
});