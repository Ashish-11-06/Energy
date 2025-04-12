import axios from 'axios';

// Get token from localStorage if available
let token;
try {
  const userData = JSON.parse(localStorage.getItem('user'));
  
  token = userData?.token;
    // token = `akjdlfjalkjdfljalj`; // Use access_token instead of token
  console.log(`user token ${token}`);
} catch (error) {
  token = null;
}

// Create headers object conditionally
const headers = {
  'Content-Type': 'application/json',
};

if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}

console.log(`headers ${headers}`);
const axiosInstance = axios.create({
  baseURL: 'http://52.66.186.241:8000/api',
  headers,
});

export default axiosInstance;
