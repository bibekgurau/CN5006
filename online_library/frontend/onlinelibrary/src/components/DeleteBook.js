import React, { useEffect, useState } from 'react';
import { Container, Card, Alert, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookService } from '../api';

function DeleteBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [book, setBook] = useState(null);
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

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${book?.booktitle}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    
    try {
      await bookService.deleteBook(id);
      toast.success('Book deleted successfully!');
      
      // Navigate to books list after 1 second
      setTimeout(() => {
        navigate('/books');
      }, 1000);
      
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error(error.message || 'Failed to delete book');
      setDeleting(false);
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
      <Card border="danger">
        <Card.Header as="h4" className="bg-danger text-white">
          🗑️ Delete Book
        </Card.Header>
        <Card.Body>
          <Alert variant="danger">
            <Alert.Heading>⚠️ Warning: This action is permanent!</Alert.Heading>
            <p>
              You are about to delete the book "<strong>{book.booktitle}</strong>". 
              This action cannot be undone. Please confirm that you want to proceed.
            </p>
          </Alert>

          <Card className="mb-4">
            <Card.Header>Book Details</Card.Header>
            <Card.Body>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Title:</strong> {book.booktitle}</p>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Publication Year:</strong> {book.PubYear}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Topic:</strong> {book.Topic}</p>
                  <p><strong>Format:</strong> {book.formate}</p>
                  <p><strong>Created:</strong> {new Date(book.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={deleting}
            >
              Cancel
            </Button>
            
            <div>
              <Link to={`/books/edit/${id}`} className="me-3">
                <Button variant="warning" disabled={deleting}>
                  Edit Instead
                </Button>
              </Link>
              
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Deleting...
                  </>
                ) : (
                  'Delete Permanently'
                )}
              </Button>
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="text-muted">
          Note: Once deleted, this book cannot be recovered.
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default DeleteBook;