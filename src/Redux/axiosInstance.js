/* eslint-disable no-unused-vars */
import axios from 'axios';
import { decryptData } from '../Utils/cryptoHelper';

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
      // 🔐 Decrypt and parse the user from localStorage
      const storedUser = decryptData(localStorage.getItem('user'));
      // console.log('Decrypted user from axios instance:', storedUser);

      // ✅ Get the token directly (no need for JSON.parse)
      const token = storedUser?.token;

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.warn('Authorization token not found in decrypted user.');
      }
    } catch (err) {
      console.error('Failed to attach token from localStorage:', err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export default axiosInstance;
