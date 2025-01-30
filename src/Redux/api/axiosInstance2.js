import axios from 'axios';

// Create Axios instance
const axiosInstance2 = axios.create({
    baseURL: 'http://192.168.1.47:8001/api', // Your backend base URL
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 100000, // Optional: Add timeout to handle slow requests
});
export default axiosInstance2;
