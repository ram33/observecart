const express = require('express');
const kafka = require('kafka-node');
const winston = require('winston');
require('newrelic');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'order-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Kafka setup
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKERS });
const producer = new kafka.Producer(client);

producer.on('ready', () => {
  logger.info('Kafka Producer is ready');
});

producer.on('error', (error) => {
  logger.error('Kafka Producer error:', error);
});

// Middleware
app.use(express.json());

// Routes
app.post('/orders', (req, res) => {
  const { userId, cartItems } = req.body;
  const order = { userId, cartItems, timestamp: Date.now(), orderId: Date.now().toString() };
  const payloads = [{ topic: 'orders', messages: JSON.stringify(order) }];

  producer.send(payloads, (err, data) => {
    if (err) {
      logger.error('Error producing Kafka message:', err);
      res.status(500).json({ message: 'Error creating order' });
    } else {
      logger.info('Order sent to Kafka:', data);
      res.json({ message: 'Order placed successfully', orderId: order.orderId });
    }
  });
});


// Start server
app.listen(PORT, () => {
  logger.info(`Order service running on port ${PORT}`);
});