// API Configuration
const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: process.env.REACT_APP_API_URL || 'https://miniature-chainsaw-x5xj4vrx4j9phv7x7-5000.app.github.dev',
  
  // GitHub Codespaces URL
  GITHUB_URL: process.env.REACT_APP_GITHUB_URL || 'https://miniature-chainsaw-x5xj4vrx4j9phv7x7-3000.app.github.dev',
  
  // API Endpoints
  ENDPOINTS: {
    BOOKS: '/books',
    BOOK_BY_ID: (id) => `/books/${id}`,
    SEARCH_BOOKS: (query) => `/books/search/${query}`
  },
  
  // Default headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Export configuration
export default API_CONFIG;