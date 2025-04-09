import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://172.31.16.56:8000/api', // Ensure this base URL is correct
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
