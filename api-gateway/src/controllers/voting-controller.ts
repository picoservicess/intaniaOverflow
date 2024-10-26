import votingClient from "../routes/voting-route/client";
import { getGrpcRequest } from "../utils/grpc";

// Helper function to handle gRPC requests
const grpcRequest = getGrpcRequest(votingClient);

// Get current vote counts
export const getVotes = async (req: any, res: any) => {
    try {
        const { isThread, targetId } = req.body;
        const countVote = await grpcRequest("GetCountVote", {
            isThread,
            targetId,
        });
        res.status(200).json({
            upVotes: countVote.upVotes,
            downVotes: countVote.downVotes,
            netVotes: countVote.netVotes,
        });
    } catch (error) {
        console.error("Error fetching vote counts:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Apply upvote
export const applyUpvote = async (req: any, res: any) => {
    const { isThread, targetId, studentId } = req.body;
    try {
        const result = await grpcRequest("ApplyUpVote", {
            isThread,
            targetId,
            studentId,
        });
        console.log("Upvote applied successfully", result);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error applying upvote:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Apply downvote
export const applyDownvote = async (req: any, res: any) => {
    const { isThread, targetId, studentId } = req.body;
    try {
        const result = await grpcRequest("ApplyDownVote", {
            isThread,
            targetId,
            studentId,
        });
        console.log("Downvote applied successfully", result);
        res.status(200).send(result);
    } catch (error) {
        console.error("Error applying downvote:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Check user vote status
export const checkVoteStatus = async (req: any, res: any) => {
    const { isThread, targetId, studentId } = req.body;
    try {
        const voteStatus = await grpcRequest("IsUserVote", {
            isThread,
            targetId,
            studentId,
        });
        console.log("User vote status:", voteStatus);
        res.status(200).send({ voteStatus });
    } catch (error) {
        console.error("Error checking vote status:", error);
        res.status(500).send("Internal Server Error");
    }
};

export const healthCheck = async (req: any, res: any) => {
    try {
        const result = await grpcRequest("HealthCheck", {});
        res.status(200).send(result);
    } catch (error) {
        console.error("Error checking health:", error);
        res.status(500).send("Internal Server Error");
    }
}