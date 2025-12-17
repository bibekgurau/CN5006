import axios from 'axios';
import API_CONFIG from './config';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS,
  timeout: 10000 // 10 seconds timeout
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // You can add authentication token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'Network error';
    
    // Log error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: errorMessage
    });
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// Book API service
export const bookService = {
  // Get all books with pagination
  getAllBooks: (page = 1, limit = 10) => 
    api.get(API_CONFIG.ENDPOINTS.BOOKS, { params: { page, limit } }),
  
  // Get single book by ID
  getBookById: (id) => 
    api.get(API_CONFIG.ENDPOINTS.BOOK_BY_ID(id)),
  
  // Create new book
  createBook: (bookData) => 
    api.post(API_CONFIG.ENDPOINTS.BOOKS, bookData),
  
  // Update book
  updateBook: (id, bookData) => 
    api.put(API_CONFIG.ENDPOINTS.BOOK_BY_ID(id), bookData),
  
  // Delete book
  deleteBook: (id) => 
    api.delete(API_CONFIG.ENDPOINTS.BOOK_BY_ID(id)),
  
  // Search books
  searchBooks: (query) => 
    api.get(API_CONFIG.ENDPOINTS.SEARCH_BOOKS(query))
};

export default api;