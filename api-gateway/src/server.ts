import applySecurityMiddleware from "./utils/sercurity";
import express from "express";
import threadRouter from "./routes/thread-route";

const app = express();
const PORT = Number(process.env.THREAD_SERVICE_PORT) || 8000;

// Apply security middleware
applySecurityMiddleware(app);

// Routes
app.use(threadRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`API gateway server is running on http://localhost:${PORT}`);
});
