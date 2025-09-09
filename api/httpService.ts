// src/api/httpService.ts
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { Buffer } from 'buffer'; // Needed in React Native for base64 encoding

const { API_BASE_URL, KEY, SECRET } = Constants.expoConfig?.extra || {};

if (!API_BASE_URL || !KEY || !SECRET) {
  throw new Error('WooCommerce API configuration missing in Expo Constants extra');
}

console.log('🔗 WooCommerce API Base:', API_BASE_URL);

// Encode key + secret for Basic Auth
const basicAuth = Buffer.from(`${KEY}:${SECRET}`).toString('base64');

// Axios instance
const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 50000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Basic ${basicAuth}`,
  },
});

// Request interceptor (optional logging)
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('➡️ HTTP Request:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('❌ HTTP Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor (optional logging)
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('⬅️ HTTP Response:', {
      url: response.config.url,
      status: response.status,
      dataPreview: JSON.stringify(response.data)?.slice(0, 120) + '...',
    });
    return response;
  },
  (error) => {
    console.error('❌ HTTP Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Helper to return only data
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

// Reusable HTTP methods
const requests = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.get<T>(url, config).then(responseBody),
  post: <T>(url: string, body?: any, config?: AxiosRequestConfig) =>
    instance.post<T>(url, body, config).then(responseBody),
  put: <T>(url: string, body?: any, config?: AxiosRequestConfig) =>
    instance.put<T>(url, body, config).then(responseBody),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<T>(url, config).then(responseBody),
};

export default requests;
