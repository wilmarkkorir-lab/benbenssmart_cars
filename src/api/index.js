import axios from 'axios';

const api = axios.create({
  baseURL: 'https://benbenssmartcars.alwaysdata.net/api/',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.request && !error.response) {
      error.message = 'Network error. Please check your internet connection.';
    }
    return Promise.reject(error);
  }
);

export default api;
