// product-service/seedProducts.js

const mongoose = require('mongoose');
const ProductSchema = require('./models/Product'); // We'll create this file next
require('dotenv').config();

const Product = mongoose.model('Product', ProductSchema);

const products = [
  {
    name: "Smartphone X",
    description: "Latest model with advanced features",
    price: 799.99,
    imageUrl: "https://placehold.co/200x200"
  },
  {
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    price: 1299.99,
    imageUrl: "https://placehold.co/200x200"
  },
  {
    name: "Wireless Earbuds",
    description: "Crystal clear audio with long battery life",
    price: 149.99,
    imageUrl: "https://placehold.co/200x200"
  },
  {
    name: "Smart Watch",
    description: "Track your fitness and stay connected",
    price: 249.99,
    imageUrl: "https://placehold.co/200x200"
  },
  {
    name: "4K TV",
    description: "Immersive viewing experience with vibrant colors",
    price: 799.99,
    imageUrl: "https://placehold.co/200x200"
  }
];

async function seedProducts() {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log('Products already seeded. Skipping seeding process.');
      return;
    }

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error; // Propagate the error
  }
}

module.exports = seedProducts;