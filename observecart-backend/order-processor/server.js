const { Kafka } = require('kafkajs');
const axios = require('axios');
const winston = require('winston');
require('dotenv').config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'order-processor-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

const kafka = new Kafka({
  clientId: 'order-processor',
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'order-processor-group' });

const processOrder = async (order) => {
  logger.info(`Processing order: ${order && order.orderId}`);

  if (!order || !order.cartItems || typeof order.cartItems !== 'object') {
    logger.error(`Invalid order structure. CartItems is missing or not an object. Order ID: ${order.orderId}`);
    return; // Exit the function early
  }

  // Update inventory
  for (const [productId, quantity] of Object.entries(order.cartItems)) {
    try {
      // await axios.post(`${process.env.INVENTORY_SERVICE_URL}/update`, {
      //   productId,
      //   quantity: -quantity, // Decrease inventory
      // });
      logger.info(`Updated inventory for product ${productId}`);
    } catch (error) {
      logger.error(`Failed to update inventory for product ${productId}:`, error);
      // In a real-world scenario, you might want to implement retry logic or compensation transactions
    }
  }

  // Here you could add more processing steps, like payment processing, shipping arrangements, etc.

  logger.info(`Finished processing order: ${order.orderId}`);
};

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'orders', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(message.value.toString());
      await processOrder(order);
    },
  });
};

run().catch((error) => {
  logger.error('Error in order processor:', error);
  process.exit(1);
});