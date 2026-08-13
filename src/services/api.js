import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smarttyre-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach bearer token if stored in localStorage for admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smart_tire_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const vehicleApi = {
  lookup: async (payload) => {
    const response = await api.post('/vehicle/lookup', payload);
    return response.data;
  },
  getMakesModels: async () => {
    const response = await api.get('/vehicle/makes-models');
    return response.data;
  }
};

export const tiresApi = {
  getRecommendations: async (size, terrain) => {
    const response = await api.post('/tires/recommendations', { size, terrain });
    return response.data;
  },
  getSizes: async () => {
    const response = await api.get('/tires/sizes');
    return response.data;
  }
};

export const adminApi = {
  login: async (pin) => {
    const response = await api.post('/admin/login', { pin });
    return response.data;
  },
  getInventory: async () => {
    const response = await api.get('/admin/tires');
    return response.data;
  },
  updateTire: async (id, data) => {
    const response = await api.patch(`/admin/tires/${id}`, data);
    return response.data;
  },
  addTire: async (data) => {
    const response = await api.post('/admin/tires', data);
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  }
};

export default api;
