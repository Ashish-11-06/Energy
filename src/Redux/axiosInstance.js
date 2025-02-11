import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.36:8001/api', // Ensure this base URL is correct
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
