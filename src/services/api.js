import axios from 'axios';

// Create an "instance" of axios with our backend's base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

export const getMyProfile = () => {
  return api.get('/profile/me');
};

// We will add our JWT token logic here in a later step
// (e.g., api.interceptors.request.use(...))

export default api;