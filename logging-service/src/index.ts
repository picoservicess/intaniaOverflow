import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import express, { Application } from "express";

import { main as startMQ } from "./mq";

dotenv.config();

const app: Application = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Logging Service is running");
});

const port = process.env.PORT || 5007;
app.listen(port, () => console.log(`Server started on port ${port}`));

startMQ(prisma).catch((error) => {
	console.error("❌ Failed to start RabbitMQ:", error);
	process.exit(1);
});
