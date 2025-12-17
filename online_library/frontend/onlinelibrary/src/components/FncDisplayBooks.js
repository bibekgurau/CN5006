import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Card, Spinner, Alert, Pagination, Form, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookService } from '../api';

function FncDisplayBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBooks = async (page = 1, search = '') => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (search.trim()) {
        response = await bookService.searchBooks(search);
        setBooks(response.data || []);
        setPagination(prev => ({ ...prev, page: 1, total: response.count || 0 }));
      } else {
        response = await bookService.getAllBooks(page, pagination.limit);
        setBooks(response.data || []);
        setPagination({
          page: page,
          limit: pagination.limit,
          total: response.count || 0,
          pages: Math.ceil((response.count || 0) / pagination.limit)
        });
      }
      
    } catch (error) {
      console.error('Error fetching books:', error);
      setError(error.message || 'Failed to fetch books');
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await bookService.deleteBook(id);
        toast.success('Book deleted successfully!');
        fetchBooks(pagination.page, searchQuery);
      } catch (error) {
        console.error('Error deleting book:', error);
        toast.error(error.message || 'Failed to delete book');
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      fetchBooks(newPage, searchQuery);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(1, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchBooks(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getFormatBadge = (format) => {
    const formatColors = {
      'Hard Copy': 'primary',
      'Electronic Copy': 'success',
      'Audio Book': 'warning'
    };
    return formatColors[format] || 'secondary';
  };

  if (loading && books.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading books...</span>
        </Spinner>
        <p className="mt-3">Loading books...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h4" className="bg-info text-white d-flex justify-content-between align-items-center">
          <span>📚 Book Library</span>
          <Link to="/add">
            <Button variant="light" size="sm">
              + Add New Book
            </Button>
          </Link>
        </Card.Header>
        
        <Card.Body>
          {/* Search Bar */}
          <Form onSubmit={handleSearch} className="mb-4">
            <div className="input-group">
              <Form.Control
                type="text"
                placeholder="Search by title, author, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="primary" type="submit">
                Search
              </Button>
              {searchQuery && (
                <Button variant="outline-secondary" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
            </div>
          </Form>

          {error && (
            <Alert variant="danger">
              Error: {error}
            </Alert>
          )}

          {books.length === 0 ? (
            <Alert variant="info" className="text-center">
              No books found. {searchQuery && 'Try a different search term.'}
              <div className="mt-2">
                <Link to="/add">
                  <Button variant="primary" size="sm">
                    Add Your First Book
                  </Button>
                </Link>
              </div>
            </Alert>
          ) : (
            <>
              {/* Books Table */}
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Topic</th>
                      <th>Format</th>
                      <th>Year</th>
                      <th>Added On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book, index) => (
                      <tr key={book._id}>
                        <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                        <td>
                          <strong>{book.booktitle}</strong>
                          {book.createdAt && new Date(book.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                            <Badge bg="success" className="ms-2">New</Badge>
                          )}
                        </td>
                        <td>{book.author}</td>
                        <td>
                          <Badge bg="info">{book.Topic}</Badge>
                        </td>
                        <td>
                          <Badge bg={getFormatBadge(book.formate)}>
                            {book.formate}
                          </Badge>
                        </td>
                        <td>{book.PubYear}</td>
                        <td>{formatDate(book.createdAt)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link to={`/books/edit/${book._id}`}>
                              <Button variant="warning" size="sm">
                                Edit
                              </Button>
                            </Link>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleDelete(book._id, book.booktitle)}
                            >
                              Delete
                            </Button>
                            <Link to={`/books/view/${book._id}`}>
                              <Button variant="info" size="sm">
                                View
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First 
                      onClick={() => handlePageChange(1)} 
                      disabled={pagination.page === 1}
                    />
                    <Pagination.Prev 
                      onClick={() => handlePageChange(pagination.page - 1)} 
                      disabled={pagination.page === 1}
                    />
                    
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <Pagination.Item 
                          key={pageNum}
                          active={pageNum === pagination.page}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Pagination.Item>
                      );
                    })}
                    
                    <Pagination.Next 
                      onClick={() => handlePageChange(pagination.page + 1)} 
                      disabled={pagination.page === pagination.pages}
                    />
                    <Pagination.Last 
                      onClick={() => handlePageChange(pagination.pages)} 
                      disabled={pagination.page === pagination.pages}
                    />
                  </Pagination>
                </div>
              )}

              {/* Summary */}
              <div className="mt-3 text-muted text-center">
                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} books
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default FncDisplayBooks;