const express = require('express');
const Redis = require('ioredis');
const winston = require('winston');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'cart-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Redis connection
const redisClient = new Redis(process.env.REDIS_URI);

redisClient.on('error', (error) => {
  logger.error('Redis error:', error);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

// Middleware
app.use(express.json());

// Routes
app.post('/cart/add', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    try {
      const inventoryResponse = await axios.get(`http://inventory-service:3005/check/${productId}?quantity=${quantity}`);
      if (!inventoryResponse.data.available) {
        return res.status(400).json({ message: 'Insufficient inventory' });
      }
    } catch (error) {
      logger.error('Error checking inventory:', error);
      return res.status(503).json({ message: 'Unable to verify inventory' });
    }

    const cartKey = `cart:${userId}`;

    let cart = JSON.parse(await redisClient.get(cartKey) || '{}');

    if (cart[productId]) {
      cart[productId] += quantity;
    } else {
      cart[productId] = quantity;
    }

    await redisClient.set(cartKey, JSON.stringify(cart));

    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    logger.error('Error adding product to cart:', error);
    res.status(500).json({ message: 'Error adding product to cart' });
  }
});

app.get('/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cartKey = `cart:${userId}`;

    const cart = JSON.parse(await redisClient.get(cartKey) || '{}');

    res.status(200).json(cart);
  } catch (error) {
    logger.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

app.put('/cart/update', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cartKey = `cart:${userId}`;

    let cart = JSON.parse(await redisClient.get(cartKey) || '{}');

    if (quantity > 0) {
      cart[productId] = quantity;
    } else {
      delete cart[productId];
    }

    await redisClient.set(cartKey, JSON.stringify(cart));

    res.status(200).json({ message: 'Cart updated', cart });
  } catch (error) {
    logger.error('Error updating cart:', error);
    res.status(500).json({ message: 'Error updating cart' });
  }
});

app.delete('/cart/remove', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cartKey = `cart:${userId}`;

    let cart = JSON.parse(await redisClient.get(cartKey) || '{}');

    delete cart[productId];

    await redisClient.set(cartKey, JSON.stringify(cart));

    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    logger.error('Error removing product from cart:', error);
    res.status(500).json({ message: 'Error removing product from cart' });
  }
});

app.delete('/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cartKey = `cart:${userId}`;

    await redisClient.del(cartKey);

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    logger.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
});

// Start server
app.listen(PORT, () => {
  logger.info(`Cart service running on port ${PORT}`);
});