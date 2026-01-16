import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 240000,
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    if (status === 401) {
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

    if (!error.response) {
      return Promise.reject(new Error('Network error - Please check your connection'));
    }

    return Promise.reject(error);
  }
);

export default api;