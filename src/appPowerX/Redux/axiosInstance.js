import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'http://127.0.0.1:8000/api/powerx', // Ensure this base URL is correct
    baseURL: 'http://localhost:5000/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
