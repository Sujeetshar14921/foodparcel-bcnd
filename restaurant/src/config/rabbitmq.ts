import amqp from "amqplib";

let channel: amqp.Channel | null = null;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);

    channel = await connection.createChannel();

    await channel.assertQueue(process.env.PAYMENT_QUEUE!, {
      durable: true,
    });

    await channel.assertQueue(process.env.RIDER_QUEUE!, {
      durable: true,
    });

    console.log("🐇 connected To Rabbitmq(restaurant service)");
    return true;
  } catch (error: any) {
    console.warn(
      `RabbitMQ connection failed in restaurant service: ${error.message}`
    );
    return false;
  }
};

export const getChannel = () => channel;
