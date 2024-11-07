import express from "express";

import assetRouter from "./routes/asset-route";
import notificationRouter from "./routes/notification-route";
import replyRouter from "./routes/reply-route";
import threadRouter from "./routes/thread-route";
import userRouter from "./routes/user-route";
import votingRouter from "./routes/voting-route";
import applySecurityMiddleware from "./utils/sercurity";

const app = express();
const PORT = Number(process.env.API_GATEWAY_PORT) || 80;

// Apply security middleware
applySecurityMiddleware(app);

app.get("/", (req, res) => {
  res.send("This is API gateway of intaniaOverflow");
});

// Routes
app.use("/threads", threadRouter);
app.use("/asset", assetRouter);
app.use("/votes", votingRouter);
app.use("/replies", replyRouter);
app.use("/notifications", notificationRouter);
app.use("/users", userRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`🥳 API gateway server is running on http://localhost:${PORT}`);
});
