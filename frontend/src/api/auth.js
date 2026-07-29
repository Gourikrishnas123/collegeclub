import api from './axiosInstance';

export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logoutApi = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } finally {
    localStorage.removeItem('token');
  }
};
