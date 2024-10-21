import dotenv from 'dotenv';
import mongoose from 'mongoose';
import amqp, { Connection, Channel, Message } from 'amqplib/callback_api';
import { createNotificationService } from './services/notificationService';
import { INotification } from './models/notification';

dotenv.config();

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DATABASE_URL as string);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

console.log('⏳ Connecting to RabbitMQ...')
amqp.connect('amqp://localhost', function(errorConnect: Error, connection: Connection) {
  if (errorConnect) {
    console.log('🫵 Error connecting to RabbitMQ');
    throw errorConnect;
  }
  connection.createChannel(function(errorChannel: Error, channel: Channel) {
    if (errorChannel) {
      console.log('🫵 Error creating channel');
      throw errorChannel;
    }
    console.log('🐇 Connected to RabbitMQ')
    const queue = 'notification_queue';

    channel.assertQueue(queue, {
      durable: true
    });
    channel.prefetch(1);
    console.log("⏱️ Waiting for messages in %s.", queue);
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const secs = msg.content.toString().split('.').length - 1;
        const message = JSON.parse(msg.content.toString()) as
        {
          id: string;
          title: string;
          body: string;
          assetUrls: string[];
          tags: string[];
          authorId: string;
          createdAt: Date;
          updatedAt: Date;
          isDeleted: boolean;
        };
        console.log("✅ Received")
        channel.ack(msg);
        try {
          const notificationData: INotification = {
            studentId: message.authorId as string,
            targetId: message.id as string,       
            isThread: true,              
            isReply: false,              
            isUser: false,                 
            isSeen: false,                
            payload: message.title as string,
          }  as INotification;
          const newNotification = await createNotificationService(notificationData)
          console.log("🔔 Done creating", newNotification)
        }
        catch (error) {
          throw error
        }
      }
    }, {
      noAck: false
    });
    
  });
});
