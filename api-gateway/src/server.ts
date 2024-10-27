import express from "express";

import assetRouter from "./routes/asset-route";
import threadRouter from "./routes/thread-route";
import votingRouter from "./routes/voting-route";
import applySecurityMiddleware from "./utils/sercurity";

const app = express();
const PORT = Number(process.env.API_GATEWAY_PORT) || 80;

// Apply security middleware
applySecurityMiddleware(app);

// Routes
app.use(threadRouter);
app.use(assetRouter);
app.use(votingRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`🥳 API gateway server is running on http://localhost:${PORT}`);
});
