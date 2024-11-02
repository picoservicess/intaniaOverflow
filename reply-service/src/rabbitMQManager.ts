import { Channel, Connection, connect } from "amqplib/callback_api";

class RabbitMQManager {
  private static instance: RabbitMQManager;
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly url: string;
  private readonly queue: string;
  private readonly exchange: string;
  private connecting: boolean = false;
  private connectionRetries: number = 0;
  private readonly maxRetries: number = 5;

  private constructor() {
    this.url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5673";
    this.queue = process.env.RABBITMQ_QUEUE || "notification_queue";
    this.exchange = process.env.RABBITMQ_EXCHANGE || "notification_exchange"; 
  }

  public static getInstance(): RabbitMQManager {
    if (!RabbitMQManager.instance) {
      RabbitMQManager.instance = new RabbitMQManager();
    }
    return RabbitMQManager.instance;
  }

  private async createConnection(): Promise<void> {
    if (this.connecting) return;
    this.connecting = true;

    return new Promise((resolve, reject) => {
      connect(this.url, (error: Error, connection: Connection) => {
        if (error) {
          this.connecting = false;
          console.error("🚫 Failed to connect to RabbitMQ:", error.message);
          reject(error);
          return;
        }

        this.connection = connection;
        console.log("🐇 Connected to RabbitMQ");

        connection.on("error", (err) => {
          console.error("🚫 RabbitMQ connection error:", err.message);
          this.handleConnectionError();
        });

        connection.on("close", () => {
          console.log("🔄 RabbitMQ connection closed");
          this.handleConnectionError();
        });

        connection.createChannel((channelError: Error, channel: Channel) => {
          if (channelError) {
            this.connecting = false;
            console.error("🚫 Failed to create channel:", channelError.message);
            reject(channelError);
            return;
          }

          this.channel = channel;
          // channel.assertExchange(this.exchange, 'direct', {
          //   durable: false
          // });
          // channel.assertQueue(this.queue, { durable: true });

          channel.on("error", (err) => {
            console.error("🚫 Channel error:", err.message);
            this.handleChannelError();
          });

          channel.on("close", () => {
            console.log("🔄 Channel closed");
            this.handleChannelError();
          });

          this.connecting = false;
          this.connectionRetries = 0;
          resolve();
        });
      });
    });
  }

  private async handleConnectionError(): Promise<void> {
    this.connection = null;
    this.channel = null;

    if (this.connectionRetries < this.maxRetries) {
      this.connectionRetries++;
      const delay = Math.min(
        1000 * Math.pow(2, this.connectionRetries - 1),
        30000
      );
      console.log(
        `🔄 Attempting to reconnect in ${delay}ms (Attempt ${this.connectionRetries}/${this.maxRetries})`
      );

      setTimeout(async () => {
        try {
          await this.createConnection();
        } catch (error) {
          console.error("🚫 Reconnection attempt failed:", error);
        }
      }, delay);
    } else {
      console.error("❌ Max reconnection attempts reached");
    }
  }

  private handleChannelError(): void {
    this.channel = null;
    if (this.connection) {
      try {
        this.connection.createChannel((error: Error, channel: Channel) => {
          if (error) {
            console.error("🚫 Failed to recreate channel:", error.message);
            return;
          }
          this.channel = channel;
          // channel.assertQueue(this.queue, { durable: true });
        });
      } catch (error) {
        console.error("🚫 Error recreating channel:", error);
      }
    }
  }

  public async publishMessage(message: any): Promise<void> {
    try {
      if (!this.connection || !this.channel) {
        await this.createConnection();
      }

      if (!this.channel) {
        throw new Error("No channel available");
      }

      // this.channel.publish(
      //   this.exchange,
      //   'reply',
      //   Buffer.from(JSON.stringify(message)),
      //   { persistent: true }
      // );

      this.channel.sendToQueue(
        this.queue,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );

      console.log("✅ Successfully published message:", message);
    } catch (error) {
      console.error("🚫 Error publishing message:", error);
      throw error;
    }
  }
}

export const rabbitMQManager = RabbitMQManager.getInstance();
