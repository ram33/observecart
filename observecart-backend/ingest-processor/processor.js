const cron = require('node-cron');
const winston = require('winston');
const placeOrder = require('./orderScript');
require('dotenv').config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'ingest-processor' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

// Schedule the task to run every minute
cron.schedule('* * * * *', async () => {
  logger.info('Running order placement task');
  try {
    await placeOrder(baseUrl);
    logger.info('Order placement task completed successfully');
  } catch (error) {
    logger.error('Error in order placement task:', error);
  }
});

logger.info('Ingest processor started');