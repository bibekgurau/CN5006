import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookService } from '../api';

function BookUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  const [bookData, setBookData] = useState({
    booktitle: '',
    author: '',
    Topic: 'Computer Science',
    formate: 'Hard Copy',
    PubYear: currentYear
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const topics = [
    'Computer Science', 'Programming', 'Data Science', 'AI', 'Engineering',
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Literature',
    'History', 'Philosophy', 'Other'
  ];

  const formats = ['Hard Copy', 'Electronic Copy', 'Audio Book'];

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await bookService.getBookById(id);
        setBookData({
          booktitle: response.data.booktitle || '',
          author: response.data.author || '',
          Topic: response.data.Topic || 'Computer Science',
          formate: response.data.formate || 'Hard Copy',
          PubYear: response.data.PubYear || currentYear
        });
        setError(null);
      } catch (error) {
        console.error('Error fetching book:', error);
        setError(error.message || 'Failed to load book');
        toast.error('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id, currentYear]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setBookData(prev => ({
      ...prev,
      [name]: type === 'range' ? parseInt(value) : value
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
    } else if (bookData.author.length > 100) {
      newErrors.author = 'Author name cannot exceed 100 characters';
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
    
    setUpdating(true);
    
    try {
      await bookService.updateBook(id, bookData);
      
      toast.success('Book updated successfully!');
      
      // Navigate to books list after 1 second
      setTimeout(() => {
        navigate('/books');
      }, 1000);
      
    } catch (error) {
      console.error('Error updating book:', error);
      
      if (error.data?.details) {
        // Show validation errors from server
        error.data.details.forEach(err => {
          toast.error(err);
        });
      } else if (error.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error(error.message || 'Failed to update book');
      }
      
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate('/books');
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading book details...</span>
        </Spinner>
        <p className="mt-3">Loading book details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Book</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={() => navigate('/books')}>
              Back to Books
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h4" className="bg-warning text-dark">
          ✏️ Edit Book
          <div className="float-end">
            <small className="text-muted">ID: {id}</small>
          </div>
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
                disabled={updating}
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
                disabled={updating}
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
                disabled={updating}
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
                    disabled={updating}
                    id={`update-format-${format}`}
                    className="me-3"
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>
                Publication Year * 
                <span className="ms-2 badge bg-secondary">{bookData.PubYear}</span>
              </Form.Label>
              <div className="d-flex align-items-center">
                <span className="me-2">1000</span>
                <Form.Range
                  name="PubYear"
                  min="1000"
                  max={currentYear}
                  value={bookData.PubYear}
                  onChange={handleChange}
                  disabled={updating}
                  isInvalid={!!errors.PubYear}
                  className="flex-grow-1 mx-2"
                />
                <span className="ms-2">{currentYear}</span>
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.PubYear}
              </Form.Control.Feedback>
            </Form.Group>

            {Object.keys(errors).length > 0 && (
              <Alert variant="danger" className="mt-3">
                <Alert.Heading>Please fix the following errors:</Alert.Heading>
                <ul>
                  {Object.entries(errors).map(([field, message]) => (
                    message && <li key={field}>{message}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                variant="warning"
                type="submit"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Updating Book...
                  </>
                ) : (
                  'Update Book'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BookUpdate;