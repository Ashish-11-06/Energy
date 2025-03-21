import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://15.207.188.206:8000/api', // Ensure this base URL is correct
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
