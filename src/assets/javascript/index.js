import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
  baseURL: 'https://skcomponany.zeabur.app',
});

// request interceptor：自動帶 token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
