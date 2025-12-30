import axios from 'axios';

const API = axios.create({ baseURL: 'https://rocs-events-application-backend.onrender.com/api' });

// Add token to every request if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = token;
  }
  return req;
});

export default API;
