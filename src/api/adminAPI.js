import axios from 'axios';
import { mockUserStats, mockVehicleStats, mockUserRequests, mockVehicleRequests } from './mockData';

const BASE_URL = 'https://vehicle.kietpep1303.com/api';

const USE_MOCK_API = false;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to include accessToken
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        const response = await axios.post(`${BASE_URL}/auth/renew-access-token`, { refreshToken });
        const accessToken = response.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(new Error('Session expired. Please sign in again.'));
      }
    }
    return Promise.reject(error);
  }
);

// Admin API functions
export const adminAPI = {
  // Login function for admin authentication
  login: (email, password) => apiClient.post('/auth/login', { email, password }),

  getUsersStatistics: async () => {
    // COMMENT: When USE_MOCK_API is true, we return dummy data after a short delay.
    if (USE_MOCK_API) {
      await new Promise(res => setTimeout(res, 500));
      return { data: { data: mockUserStats } };
    }
    // COMMENT: When USE_MOCK_API is false, this makes a real API call.
    return apiClient.get('/admin/users-statistics');
  },

  getVehiclesStatistics: async () => {
    if (USE_MOCK_API) {
      await new Promise(res => setTimeout(res, 500));
      return { data: { data: mockVehicleStats } };
    }
    return apiClient.get('/admin/vehicles-statistics');
  },

  getRequestedUserLevel2: async ({ page = 1, limit = 5 }) => {
    if (USE_MOCK_API) {
      await new Promise(res => setTimeout(res, 500));
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedUsers = mockUserRequests.slice(start, end);
      return { data: { data: { users: paginatedUsers, totalPages: Math.ceil(mockUserRequests.length / limit), currentPage: page } } };
    }
    return apiClient.get('/admin/get-requested-user-level2', { params: { page, limit } });
  },

  getRequestedVehicles: async ({ page = 1, limit = 5 }) => {
    if (USE_MOCK_API) {
      await new Promise(res => setTimeout(res, 500));
       const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedVehicles = mockVehicleRequests.slice(start, end);
      return { data: { data: { vehicles: paginatedVehicles, totalPages: Math.ceil(mockVehicleRequests.length / limit), currentPage: page } } };
    }
    return apiClient.get('/admin/get-requested-vehicles', { params: { page, limit } });
  },

  getDetailsVehicle: (vehicleId) => {
    return apiClient.get('/admin/get-details-vehicle', { params: { vehicleId } });
  },

  decisionUserLevel2: async (data) => {
    if (USE_MOCK_API) {
      console.log("Mocking user decision:", data);
      await new Promise(res => setTimeout(res, 500));
      // In mock mode, we don't actually change the data source, just simulate success.
      return { data: { status: 200, message: "Mock decision made successfully." } };
    }
    return apiClient.post('/admin/decision-requested-user-level2', data);
  },

  decisionVehicle: async (data) => {
    if (USE_MOCK_API) {
      console.log("Mocking vehicle decision:", data);
      await new Promise(res => setTimeout(res, 500));
      return { data: { status: 200, message: "Mock decision made successfully." } };
    }
    return apiClient.post('/admin/decision-requested-vehicle', data);
  },
};

export default adminAPI;