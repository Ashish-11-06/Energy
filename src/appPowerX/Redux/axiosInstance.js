import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000', // Ensure this base URL is correct
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
