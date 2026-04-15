import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  sendOtp: (email) => apiClient.post('/auth/send-otp', { email }),
  verifyOtp: (email, otp) =>
    apiClient.post('/auth/verify-otp', { email, otp }),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (email, otp, password) =>
    apiClient.post('/auth/reset-password', { email, otp, password }),
  getCurrentUser: () => apiClient.get('/auth/me'),
};


export default apiClient;
