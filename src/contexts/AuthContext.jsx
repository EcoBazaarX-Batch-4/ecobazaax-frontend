import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Helper to flatten roles from [{name: "ROLE"}] to ["ROLE"]
  const normalizeUser = (userData) => {
    if (!userData) return null;
    
    let roles = userData.roles || [];
    
    // If roles is array of objects, map to strings
    if (roles.length > 0 && typeof roles[0] === 'object') {
      roles = roles.map(r => r.name || r.authority || r);
    }
    
    return { ...userData, roles };
  };

  useEffect(() => {
    loadUser();
  }, [token]);

  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.getProfile();
      setUser(normalizeUser(userData));
    } catch (error) {
      console.error("Failed to load user:", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    // Spring Boot often sends 'accessToken', checking both to be safe
    const accessToken = data.accessToken || data.token;
    
    localStorage.setItem("token", accessToken);
    setToken(accessToken);
    
    // If the login response includes user info, normalize and set it
    if (data.user) {
        const cleanUser = normalizeUser(data.user);
        setUser(cleanUser);
        // Return modified data so Login.jsx sees the fixed roles immediately
        return { ...data, user: cleanUser };
    }
    
    // If no user in login response, fetch profile immediately
    const userData = await authService.getProfile();
    const cleanUser = normalizeUser(userData);
    setUser(cleanUser);
    return { ...data, user: cleanUser };
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    const accessToken = data.accessToken || data.token;

    localStorage.setItem("token", accessToken);
    setToken(accessToken);
    
    // Same normalization logic as login
    if (data.user) {
        const cleanUser = normalizeUser(data.user);
        setUser(cleanUser);
        return { ...data, user: cleanUser };
    }

    const profileData = await authService.getProfile();
    const cleanUser = normalizeUser(profileData);
    setUser(cleanUser);
    return { ...data, user: cleanUser };
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loadUser,
    hasRole,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};