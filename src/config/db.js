const mongoose = require('mongoose')
const nconf = require('nconf')
const MONGO_URI = nconf.get('MONGO_URI')
const { logger } = require('../utils/logger')

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    logger.info('Connected to MongoDB')
  } catch (error) {
    logger.error('MongoDB connection error', error)
    throw error;
  }
};

module.exports = { connectDB }