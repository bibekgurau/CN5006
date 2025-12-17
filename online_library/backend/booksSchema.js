const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  booktitle: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Book title cannot exceed 200 characters']
  },
  PubYear: {
    type: Number,
    required: [true, 'Publication year is required'],
    min: [1000, 'Publication year must be after 1000'],
    max: [new Date().getFullYear(), `Publication year cannot be in the future`]
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  Topic: {
    type: String,
    required: [true, 'Topic is required'],
    enum: [
      'Computer Science',
      'Programming',
      'Data Science',
      'AI',
      'Engineering',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'Literature',
      'History',
      'Philosophy',
      'Other'
    ],
    default: 'Computer Science'
  },
  formate: {
    type: String,
    required: [true, 'Format is required'],
    enum: ['Hard Copy', 'Electronic Copy', 'Audio Book'],
    default: 'Hard Copy'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
BookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better performance
BookSchema.index({ booktitle: 1 });
BookSchema.index({ author: 1 });
BookSchema.index({ Topic: 1 });

module.exports = mongoose.model('Book', BookSchema, 'books');