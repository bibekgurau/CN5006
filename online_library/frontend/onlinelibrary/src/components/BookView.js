import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Button, Spinner, Badge, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookService } from '../api';

function BookView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await bookService.getBookById(id);
        setBook(response.data);
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
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFormatBadge = (format) => {
    const formatColors = {
      'Hard Copy': 'primary',
      'Electronic Copy': 'success',
      'Audio Book': 'warning'
    };
    return (
      <Badge bg={formatColors[format] || 'secondary'}>
        {format}
      </Badge>
    );
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

  if (error || !book) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error || 'Book not found'}</p>
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
        <Card.Header as="h4" className="bg-info text-white d-flex justify-content-between align-items-center">
          <span>📖 Book Details</span>
          <div>
            <small className="text-light me-3">ID: {book._id.substring(0, 8)}...</small>
            <Badge bg="light" text="dark">
              {book.createdAt && new Date(book.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
                ? 'New Arrival' 
                : 'Available'}
            </Badge>
          </div>
        </Card.Header>
        
        <Card.Body>
          <Row>
            <Col md={8}>
              <h2 className="mb-3">{book.booktitle}</h2>
              <h5 className="text-muted mb-4">by {book.author}</h5>
              
              <div className="mb-4">
                <h5>Book Information</h5>
                <Row className="mt-3">
                  <Col md={6}>
                    <p><strong>Publication Year:</strong> {book.PubYear}</p>
                    <p><strong>Topic/Category:</strong> <Badge bg="info">{book.Topic}</Badge></p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Format:</strong> {getFormatBadge(book.formate)}</p>
                    <p><strong>Added to Library:</strong> {formatDate(book.createdAt)}</p>
                  </Col>
                </Row>
              </div>

              <Card className="mb-4">
                <Card.Header>Technical Details</Card.Header>
                <Card.Body>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Book ID:</strong> <small>{book._id}</small></p>
                      <p><strong>MongoDB Collection:</strong> books</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Database Status:</strong> <Badge bg="success">Active</Badge></p>
                      <p><strong>Last Updated:</strong> {book.updatedAt ? formatDate(book.updatedAt) : 'N/A'}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="text-center">
                <Card.Header>Quick Actions</Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Link to={`/books/edit/${book._id}`}>
                      <Button variant="warning" className="w-100 mb-2">
                        ✏️ Edit This Book
                      </Button>
                    </Link>
                    
                    <Link to={`/books/delete/${book._id}`}>
                      <Button variant="danger" className="w-100 mb-2">
                        🗑️ Delete This Book
                      </Button>
                    </Link>
                    
                    <Button 
                      variant="outline-secondary" 
                      className="w-100 mb-2"
                      onClick={() => navigate('/books')}
                    >
                      ↩️ Back to All Books
                    </Button>
                    
                    <Button 
                      variant="outline-info" 
                      className="w-100"
                      onClick={() => window.print()}
                    >
                      🖨️ Print Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              <Card className="mt-4">
                <Card.Header>Statistics</Card.Header>
                <Card.Body>
                  <div className="text-center">
                    <h1 className="display-6">{book.PubYear}</h1>
                    <p className="text-muted">Publication Year</p>
                    
                    <hr />
                    
                    <div className="d-flex justify-content-around">
                      <div>
                        <h5>{book.formate === 'Hard Copy' ? '📚' : '💾'}</h5>
                        <small>{book.formate}</small>
                      </div>
                      <div>
                        <h5>{book.Topic === 'Computer Science' ? '💻' : '📖'}</h5>
                        <small>{book.Topic}</small>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
        
        <Card.Footer className="text-muted d-flex justify-content-between">
          <div>
            <small>Book ID: {book._id}</small>
          </div>
          <div>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => navigate('/books')}
            >
              ← Back to Library
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default BookView;