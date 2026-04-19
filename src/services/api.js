import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * INTERCEPTOR: Automatically attaches the JWT token to every request.
 * This is crucial for moving from OTP -> Landing Page smoothly.
 */
apiClient.interceptors.request.use((config) => {
  // Using 'token' as per your existing storage key
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * AUTH API: Your existing authentication and OTP logic
 */
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

/**
 * KYC API: New logic for your 3-step verification landing page
 */
export const kycAPI = {
  // Step 1: Submit PAN details
  submitPan: (panData) => apiClient.post('/kyc/step-1', panData),
  
  // Step 2: Submit Aadhaar details
  submitAadhaar: (aadhaarData) => apiClient.post('/kyc/step-2', aadhaarData),
  
  // Step 3: Complete Video KYC / Final Submit
  completeKyc: (finalData) => apiClient.post('/kyc/step-3', finalData),
  
  // Fetch current status to see where the user left off
  getKycStatus: () => apiClient.get('/kyc/status'),
};

export default apiClient;