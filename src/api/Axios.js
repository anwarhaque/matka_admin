// src/api/axiosInstance.js
import axios from 'axios';
import Notifier from '../components/Notifier';

const Axios = axios.create({
  // baseURL: 'http://localhost:3000/v1/api', // local
  baseURL: 'https://gopalmatka.com/v1/api', // production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
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

// Response Interceptor
Axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    // Check if error response exists and has a status code
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized error (e.g., redirect to login or refresh token)
        // You can clear token and redirect to login
        localStorage.removeItem('superAuthToken');
        window.location.href = '/login'; // Redirect to login page
      }
      // Handle other error statuses like 403, 404, 500, etc.
    }else{
      Notifier(error.message, 'Error')
    }
    
    return Promise.reject(error?.response?.data);
  }
);

export default Axios;
