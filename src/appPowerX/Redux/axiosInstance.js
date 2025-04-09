// import axios from 'axios';

// const axiosInstance = axios.create({
//     baseURL: 'http://172.31.16.56 /api/powerx', 
//     // baseURL: 'http://localhost:5000/',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// export default axiosInstance;


import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://172.31.16.56:8000/api/powerx", // Default Base URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to dynamically change baseURL
axiosInstance.interceptors.request.use((config) => {
    if (config.url.includes("/energy/consumer-requirements/")) {
        config.baseURL = "http://172.31.16.56:8000/api"; // Use base URL for specific API
    } else if (config.url.includes("/energy/generation-portfolio/")) {
        config.baseURL = "http://172.31.16.56:8000/api"; // Use base URL for generation portfolio
    } else {
        config.baseURL = "http://172.31.16.56:8000/api/powerx"; // Default for other requests
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
