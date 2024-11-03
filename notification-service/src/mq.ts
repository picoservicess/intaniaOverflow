import amqp, { Channel, Connection } from "amqplib/callback_api";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { INotification } from "./models/notification";
import { createNotificationService } from "./services/notificationService";
import { resolve } from "path";
import { getGrpcRequest } from "./utils/grpc";
import userClient from './repositories/userRepository';

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
  threadId: string;
  text: string;
  assetUrls: string[];
  replyId: string;
  userId: string;
  replyAt: Date;
  editAt: Date | null;
  edited: boolean;
  isDeleted: boolean;
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

const grpcRequest = getGrpcRequest(userClient);

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

async function getPinnedThreadUsers(threadId: string): Promise <string[]> {
  try {
    const usersWhoPinnedThread = await grpcRequest("getUsersWhoPinnedThread", { threadId });
    return usersWhoPinnedThread.userIds
  } catch (error) {
    console.error("⛔️ Error getting users who pinned thread:", error);
    throw error;
  }
}

async function parseThread(message: ThreadMessage, userId: string): Promise<INotification> {
  const notificationData: INotification = {
    senderId: message.authorId,
    receiverId: userId,
    isThread: true,
    isReply: false,
    isUser: false,
    isSeen: false,
    payload: message.title,
  } as INotification;
  return notificationData;
}

async function parseReply(message: ReplyMessage, userId: string): Promise<INotification> {
  const notificationData: INotification = {
    senderId: message.userId,
    receiverId: userId,
    isThread: true,
    isReply: false,
    isUser: false,
    isSeen: false,
    payload: message.text,
  } as INotification;
  return notificationData;
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

    await new Promise<void>((resolve, reject) => {
      channel.assertExchange(
        QUEUE_CONFIG.exchangeName,'direct', { 
          durable: true 
        },
        (error) => {
          console.log("assert exchange error", error)

          if (error) reject(error);
          else resolve();
        }
      );
    });

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
        QUEUE_CONFIG.name,
        QUEUE_CONFIG.exchangeName,
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
        QUEUE_CONFIG.name,
        QUEUE_CONFIG.exchangeName,    
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

      // console.log("🧭 %s: '%s'", msg.fields.routingKey, msg.content.toString());

      try {
        const message = JSON.parse(msg.content.toString());
        if (msg.fields.routingKey == 'reply') {
          console.log("✉️ Received message for reply:", message.replyId);
          await processReplyMessage(message);
        }

        if (msg.fields.routingKey == 'thread') {
          console.log("✉️ Received message for thread:", message.threadId);
          await processThreadMessage(message);
        }
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
