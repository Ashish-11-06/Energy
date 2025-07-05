import axios from 'axios';

// Default base URL from .env
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_P_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dynamically switch baseURL based on request path
axiosInstance.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    const ALT_BASE = import.meta.env.VITE_ALT_BASE_URL;
    const DEFAULT_BASE = import.meta.env.VITE_POWERX_BASE_URL;

    if (
      url.includes('/energy/consumer-requirements/') ||
      url.includes('/energy/generation-portfolio/')
    ) {
      config.baseURL = ALT_BASE;
    } else {
      config.baseURL = DEFAULT_BASE;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
