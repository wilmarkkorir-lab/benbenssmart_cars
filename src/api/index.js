import axios from 'axios';

const api = axios.create({
  baseURL: 'https://benbenssmartcars.alwaysdata.net/api/',
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🔗 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', response.config.url);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout - Server might be slow');
      error.message = 'Request timeout. Please try again.';
    } else if (error.response) {
      console.error('🚫 Server Error:', error.response.status, error.response.data);
      error.message = `Server error: ${error.response.status}`;
    } else if (error.request) {
      console.error('🌐 Network Error - Check your internet connection');
      error.message = 'Network error. Please check your internet connection.';
    } else {
      console.error('⚠️ Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
