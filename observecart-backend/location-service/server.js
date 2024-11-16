const express = require('express');
const Redis = require('ioredis');
const winston = require('winston');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'location-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Middleware
app.use(express.json());

// Configuration for failures and delays
const FAILURE_RATE = 0.3; // 30% failure rate
const MIN_DELAY = 500;   // Minimum delay 1 second
const MAX_DELAY = 2000;   // Maximum delay 5 seconds
const TIMEOUT_DELAY = 8000; // Timeout after 8 seconds

// Simulate different types of failures with delays
const simulateResponse = () => {
  const random = Math.random();

  if (random < FAILURE_RATE) {
    const failureTypes = [
      {
        type: 'timeout',
        delay: TIMEOUT_DELAY,
        handler: (res) => res.status(504).json({ message: 'Service timeout' })
      },
      {
        type: 'error',
        delay: getRandomDelay(),
        handler: (res) => res.status(500).json({ message: 'Internal server error' })
      },
      {
        type: 'invalid',
        delay: getRandomDelay(),
        handler: (res) => res.status(400).json({ message: 'Invalid request' })
      }
    ];

    return failureTypes[Math.floor(Math.random() * failureTypes.length)];
  }

  return {
    type: 'success',
    delay: getRandomDelay(),
    handler: (res, productId) => {
      const locations = ['loc1', 'loc2'];
      logger.info(`Returning locations for product ${productId}: ${locations.join(', ')}`);
      res.json({ locations });
    }
  };
};

// Generate a random delay between MIN_DELAY and MAX_DELAY
const getRandomDelay = () => {
  return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY);
};

app.get('/available-locations/:productId', (req, res) => {
  const { productId } = req.params;
  const response = simulateResponse();

  logger.info(`Processing request for product ${productId}. Response type: ${response.type}, Delay: ${response.delay}ms`);

  setTimeout(() => {
    response.handler(res, productId);
  }, response.delay);
});

app.listen(PORT, () => {
  logger.info(`Location service running on port ${PORT}`);
});