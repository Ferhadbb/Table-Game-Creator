const express = require('express');
const cors = require('cors');
const Redis = require('ioredis');
const sequelize = require('./config/sequelize');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Redis client setup
const redis = new Redis(process.env.REDIS_URL);

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await redis.ping();
    console.log('Redis connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or Redis:', error);
  }
}

testConnection();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/games', require('./routes/games'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 