import axios from 'axios';

export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'https://collegeclub-oo4q.onrender.com/api';
  }
  return 'http://localhost:3001/api';
};

export const getBackendHost = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'https://collegeclub-oo4q.onrender.com';
  }
  return 'http://localhost:3001';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true
});

// Request interceptor: attach token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: clear token on 401 without hard window.location reloads
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
