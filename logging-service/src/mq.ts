import { PrismaClient } from "@prisma/client";
import amqp, { Channel, Connection } from "amqplib/callback_api";

const RABBITMQ_CONFIG = {
	url: process.env.RABBITMQ_URL || "amqp://rabbitmq:5672",
	queue: process.env.RABBITMQ_CONFIG || "logging_queue",
	retryOptions: {
		initialRetryDelay: 1000, // Start with 1 second delay
		maxRetryDelay: 30000, // Max delay of 30 seconds
		maxRetries: 5, // Maximum number of retry attempts
		backoffMultiplier: 2, // Exponential backoff multiplier
	},
};

// Helper function to delay execution
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Calculate exponential backoff delay
function calculateBackoff(attempt: number): number {
	const { initialRetryDelay, maxRetryDelay, backoffMultiplier } = RABBITMQ_CONFIG.retryOptions;
	const delay = initialRetryDelay * Math.pow(backoffMultiplier, attempt);
	return Math.min(delay, maxRetryDelay);
}

async function processMessage(prisma: PrismaClient, msg: any, channel: Channel): Promise<void> {
	let attempt = 0;

	while (true) {
		try {
			const logData = JSON.parse(msg.content.toString());

			// Validate required fields
			if (
				!logData.statusCode ||
				!logData.datetime ||
				!logData.endpoint ||
				!logData.message ||
				!logData.serviceName
			) {
				throw new Error("Missing required fields in log data");
			}

			await prisma.log.create({
				data: {
					statusCode: logData.statusCode,
					datetime: new Date(logData.datetime),
					endpoint: logData.endpoint,
					message: logData.message,
					serviceName: logData.serviceName,
				},
			});
			console.log("✅ Log saved:", logData);
			channel.ack(msg);
			break;
		} catch (error) {
			attempt++;

			if (attempt >= RABBITMQ_CONFIG.retryOptions.maxRetries) {
				console.error("❌ Max retries reached for message processing:", error);
				// Dead Letter Queue (DLQ) handling could be added here
				channel.nack(msg, false, false); // Don't requeue the message
				break;
			}

			const retryDelay = calculateBackoff(attempt);
			console.warn(
				`⚠️ Retry attempt ${attempt} for message processing. Retrying in ${retryDelay}ms`
			);
			await delay(retryDelay);
		}
	}
}

async function createChannel(connection: Connection): Promise<Channel> {
	return new Promise((resolve, reject) => {
		connection.createChannel((error, channel) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(channel);
		});
	});
}

async function connectWithRetry(): Promise<Connection> {
	let attempt = 0;

	while (true) {
		try {
			return await new Promise((resolve, reject) => {
				amqp.connect(RABBITMQ_CONFIG.url, (error, connection) => {
					if (error) {
						reject(error);
						return;
					}

					// Setup connection error handler
					connection.on("error", (err) => {
						console.error("RabbitMQ connection error:", err);
						// Trigger reconnection
						setTimeout(() => connectWithRetry(), calculateBackoff(0));
					});

					connection.on("close", () => {
						console.warn("RabbitMQ connection closed. Attempting to reconnect...");
						setTimeout(() => connectWithRetry(), calculateBackoff(0));
					});

					resolve(connection);
				});
			});
		} catch (error) {
			attempt++;

			if (attempt >= RABBITMQ_CONFIG.retryOptions.maxRetries) {
				throw new Error(`Failed to connect to RabbitMQ after ${attempt} attempts: ${error}`);
			}

			const retryDelay = calculateBackoff(attempt);
			console.warn(`⚠️ Connection attempt ${attempt} failed. Retrying in ${retryDelay}ms`);
			await delay(retryDelay);
		}
	}
}

export async function main(prisma: PrismaClient): Promise<void> {
	try {
		const connection = await connectWithRetry();
		const channel = await createChannel(connection);

		// Setup channel error handler
		channel.on("error", (err) => {
			console.error("Channel error:", err);
			// Attempt to recreate channel
			createChannel(connection).catch(console.error);
		});

		channel.assertQueue(RABBITMQ_CONFIG.queue, { durable: true });

		channel.consume(RABBITMQ_CONFIG.queue, async (msg) => {
			if (msg) {
				await processMessage(prisma, msg, channel);
			}
		});

		console.log("🚀 RabbitMQ consumer started successfully");
	} catch (error) {
		console.error("❌ Fatal error in main:", error);
		process.exit(1);
	}
}
