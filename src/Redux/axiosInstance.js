/* eslint-disable no-unused-vars */
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ext.exgglobal.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = userData?.token;

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log(`Token added to headers: ${token}`);
      } else {
        console.log('No token found in localStorage');
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
