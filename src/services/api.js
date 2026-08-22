import axios from 'axios';
import { AUTH_STORAGE_KEY } from '../constants/storage';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
  const token = savedAuth ? JSON.parse(savedAuth).token : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;