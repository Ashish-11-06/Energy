/* eslint-disable no-unused-vars */
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token from localStorage to each request
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const storedUser = localStorage.getItem('user');
      const userData = storedUser ? JSON.parse(storedUser) : null;
      const token = userData?.token;

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.warn('Authorization token not found in localStorage.');
      }
    } catch (err) {
      console.error('Failed to retrieve token from localStorage:', err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
