import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { CountVoteRequest, Thread, Vote, VoteRequest } from "./models";

const app = express();
const PORT = Number(process.env.THREAD_SERVICE_PORT) || 8000;

app.use(bodyParser.json());

// Sample data (replace with a real database or other storage)
let threads: Thread[] = [];
let votes: Vote[] = []; // To store votes for threads or comments

// ================= ThreadService ==================

// Get all threads
app.get("/threads", (req: Request, res: Response) => {
    res.json({ threads });
});

// Get thread by ID
app.get("/threads/:threadId", (req: Request, res: Response) => {
    const threadId = req.params.threadId;
    const thread = threads.find((t) => t.threadId === threadId);

    if (thread) {
        res.json(thread);
    } else {
        res.status(404).send("Thread not found");
    }
});

// Create a new thread
app.post("/threads", (req: Request, res: Response) => {
    const newThread: Thread = req.body;
    newThread.threadId = `thread_${threads.length + 1}`; // Mock ID generation
    threads.push(newThread);
    res.status(201).json(newThread);
});

// Update existing thread
app.put("/threads/:threadId", (req: Request, res: Response) => {
    const threadId = req.params.threadId;
    const updatedThread: Thread = req.body;

    const threadIndex = threads.findIndex((t) => t.threadId === threadId);
    if (threadIndex >= 0) {
        threads[threadIndex] = { ...updatedThread, threadId }; // Preserve original ID
        res.json(threads[threadIndex]);
    } else {
        res.status(404).send("Thread not found");
    }
});

// Delete thread
app.delete("/threads/:threadId", (req: Request, res: Response) => {
    const threadId = req.params.threadId;
    threads = threads.filter((t) => t.threadId !== threadId);
    res.status(204).send(); // No Content
});

// Search threads
app.get("/threads/search", (req: Request, res: Response) => {
    const query = (req.query.query as string) || "";
    const results = threads.filter(
        (thread) => thread.title.includes(query) || thread.body.includes(query)
    );
    res.json({ threads: results });
});

// Health check
app.get("/health", (req: Request, res: Response) => {
    res.status(200).send("OK");
});

// ================= VotingService ==================

// // Apply UpVote
// app.post('/vote/up', (req: Request, res: Response) => {
//     const { isThread, targetId, studentId }: VoteRequest = req.body;

//     const existingVote = votes.find(v => v.isThread === isThread && v.targetId === targetId && v.studentId === studentId);
//     if (existingVote) {
//         if (existingVote.voteType === 1) {
//             return res.status(200).json({ success: false, message: "Already upvoted" });
//         }
//         existingVote.voteType = 1;  // Update to upvote
//     } else {
//         votes.push({ isThread, targetId, studentId, voteType: 1 });
//     }

//     res.status(200).json({ success: true, message: "Upvoted successfully" });
// });

// // Apply DownVote
// app.post('/vote/down', (req: Request, res: Response) => {
//     const { isThread, targetId, studentId }: VoteRequest = req.body;

//     const existingVote = votes.find(v => v.isThread === isThread && v.targetId === targetId && v.studentId === studentId);
//     if (existingVote) {
//         if (existingVote.voteType === -1) {
//             return res.status(200).json({ success: false, message: "Already downvoted" });
//         }
//         existingVote.voteType = -1;  // Update to downvote
//     } else {
//         votes.push({ isThread, targetId, studentId, voteType: -1 });
//     }

//     res.status(200).json({ success: true, message: "Downvoted successfully" });
// });

// Get count of votes
app.get("/vote/count", (req: Request, res: Response) => {
    const { isThread, targetId }: CountVoteRequest = req.query as any;

    const upVotes = votes.filter(
        (v) =>
            v.isThread === (isThread === true) &&
            v.targetId === targetId &&
            v.voteType === 1
    ).length;
    const downVotes = votes.filter(
        (v) =>
            v.isThread === (isThread === true) &&
            v.targetId === targetId &&
            v.voteType === -1
    ).length;
    const netVotes = upVotes - downVotes;

    res.status(200).json({ upVotes, downVotes, netVotes });
});

// Check if user has voted
app.post("/vote/status", (req: Request, res: Response) => {
    const { isThread, targetId, studentId }: VoteRequest = req.body;

    const vote = votes.find(
        (v) =>
            v.isThread === isThread &&
            v.targetId === targetId &&
            v.studentId === studentId
    );
    if (vote) {
        res.status(200).json({ voteStatus: vote.voteType });
    } else {
        res.status(200).json({ voteStatus: 0 }); // No vote
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
