import api from './api';

/**
 * Sends a login request to the backend.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
export const login = (email, password) => {
  // This sends a POST request to http://localhost:8080/api/v1/auth/login
  return api.post('/auth/login', {
    email: email,
    password: password,
  });
};

/**
 * Sends a registration request to the backend.
 * @param {string} name - The user's full name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
export const register = (name, email, password) => {
  return api.post('/auth/register', {
    name: name,
    email: email,
    password: password,
  });
};

// We will add the other auth-related API calls (like 'forgotPassword') here.