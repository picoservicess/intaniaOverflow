import { controllerWrapper, validateAuth } from "../middleware/auth";
import { VoteCount, VoteRequest } from "../models/vote-model";
import votingClient from "../routes/voting-route/client";
import { getGrpcRequest } from "../utils/grpc";

const grpcRequest = getGrpcRequest(votingClient);

enum VoteStatus {
  UPVOTE = 1,
  DOWNVOTE = -1,
  NO_VOTE = 0
}

// Get current vote counts
export const getVotes = controllerWrapper(async (req: any, res: any) => {
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
});

// Apply upvote
export const applyUpvote = controllerWrapper(async (req: any, res: any) => {
  const token = validateAuth(req);
  const { isThread, targetId }: VoteRequest = req.body;

  if (!targetId) {
    res.status(400).json({ error: "targetId is required" });
    return;
  }

  const result = await grpcRequest(
    "ApplyUpVote",
    {
      isThread,
      targetId,
    },
    { token }
  );

  console.log("Upvote applied successfully", result);

  res.status(200).json({
    message: "Upvote applied successfully",
    result,
  });
});

// Apply downvote
export const applyDownvote = controllerWrapper(async (req: any, res: any) => {
  const token = validateAuth(req);
  const { isThread, targetId }: VoteRequest = req.body;

  if (!targetId) {
    res.status(400).json({ error: "targetId is required" });
    return;
  }

  const result = await grpcRequest(
    "ApplyDownVote",
    {
      isThread,
      targetId,
    },
    { token }
  );

  console.log("Downvote applied successfully", result);

  res.status(200).json({
    message: "Downvote applied successfully",
    result,
  });
});

// Check user vote status
export const checkVoteStatus = controllerWrapper(async (req: any, res: any) => {
  const token = validateAuth(req);
  const { isThread, targetId } = req.query;

  if (!targetId) {
    res.status(400).json({ error: "targetId is required" });
    return;
  }

  const { voteStatus } = await grpcRequest(
    "IsUserVote",
    {
      isThread,
      targetId,
    },
    { token }
  );

  const response = {
    voteStatus: voteStatus === VoteStatus.UPVOTE
      ? "UPVOTE"
      : voteStatus === VoteStatus.DOWNVOTE
        ? "DOWNVOTE"
        : "NO_VOTE",
  };

  res.status(200).json(response);
});

// Health check
export const healthCheck = controllerWrapper(async (req: any, res: any) => {
  try {
    const result = await grpcRequest("HealthCheck", {});
    res.status(200).send(result);
  } catch (error) {
    console.error("Error checking health:", error);
    res.status(500).send("Internal Server Error");
  }
});