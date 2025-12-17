import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

// Import components
import AddBook from './components/AddBook';
import BookUpdate from './components/BookUpdate';
import DeleteBook from './components/DeleteBook';
import FncDisplayBooks from './components/FncDisplayBooks';
import BookSearch from './components/BookSearch';
import HealthCheck from './components/HealthCheck';
import BookView from './components/BookView';

// Import API config
import API_CONFIG from './config';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand href="/">
              📚 Online Library
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/add">Add Book</Nav.Link>
                <Nav.Link href="/books">View Books</Nav.Link>
                <Nav.Link href="/search">Search</Nav.Link>
                <Nav.Link href="/health">Health Check</Nav.Link>
              </Nav>
              <Nav>
                <Navbar.Text className="text-light">
                  <small>API: {API_CONFIG.BASE_URL}</small>
                </Navbar.Text>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Main Content */}
        <Container>
          <Routes>
            <Route path="/" element={<Navigate to="/books" replace />} />
            <Route path="/add" element={<AddBook />} />
            <Route path="/books" element={<FncDisplayBooks />} />
            <Route path="/books/edit/:id" element={<BookUpdate />} />
            <Route path="/books/delete/:id" element={<DeleteBook />} />
            <Route path="/search" element={<BookSearch />} />
            <Route path="/health" element={<HealthCheck />} />
            <Route path="/books/view/:id" element={<BookView />} />
            <Route path="*" element={
              <div className="text-center mt-5">
                <h2>404 - Page Not Found</h2>
                <p>The page you are looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </Container>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;