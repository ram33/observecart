const express = require('express');
const axios = require('axios');
const winston = require('winston');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'inventory-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Middleware
app.use(express.json());

// Routes
app.get('/check/:productId', async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.query;

  logger.info(`Checking inventory for product ${productId}, quantity ${quantity}`);

  try {
    // Call location service to get available locations
    const locationResponse = await axios.get(`http://location-service:3006/available-locations/${productId}`);
    const availableLocations = locationResponse.data.locations;

    // // Check stock across all available locations
    // let totalStock = 0;
    // availableLocations.forEach(location => {
    //   totalStock += inventory.stockByLocation[productId]?.[location] || 0;
    // });

    const available = true; //totalStock >= parseInt(quantity);
    logger.info(`Inventory check result: ${available ? 'Available' : 'Not available'}`);

    res.json({ available, totalStock: 100, availableLocations });
  } catch (error) {
    logger.error('Error checking inventory:', error);
    res.status(503).json({ message: 'Unable to verify inventory' });
  }
});

// Start server
app.listen(PORT, () => {
  logger.info(`Cart service running on port ${PORT}`);
});