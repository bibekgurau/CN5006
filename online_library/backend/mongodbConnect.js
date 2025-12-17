const mongoose = require('mongoose');
require('dotenv').config();

class Database {
  constructor() {
    this.connection = null;
    this.connect();
  }

  async connect() {
    try {
      const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.rocz1jr.mongodb.net/library';
      
      // Connection options
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10
      };

      console.log('🔗 Attempting to connect to MongoDB Atlas...');
      console.log(`📊 Database: library`);
      
      this.connection = await mongoose.connect(MONGODB_URI, options);
      
      console.log('✅ MongoDB Atlas connected successfully!');
      console.log(`🏢 Host: ${mongoose.connection.host}`);
      console.log(`📁 Database: ${mongoose.connection.name}`);
      
      this.setupEventListeners();
      
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      console.log('🔄 Retrying connection in 5 seconds...');
      setTimeout(() => this.connect(), 5000);
    }
  }

  setupEventListeners() {
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected from DB');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('👋 Mongoose connection closed due to app termination');
      process.exit(0);
    });
  }

  getConnection() {
    return this.connection;
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      console.log('🔌 MongoDB disconnected');
    }
  }
}

// Create singleton instance
const database = new Database();
module.exports = database;