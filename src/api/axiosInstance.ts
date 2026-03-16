import axios from 'axios';
import { Modal } from 'antd';
import { authService } from '../services/authService';


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // Skip refresh for auth endpoints to avoid infinite loops or unnecessary calls
    const isAuthRequest = config.url?.includes('/auth/login') || 
                         config.url?.includes('/auth/logout') || 
                         config.url?.includes('/auth/refresh');

    if (!isAuthRequest) {
      // Refresh token before every request to keep session alive
      await authService.refresh();
    }

    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const errorMessage = error.response.data?.message || 'Session expired. Please login again.';

      Modal.info({
        title: 'Authentication Error',
        content: errorMessage,
        okText: 'Go to Login',
        onOk: () => {
          authService.logout();
        },
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
