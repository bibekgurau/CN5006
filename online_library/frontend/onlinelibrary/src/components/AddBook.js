import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookService } from '../api';

function AddBook() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  const [bookData, setBookData] = useState({
    booktitle: '',
    author: '',
    Topic: 'Computer Science',
    formate: 'Hard Copy',
    PubYear: currentYear
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const topics = [
    'Computer Science', 'Programming', 'Data Science', 'AI', 'Engineering',
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Literature',
    'History', 'Philosophy', 'Other'
  ];

  const formats = ['Hard Copy', 'Electronic Copy', 'Audio Book'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setBookData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!bookData.booktitle.trim()) {
      newErrors.booktitle = 'Book title is required';
    } else if (bookData.booktitle.length > 200) {
      newErrors.booktitle = 'Book title cannot exceed 200 characters';
    }
    
    if (!bookData.author.trim()) {
      newErrors.author = 'Author name is required';
    }
    
    if (!bookData.PubYear) {
      newErrors.PubYear = 'Publication year is required';
    } else if (bookData.PubYear < 1000 || bookData.PubYear > currentYear) {
      newErrors.PubYear = `Publication year must be between 1000 and ${currentYear}`;
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await bookService.createBook(bookData);
      
      toast.success('Book added successfully!');
      
      // Reset form
      setBookData({
        booktitle: '',
        author: '',
        Topic: 'Computer Science',
        formate: 'Hard Copy',
        PubYear: currentYear
      });
      
      // Navigate to books list after 1 second
      setTimeout(() => {
        navigate('/books');
      }, 1000);
      
    } catch (error) {
      console.error('Error adding book:', error);
      
      if (error.data?.details) {
        // Show validation errors from server
        error.data.details.forEach(err => {
          toast.error(err);
        });
      } else {
        toast.error(error.message || 'Failed to add book');
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h4" className="bg-primary text-white">
          📖 Add New Book
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Book Title *</Form.Label>
              <Form.Control
                type="text"
                name="booktitle"
                value={bookData.booktitle}
                onChange={handleChange}
                placeholder="Enter book title"
                isInvalid={!!errors.booktitle}
                disabled={loading}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.booktitle}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author *</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={bookData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                isInvalid={!!errors.author}
                disabled={loading}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.author}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Topic</Form.Label>
              <Form.Select
                name="Topic"
                value={bookData.Topic}
                onChange={handleChange}
                disabled={loading}
              >
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Format</Form.Label>
              <div>
                {formats.map(format => (
                  <Form.Check
                    key={format}
                    inline
                    type="radio"
                    label={format}
                    name="formate"
                    value={format}
                    checked={bookData.formate === format}
                    onChange={handleChange}
                    disabled={loading}
                    id={`format-${format}`}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Publication Year * ({bookData.PubYear})
              </Form.Label>
              <Form.Range
                name="PubYear"
                min="1000"
                max={currentYear}
                value={bookData.PubYear}
                onChange={handleChange}
                disabled={loading}
                isInvalid={!!errors.PubYear}
              />
              <Form.Control.Feedback type="invalid">
                {errors.PubYear}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Drag to select publication year between 1000 and {currentYear}
              </Form.Text>
            </Form.Group>

            {Object.keys(errors).length > 0 && (
              <Alert variant="danger" className="mt-3">
                Please fix the errors above before submitting.
              </Alert>
            )}

            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                onClick={() => navigate('/books')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Adding Book...' : 'Add Book'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddBook;