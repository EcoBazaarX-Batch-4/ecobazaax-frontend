import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/authService'; // Import our API calls
import api, { getMyProfile } from '../services/api'; // Import our main axios instance and the new profile call

// 1. Create the Context
// This is the "box" that will hold our global data
const AuthContext = createContext(null);

// 2. Create the "Provider" Component
// This component will wrap our entire application and *provide* the auth data
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // This will hold the FULL user profile { id, name, roles, ... }
  const [token, setToken] = useState(localStorage.getItem('token')); // Get the token from browser storage
  const [loading, setLoading] = useState(true); // Tracks initial page load

  // 3. This runs ONCE on app load to check if we're already logged in
  useEffect(() => {
    const loadUserFromToken = async () => {
      if (token) {
        // We have a token. Set it on our API header.
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Fetch the user's profile to verify the token is valid
          const response = await getMyProfile();
          setUser(response.data); // Save the full user profile
        } catch (error) {
          console.error("Token is invalid, logging out:", error);
          // Token was bad (expired or invalid), so log them out
          logout();
        }
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, [token]); // This effect re-runs if the token ever changes

  // 4. Login Function
  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      const { accessToken } = response.data;

      // Save the token
      localStorage.setItem('token', accessToken);
      
      // Set the token on the API header for all future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Fetch and save the user's profile
      const profileResponse = await getMyProfile();
      setUser(profileResponse.data);
      
      setToken(accessToken); // Set the token in state
      
      return profileResponse; // Return success
    } catch (error) {
      logout(); // Make sure we're fully logged out if login fails
      throw error; // Let the component handle the error message
    }
  };
  
  // 5. Register Function (and auto-login)
  const register = async (name, email, password) => {
    try {
      const response = await apiRegister(name, email, password);
      const { accessToken } = response.data;
      
      // Save the token and log them in
      localStorage.setItem('token', accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Fetch and save the user's profile
      const profileResponse = await getMyProfile();
      setUser(profileResponse.data);

      setToken(accessToken); // Set the token in state
      
      return profileResponse;
    } catch (error) {
      logout();
      throw error;
    }
  };

  // 6. Logout Function
  const logout = () => {
    // Remove everything
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user, // A simple boolean: true if user is not null
    roles: user?.roles || [],
    login,
    register,
    logout,
  };

  // We don't render the rest of the app until we've checked for a token
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 8. Create a "hook"
// This is a simple shortcut for our components to get the auth data
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};