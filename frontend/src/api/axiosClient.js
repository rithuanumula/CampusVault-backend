import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cv_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified response handling
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      data: error.response?.data,
    };

    if (error.response?.status === 401) {
      // Clear token if expired and not on login page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/verify')) {
        localStorage.removeItem('cv_token');
        localStorage.removeItem('cv_user');
      }
    }

    return Promise.reject(customError);
  }
);

export default axiosClient;
