// product-service/seedProducts.js

const mongoose = require('mongoose');
const ProductSchema = require('./models/Product'); // We'll create this file next
require('dotenv').config();

const Product = mongoose.model('Product', ProductSchema);

const products = [
  {
    name: "Smartphone X",
    description: "Latest model with advanced features, amoled display and 5G capability",
    price: 799.99,
    imageUrl: "https://placehold.co/100x100",
    category: "Electronics",
    stock: 50
  },
  {
    name: "Laptop Pro",
    description: "High-performance laptop for professionals, video editors and gamers",
    price: 1299.99,
    imageUrl: "https://placehold.co/100x100",
    category: "Electronics",
    stock: 30
  },
  {
    name: "Wireless Earbuds",
    description: "Crystal clear audio with long battery life and noise cancellation",
    price: 149.99,
    imageUrl: "https://placehold.co/100x100",
    category: "Electronics",
    stock: 100
  },
  {
    name: "Smart Watch",
    description: "Track your fitness and stay connected with this sleek smartwatch",
    price: 249.99,
    imageUrl: "https://placehold.co/100x100",
    category: "Electronics",
    stock: 75
  },
  {
    name: "4K TV",
    description: "Immersive viewing experience with vibrant colors and smart features",
    price: 799.99,
    imageUrl: "https://placehold.co/100x100",
    category: "Electronics",
    stock: 25
  },
  {
    name: "Coffee Maker Deluxe",
    description: "Start your day right with this programmable, feature-rich coffee maker",
    price: 89.99,
    imageUrl: "https://placehold.co/100x100",
    category: "Home Appliances",
    stock: 40
  },
  {
    name: "Ergonomic Office Chair",
    description: "Comfortable and adjustable chair perfect for long work hours",
    price: 199.99,
    imageUrl: "https://placehold.co/100x100",
    category: "Furniture",
    stock: 35
  },
  {
    name: "Fitness Tracker Band",
    description: "Monitor your health and activity with this water-resistant fitness band",
    price: 59.99,
    imageUrl: "https://placehold.co/100x100",
    category: "Fitness",
    stock: 150
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