import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { clientCookies } from './cookies';
import { refreshToken } from '@/services/authService';

// Track refresh promise để tránh multiple refresh calls cùng lúc
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

// Queue để store các failed requests trong lúc refreshing
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Request interceptor - tự động thêm access token vào header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = clientCookies.getAuthTokens();
    
    if (tokens?.access_token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${tokens.access_token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu không phải lỗi 401 hoặc đã retry rồi, return error
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // Nếu đang refresh, queue request này
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      }).catch((err) => {
        return Promise.reject(err);
      });
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    // Nếu chưa refresh, bắt đầu refresh process
    if (!refreshPromise) {
      const tokens = clientCookies.getAuthTokens();
      
      if (!tokens?.refresh_token) {
        processQueue(new Error('No refresh token available'), null);
        isRefreshing = false;
        
        // Redirect to login nếu không có refresh token
        if (typeof window !== 'undefined') {
          clientCookies.clearAuthTokens();
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
      
      refreshPromise = refreshToken(tokens.refresh_token);
    }
    
    try {
      const response = await refreshPromise;
      const newTokens = {
        access_token: response.access_token,
        refresh_token: response.refresh_token
      };
      
      // Lưu token mới
      clientCookies.setAuthTokens(newTokens);
      
      // Process queue với token mới
      processQueue(null, newTokens.access_token);
      
      // Retry original request với token mới
      originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
      return apiClient(originalRequest);
      
    } catch (refreshError) {
      // Refresh token cũng fail
      processQueue(refreshError, null);
      
      // Clear tokens và redirect to login
      if (typeof window !== 'undefined') {
        clientCookies.clearAuthTokens();
        window.location.href = '/login';
      }
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  }
);

export default apiClient; 