import { getData, removeData } from '@/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({});

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    // Get token from secure storage
    const token = await getData("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      await removeData("token");
      // You'll need to implement navigation to login screen here
    }
    return Promise.reject(error);
  }
);

export default api; 