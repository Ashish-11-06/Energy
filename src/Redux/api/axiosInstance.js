import axios from 'axios';

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.53:8000/api', // Your backend base URL
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Optional: Add timeout to handle slow requests
});
export default axiosInstance;