// src/api/axiosInstance.js
import axios from 'axios';

const Axios = axios.create({
  baseURL: 'http://localhost:3000/v1/api/admin', // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add an interceptor to include the JWT token in request headers
Axios.interceptors.request.use(
  (config) => {
    const userData = JSON.parse(localStorage.getItem('superAuthToken')); // Replace with your token storage method
    if (userData?.token) {
      config.headers.authkey = userData?.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Axios;
