import dotenv from 'dotenv';
import mongoose from 'mongoose';
import amqp, { Connection, Channel } from 'amqplib/callback_api';
import { createNotificationService } from './services/notificationService';
import { INotification } from './models/notification';

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

// Constants
const RABBITMQ_URL = 'amqp://rabbitmq:5672';
const QUEUE_NAME = 'notification_queue';

// Configuration
dotenv.config();

// Database setup
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

// RabbitMQ message processing
async function processMessage(message: ThreadMessage): Promise<void> {
  const notificationData: INotification = {
    studentId: message.authorId,
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

// RabbitMQ channel setup
function setupChannel(channel: Channel): void {
  channel.assertQueue(QUEUE_NAME, { durable: true });
  channel.prefetch(1);
  console.log("⏱️ Waiting for messages in queue:", QUEUE_NAME);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    try {
      const message = JSON.parse(msg.content.toString()) as ThreadMessage;
      console.log("✉️ Received message for thread:", message.threadId);

      await processMessage(message);
      channel.ack(msg);
    } catch (error) {
      console.error("❌ Error processing message:", error);
      // Depending on your error handling strategy, you might want to:
      // - Nack the message with requeue: channel.nack(msg, false, true);
      // - Send to dead letter queue
      // - Log to error monitoring service
      channel.nack(msg, false, false);
    }
  }, {
    noAck: false
  });
}

// RabbitMQ connection setup
function connectToRabbitMQ(): void {
  console.log('⏳ Connecting to RabbitMQ...');

  amqp.connect(RABBITMQ_URL, (error, connection) => {
    if (error) {
      console.error('❌ RabbitMQ connection error:', error);
      process.exit(1);
    }

    connection.createChannel((channelError, channel) => {
      if (channelError) {
        console.error('❌ RabbitMQ channel error:', channelError);
        process.exit(1);
      }

      console.log('🐇 Connected to RabbitMQ');
      setupChannel(channel);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      connection.close();
      process.exit();
    });
  });
}

// Main application startup
export async function main(): Promise<void> {
  try {
    await connectToDatabase();
    connectToRabbitMQ();
  } catch (error) {
    console.error("❌ Application startup error:", error);
    process.exit(1);
  }
}

// main();