import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookService } from '../api';

function BookSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookService.searchBooks(searchQuery);
      setSearchResults(response.data || []);
      setSearchPerformed(true);
      
      if (response.data.length === 0) {
        toast.info('No books found matching your search');
      } else {
        toast.success(`Found ${response.data.length} book(s)`);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message || 'Search failed');
      toast.error('Search failed');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchPerformed(false);
    setError(null);
  };

  const getFormatBadge = (format) => {
    const formatColors = {
      'Hard Copy': 'primary',
      'Electronic Copy': 'success',
      'Audio Book': 'warning'
    };
    return formatColors[format] || 'secondary';
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h4" className="bg-primary text-white">
          🔍 Search Books
        </Card.Header>
        
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Form.Group className="mb-4">
              <Form.Label>
                <h5>Search Criteria</h5>
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  type="text"
                  placeholder="Search by title, author, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                  size="lg"
                />
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={loading || !searchQuery.trim()}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </Button>
                {searchPerformed && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleClear}
                    disabled={loading}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <Form.Text className="text-muted">
                You can search for books by title, author name, or topic/category
              </Form.Text>
            </Form.Group>
          </Form>

          {error && (
            <Alert variant="danger">
              <Alert.Heading>Search Error</Alert.Heading>
              <p>{error}</p>
            </Alert>
          )}

          {searchPerformed && (
            <>
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <h5>
                  Search Results 
                  <Badge bg="info" className="ms-2">
                    {searchResults.length} book(s) found
                  </Badge>
                </h5>
                <small className="text-muted">
                  Showing results for: "{searchQuery}"
                </small>
              </div>

              {searchResults.length === 0 ? (
                <Alert variant="info">
                  <Alert.Heading>No books found</Alert.Heading>
                  <p>
                    No books match your search criteria "{searchQuery}". 
                    Try different keywords or check your spelling.
                  </p>
                  <hr />
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" onClick={handleClear}>
                      Clear Search
                    </Button>
                    <Link to="/books">
                      <Button variant="primary">
                        View All Books
                      </Button>
                    </Link>
                  </div>
                </Alert>
              ) : (
                <Row>
                  {searchResults.map((book) => (
                    <Col md={6} lg={4} key={book._id} className="mb-4">
                      <Card>
                        <Card.Body>
                          <Card.Title>
                            {book.booktitle}
                            {book.createdAt && new Date(book.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                              <Badge bg="success" className="ms-2">New</Badge>
                            )}
                          </Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            by {book.author}
                          </Card.Subtitle>
                          <Card.Text>
                            <Badge bg="info" className="me-2">{book.Topic}</Badge>
                            <Badge bg={getFormatBadge(book.formate)}>{book.formate}</Badge>
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              Published: {book.PubYear}
                            </small>
                            <div className="d-flex gap-2">
                              <Link to={`/books/edit/${book._id}`}>
                                <Button variant="outline-warning" size="sm">
                                  Edit
                                </Button>
                              </Link>
                              <Link to={`/books/view/${book._id}`}>
                                <Button variant="outline-info" size="sm">
                                  View
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}

          {!searchPerformed && (
            <Alert variant="light" className="text-center">
              <h5>Start Searching</h5>
              <p className="mb-0">
                Enter a search term above to find books in the library.
                You can search by book title, author name, or topic.
              </p>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BookSearch;