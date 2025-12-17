require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.rocz1jr.mongodb.net/library';

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins for now
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Atlas connected successfully!');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.log('🔄 Retrying connection...');
});

// Define Book Schema
const bookSchema = new mongoose.Schema({
  booktitle: {
    type: String,
    required: true,
    trim: true
  },
  PubYear: {
    type: Number,
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  Topic: {
    type: String,
    default: 'Computer Science'
  },
  formate: {
    type: String,
    default: 'Hard Copy'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Book = mongoose.model('Book', bookSchema, 'books');

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Online Library API',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '📚 Welcome to Online Library API',
    endpoints: {
      health: 'GET /health',
      books: 'GET /api/books',
      addBook: 'POST /api/books',
      updateBook: 'PUT /api/books/:id',
      deleteBook: 'DELETE /api/books/:id',
      search: 'GET /api/books/search/:query'
    }
  });
});

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching books'
    });
  }
});

// Get single book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    res.json({
      success: true,
      data: book
    });
  } catch (err) {
    console.error('Error fetching book:', err);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching book'
    });
  }
});

// Add a new book
app.post('/api/books', async (req, res) => {
  try {
    const { booktitle, author, PubYear, Topic, formate } = req.body;
    
    // Validation
    if (!booktitle || !author || !PubYear) {
      return res.status(400).json({
        success: false,
        error: 'Book title, author, and publication year are required'
      });
    }
    
    const book = new Book({
      booktitle,
      author,
      PubYear: parseInt(PubYear),
      Topic: Topic || 'Computer Science',
      formate: formate || 'Hard Copy'
    });
    
    await book.save();
    
    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: book
    });
  } catch (err) {
    console.error('Error adding book:', err);
    res.status(500).json({
      success: false,
      error: 'Server error while adding book'
    });
  }
});

// Update a book
app.put('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).json({
      success: false,
      error: 'Server error while updating book'
    });
  }
});

// Delete a book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting book'
    });
  }
});

// Search books
app.get('/api/books/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const books = await Book.find({
      $or: [
        { booktitle: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { Topic: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (err) {
    console.error('Error searching books:', err);
    res.status(500).json({
      success: false,
      error: 'Server error while searching books'
    });
  }
});

// 404 handler - FIXED SYNTAX
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET    /',
      'GET    /health',
      'GET    /api/books',
      'GET    /api/books/:id',
      'POST   /api/books',
      'PUT    /api/books/:id',
      'DELETE /api/books/:id',
      'GET    /api/books/search/:query'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 Server Information:
├─ Environment: ${process.env.NODE_ENV || 'development'}
├─ Server URL: http://localhost:${PORT}
├─ Health Check: http://localhost:${PORT}/health
├─ GitHub Codespaces URL: https://miniature-chainsaw-x5xj4vrx4j9phv7x7-${PORT}.app.github.dev
  `);
  
  console.log('\n📚 Available Endpoints:');
  console.log('├─ GET    /                 - Welcome page');
  console.log('├─ GET    /health           - Health check');
  console.log('├─ GET    /api/books        - Get all books');
  console.log('├─ GET    /api/books/:id    - Get single book');
  console.log('├─ POST   /api/books        - Add new book');
  console.log('├─ PUT    /api/books/:id    - Update book');
  console.log('├─ DELETE /api/books/:id    - Delete book');
  console.log('└─ GET    /api/books/search/:query - Search books');
});