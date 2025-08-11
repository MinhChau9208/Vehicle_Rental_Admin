import axios from 'axios';

const BASE_URL = 'https://vehicle.kietpep1303.com/api';

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

  login: (email, password) => apiClient.post('/auth/login', { email, password }),

  getUsersStatistics: () => {
    return apiClient.get('/admin/users-statistics');
  },

  getVehiclesStatistics: () => {
    return apiClient.get('/admin/vehicles-statistics');
  },

  getRequestedUserLevel2: async ({ page = 1, limit = 5 }) => {
    return apiClient.get('/admin/get-requested-user-level2', { params: { page, limit } });
  },

  getRequestedVehicles: async ({ page = 1, limit = 5 }) => {
    return apiClient.get('/admin/get-requested-vehicles', { params: { page, limit } });
  },

  getDetailsVehicle: (vehicleId) => {
    return apiClient.get('/admin/get-details-vehicle', { params: { vehicleId } });
  },

  getDetailsLevel2User: (userId) => {
    return apiClient.get('/admin/get-details-level2-user', { params: { userId } });
  },

  decisionUserLevel2: (data) => {
    return apiClient.post('/admin/decision-requested-user-level2', data);
  },

  decisionVehicle: (data) => {
    return apiClient.post('/admin/decision-requested-vehicle', data);
  },

  getUsers: (params = {}) => {
    return apiClient.get('/admin/get-users', { params });
  },

  getVehicles: (params = {}) => {
    return apiClient.get('/admin/get-vehicles', { params });
  },

  suspendUser: (userId) => 
    apiClient.post('/admin/suspend-user', { userId }),

  unsuspendUser: (userId, status = 'APPROVED') => 
    apiClient.post('/admin/unsuspend-user', { userId, status }),

  suspendVehicle: (vehicleId) => 
    apiClient.post('/admin/suspend-vehicle', { vehicleId }),

  unsuspendVehicle: (vehicleId) =>
    apiClient.post('/admin/unsuspend-vehicle', { vehicleId }),
};

export default adminAPI;