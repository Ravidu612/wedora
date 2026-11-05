import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wedora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized or session expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if checking public routes
      if (!window.location.pathname.startsWith('/invite/') &&
          !window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register')) {
        localStorage.removeItem('wedora_token');
        localStorage.removeItem('wedora_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

