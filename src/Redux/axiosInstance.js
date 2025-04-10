import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://52.66.186.241:8000/api', // Ensure this base URL is correct
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
