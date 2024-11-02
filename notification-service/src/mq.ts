import amqp, { Channel, Connection } from "amqplib/callback_api";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { INotification } from "./models/notification";
import { createNotificationService } from "./services/notificationService";
import { resolve } from "path";

// Types
interface ThreadMessage {
  threadId: string;
  title: string;
  body: string;
  assetUrls: string[];
  tags: string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

interface ReplyMessage {
  replyId: string,
  threadId: string,
  userId: string,
  text: string,
  assetUrls: string[],
  replyAt: Date
}

// Constants
const RABBITMQ_CONFIG = {
  url: process.env.RABBITMQ_URL || "amqp://rabbitmq:5672",
  retryInterval: 5000,
  maxRetries: 12,
};

const QUEUE_CONFIG = {
  name: "notification_queue",
  exchangeName: "notification_exchange",
  deadLetterQueueName: "notification_queue_dead",
  deadLetterExchange: "notification_dlx",
};

// Configuration
dotenv.config();

async function connectToDatabase(): Promise<void> {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("📦 Connected to Database");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
}

async function processMessage(message: ThreadMessage): Promise<void> {
  const notificationData: INotification = {
    userId: message.authorId,
    targetId: message.threadId,
    isThread: true,
    isReply: false,
    isUser: false,
    isSeen: false,
    payload: message.title,
  } as INotification;

  try {
    const newNotification = await createNotificationService(notificationData);
    console.log("🔔 Notification created:", newNotification._id);
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    throw error;
  }
}

async function setupQueues(channel: Channel): Promise<void> {
  try {
    // 1. Assert Dead Letter Exchange
    await new Promise<void>((resolve, reject) => {
      channel.assertExchange(
        QUEUE_CONFIG.deadLetterExchange,
        "direct",
        { durable: true },
        (error) => {
          if (error) reject(error);
          else resolve();
        }
      );
    });

    // 2. Assert Dead Letter Queue
    await new Promise<void>((resolve, reject) => {
      channel.assertQueue(
        QUEUE_CONFIG.deadLetterQueueName,
        {
          durable: true,
        },
        (error) => {
          if (error) reject(error);
          else resolve();
        }
      );
    });

    // 3. Bind Dead Letter Queue to Exchange
    await new Promise<void>((resolve, reject) => {
      channel.bindQueue(
        QUEUE_CONFIG.deadLetterQueueName,
        QUEUE_CONFIG.deadLetterExchange,
        "", // routing key
        {}, // arguments
        (error) => {
          if (error) reject(error);
          else resolve();
        }
      );
    });

    // 4. Check if main queue exists and delete if it does
    try {
      await new Promise<void>((resolve, reject) => {
        channel.deleteQueue(QUEUE_CONFIG.name, {}, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
      console.log(`🗑️ Deleted existing queue: ${QUEUE_CONFIG.name}`);
    } catch (error) {
      console.log(
        `Queue ${QUEUE_CONFIG.name} didn't exist, proceeding with creation`
      );
    }

    // await new Promise<void>((resolve, reject) => {
    //   channel.assertExchange(
    //     QUEUE_CONFIG.exchangeName,'direct', { 
    //       durable: true 
    //     },
    //     (error) => {
    //       console.log("assert exchange error", error)

    //       if (error) reject(error);
    //       else resolve();
    //     }
    //   );
    // });

    // 5. Create main queue with dead letter configuration
    await new Promise<void>((resolve, reject) => {
      channel.assertQueue(
        QUEUE_CONFIG.name,
        {
          durable: true,
          // arguments: {
          //   "x-dead-letter-exchange": QUEUE_CONFIG.deadLetterExchange,
          //   "x-dead-letter-routing-key": "",
          // },
          deadLetterExchange: QUEUE_CONFIG.deadLetterExchange,
          deadLetterRoutingKey: ""
        },
        (error) => {
          console.log("assert queue error", error)

          if (error) reject(error);
          else resolve();
        }
      );
    });

    await new Promise<void>((resolve, reject) => {
      channel.bindQueue(
        QUEUE_CONFIG.deadLetterQueueName,
        QUEUE_CONFIG.deadLetterExchange,
        'reply', // routing key
        {}, // arguments
        (error) => {
          if (error) reject(error);
          else resolve();
        }
      );
    });

    await new Promise<void>((resolve, reject) => {
      channel.bindQueue(
        QUEUE_CONFIG.deadLetterQueueName,
        QUEUE_CONFIG.deadLetterExchange,
        'thread', // routing key
        {}, // arguments
        (error) => {
          if (error) reject(error);
          else resolve();
        }
      );
    });

    console.log("✅ Queue setup completed successfully");
  } catch (error) {
    console.error("❌ Error setting up queues:", error);
    throw error;
  }
}

function setupChannel(channel: Channel): void {
  channel.prefetch(1);
  console.log("⏱️ Waiting for messages in queue:", QUEUE_CONFIG.name);

  channel.consume(
    QUEUE_CONFIG.name,
    async (msg) => {
      if (!msg) return;

      console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());

      try {
        const message = JSON.parse(msg.content.toString());
        if (message.replyId) {
          console.log("✉️ Received message for reply:", message.replyId);
        }
        else {
          console.log("✉️ Received message for thread:", message.threadId);
        }
        // await processMessage(message);
        channel.ack(msg);
      } catch (error) {
        console.error("❌ Error processing message:", error);
        channel.nack(msg, false, false);
      }
    },
    {
      noAck: false,
    }
  );
}

function connectWithRetry(retryCount = 0): Promise<Connection> {
  return new Promise((resolve, reject) => {
    console.log(
      `⏳ Attempting to connect to RabbitMQ (Attempt ${retryCount + 1}/${RABBITMQ_CONFIG.maxRetries})...`
    );

    amqp.connect(RABBITMQ_CONFIG.url, (error, connection) => {
      if (error) {
        console.error("❌ RabbitMQ connection error:", error.message);

        if (retryCount < RABBITMQ_CONFIG.maxRetries) {
          console.log(
            `🔄 Retrying in ${RABBITMQ_CONFIG.retryInterval / 1000} seconds...`
          );
          setTimeout(() => {
            connectWithRetry(retryCount + 1)
              .then(resolve)
              .catch(reject);
          }, RABBITMQ_CONFIG.retryInterval);
        } else {
          reject(new Error("Max retry attempts reached"));
        }
        return;
      }

      connection.on("error", (err) => {
        console.error("❌ RabbitMQ connection error:", err.message);
      });

      connection.on("close", () => {
        console.log("📡 RabbitMQ connection closed");
      });

      resolve(connection);
    });
  });
}

function createChannel(connection: Connection): Promise<Channel> {
  return new Promise((resolve, reject) => {
    connection.createChannel((error, channel) => {
      if (error) {
        reject(error);
        return;
      }

      channel.on("error", (err) => {
        console.error("❌ Channel error:", err.message);
      });

      channel.on("close", () => {
        console.log("📡 Channel closed");
      });

      resolve(channel);
    });
  });
}

async function connectToRabbitMQ(): Promise<void> {
  try {
    const connection = await connectWithRetry();
    console.log("🐇 Connected to RabbitMQ");

    const channel = await createChannel(connection);
    await setupQueues(channel);
    setupChannel(channel);

    process.on("SIGINT", () => {
      console.log("🛑 Gracefully shutting down...");
      connection.close(() => {
        console.log("🔌 RabbitMQ connection closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Failed to establish RabbitMQ connection:", error);
    process.exit(1);
  }
}

export async function main(): Promise<void> {
  try {
    await connectToDatabase();
    await connectToRabbitMQ();
    console.log(
      "🚀 Rabbitmq on Notification Service fully initialized and ready"
    );
  } catch (error) {
    console.error("❌ Rabbitmq on Notification Service startup error:", error);
    process.exit(1);
  }
}
