import { Router } from "express";
import client from "./client";

const votingRouter = Router();

// Helper function to handle gRPC requests
const grpcRequest = (method: string, requestData: any) => {
    return new Promise<any>((resolve, reject) => {
        client[method](requestData, (error: any, response: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

// Render the voting page with current vote counts
votingRouter.get("/votes/", async (req, res) => {
    try {
        const { isThread, targetId } = req.body;
        const countVote = await grpcRequest("GetCountVote", {
            isThread,
            targetId,
        });
        res.status(200).render("vote", {
            upVotes: countVote.upVotes,
            downVotes: countVote.downVotes,
            netVotes: countVote.netVotes,
        });
    } catch (error) {
        console.error("Error fetching vote counts:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Apply upvote
votingRouter.post("/votes/upvote", async (req, res) => {
    const { isThread, targetId, studentId } = req.body;
    try {
        const result = await grpcRequest("ApplyUpVote", {
            isThread,
            targetId,
            studentId,
        });
        console.log("Upvote applied successfully", result);
        res.status(200).send(result);
        // res.redirect("/");
    } catch (error) {
        console.error("Error applying upvote:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Apply downvote
votingRouter.post("/votes/downvote", async (req, res) => {
    const { isThread, targetId, studentId } = req.body;
    try {
        const result = await grpcRequest("ApplyDownVote", {
            isThread,
            targetId,
            studentId,
        });
        console.log("Downvote applied successfully", result);
        res.status(200).send(result);
        // res.redirect("/");
    } catch (error) {
        console.error("Error applying downvote:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Check user vote status
votingRouter.get("/votes/checkvote", async (req, res) => {
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
});

export default votingRouter;
