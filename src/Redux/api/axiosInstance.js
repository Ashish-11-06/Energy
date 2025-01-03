import axios from 'axios';

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Your backend base URL
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Optional: Add timeout to handle slow requests
});
export default axiosInstance;
