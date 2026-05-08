import amqp from "amqplib";

let channel: amqp.Channel | null = null;

const formatRabbitError = (error: any) => {
  if (error?.message) return error.message;

  if (Array.isArray(error?.errors) && error.errors.length > 0) {
    return error.errors
      .map(
        (e: any) =>
          `${e.code || "UNKNOWN"} ${e.address || ""}:${e.port || ""}`.trim()
      )
      .join(" | ");
  }

  return "Unknown RabbitMQ connection error";
};

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);

    channel = await connection.createChannel();

    await channel.assertQueue(process.env.PAYMENT_QUEUE!, {
      durable: true,
    });

    console.log("🐇 connected To Rabbitmq");
    return true;
  } catch (error: any) {
    const reason = formatRabbitError(error);
    console.warn(
      `RabbitMQ connection failed in utils service (${process.env.RABBITMQ_URL}): ${reason}`
    );
    return false;
  }
};

export const getChannel = () => channel;
