import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 300000,
  withCredentials: false,
  maxContentLength: Infinity,
  maxBodyLength: Infinity
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    console.error('API Error:', {
      url: error.config?.url,
      status,
      message,
      code: error.code
    });
    
    if (status === 401 && !error.config?.url?.includes('/auth/')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(new Error('Unauthorized - Please login again'));
    }

    if (status === 403) {
      return Promise.reject(new Error('Access forbidden'));
    }

    if (status === 404) {
      return Promise.reject(new Error('Resource not found'));
    }

    if (status === 500) {
      return Promise.reject(new Error('Server error - Please try again later'));
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout - Server took too long to respond'));
    }

    if (error.code === 'ERR_NETWORK' || !error.response) {
      return Promise.reject(new Error(`Cannot connect to server at ${API_URL}. Make sure the backend is running and VITE_API_URL is correctly set.`));
    }

    return Promise.reject(new Error(message));
  }
);

export default api;