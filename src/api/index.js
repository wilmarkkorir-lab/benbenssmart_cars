import axios from 'axios';

const api = axios.create({
  baseURL: 'https://benbenssmartcars.alwaysdata.net/api/',
});

export default api;
