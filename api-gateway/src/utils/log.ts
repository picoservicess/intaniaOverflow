import amqp from "amqplib/callback_api";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
const LOGGING_QUEUE = "logging_queue";

export function publishLog(log: any) {
  amqp.connect(RABBITMQ_URL, (error, connection) => {
    if (error) {
      console.error("❌ RabbitMQ connection error:", error);
      return;
    }
    connection.createChannel((channelError, channel) => {
      if (channelError) {
        console.error("❌ Channel error:", channelError);
        return;
      }
      channel.assertQueue(LOGGING_QUEUE, { durable: true });
      channel.sendToQueue(LOGGING_QUEUE, Buffer.from(JSON.stringify(log)), {
        persistent: true,
      });
      console.log("✅ Log published:", log);
    });
  });
}