import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

console.log('🌐 VITE_API_URL:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Interceptor for requests
apiClient.interceptors.request.use(
  (config) => {
    // ✅ USE CONSISTENT TOKEN KEY - try both
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token attached to request:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('🔒 401 Unauthorized - redirecting to login');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic GET request
export const get = async (url, params = {}) => {
  try {
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic POST request
export const post = async (url, data = {}, config = {}) => {
  try {
    const isFormData = data instanceof FormData;

    const response = await apiClient.post(url, data, {
      ...config,
      headers: {
        ...(config.headers || {}),
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic PUT request
export const put = async (url, data = {}, config = {}) => {
  try {
    const isFormData = data instanceof FormData;

    const response = await apiClient.put(url, data, {
      ...config,
      headers: {
        ...(config.headers || {}),
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic PATCH request
export const patch = async (url, data, config = {}) => {
  try {
    const isFormData = data instanceof FormData;

    const response = await apiClient.patch(url, data, {
      ...config,
      headers: {
        ...(config.headers || {}),
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic DELETE request - ✅ NOW USING AXIOS WITH CONSISTENT TOKEN
export const del = async (url, data = null) => {
  try {
    const config = {};
    
    // Only add body if data is provided
    if (data) {
      config.data = data;
    }

    const response = await apiClient.delete(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;