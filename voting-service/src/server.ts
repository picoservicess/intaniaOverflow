import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "./api-docs/openAPIRouter";
import { healthCheckRouter } from "./api/healthCheck/healthCheckRouter";
import { voteRouter } from "./api/vote/voteRouter";

import errorHandler from "./common/middleware/errorHandler";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json()); // parse json request body
app.use(express.urlencoded({ extended: true })); // parse urlencoded request body
app.use(cors()); // enable cors
app.use(helmet()); // set security HTTP headers

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/vote", voteRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
