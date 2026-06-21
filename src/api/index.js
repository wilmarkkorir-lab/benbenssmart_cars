import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';

const cache = {};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => {
    cache[response.config.url] = response.data;
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    } else if (error.response) {
      error.message = `Server error: ${error.response.status}`;
    } else if (error.request) {
      error.message = 'Network error. Please check your internet connection.';
    }
    return Promise.reject(error);
  }
);

export const getCached = (url) => {
  if (cache[url]) return Promise.resolve({ data: cache[url] });
  return api.get(url);
};

export default api;
