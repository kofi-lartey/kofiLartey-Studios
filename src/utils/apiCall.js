import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, ''); // Removes trailing slash

// Log to debug
console.log('🌐 VITE_API_URL:', API_URL);
console.log('📡 Full URL will be:', API_URL + '/users/register');

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Interceptor for requests
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response && error.response.status === 401) {
      // Redirect to login if unauthorized
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
        ...(isFormData
          ? {}
          : { 'Content-Type': 'application/json' }),
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
        ...(isFormData
          ? {}
          : { 'Content-Type': 'application/json' }),
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic PATCH request (for partial updates)
export const patch = async (url, data, config = {}) => {
  try {
    const isFormData = data instanceof FormData;

    const response = await apiClient.patch(url, data, {
      ...config,
      headers: {
        ...(config.headers || {}),
        ...(isFormData
          ? {}
          : { 'Content-Type': 'application/json' }),
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic DELETE request
export const del = async (url) => {
  try {
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;