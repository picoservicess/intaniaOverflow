import amqp, { Connection, Channel, Message } from 'amqplib/callback_api';

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
    channel.consume(queue, function(msg) {
      if (msg !== null) {
        const secs = msg.content.toString().split('.').length - 1;
        console.log("✅ Received");
        console.log(JSON.parse(msg.content.toString()));

        setTimeout(function() {
          console.log("🔔 Done");
          channel.ack(msg);
        }, secs * 1000);
      }
    }, {
      noAck: false
    });
  });
});
