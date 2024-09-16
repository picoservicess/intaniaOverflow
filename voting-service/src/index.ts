import express from "express";
import bodyParser from "body-parser";
import path from "path";
import client from "./clients";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
app.get("/", async (req, res) => {
  try {
    const countVote = await grpcRequest("GetCountVote", {
      isThread: req.body.isThread,
      targetId: req.body.targetId,
    });
    res.render("vote", {
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
app.post("/upvote", async (req, res) => {
  const { isThread, targetId, studentId } = req.body;
  try {
    const result = await grpcRequest("ApplyUpVote", {
      isThread,
      targetId,
      studentId,
    });
    console.log("Upvote applied successfully", result);
    res.redirect("/");
  } catch (error) {
    console.error("Error applying upvote:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Apply downvote
app.post("/downvote", async (req, res) => {
  const { isThread, targetId, studentId } = req.body;
  try {
    const result = await grpcRequest("ApplyDownVote", {
      isThread,
      targetId,
      studentId,
    });
    console.log("Downvote applied successfully", result);
    res.redirect("/");
  } catch (error) {
    console.error("Error applying downvote:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Check user vote status
app.post("/checkvote", async (req, res) => {
  const { isThread, targetId, studentId } = req.body;
  try {
    const voteStatus = await grpcRequest("IsUserVote", {
      isThread,
      targetId,
      studentId,
    });
    console.log("User vote status:", voteStatus);
    res.send({ voteStatus });
  } catch (error) {
    console.error("Error checking vote status:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.CLIENT_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
