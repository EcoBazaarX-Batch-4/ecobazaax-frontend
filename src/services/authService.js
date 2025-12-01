import api from "./api";

export const authService = {
  login: async (credentials) => {
    // Matches POST /api/v1/auth/login
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    // Matches POST /api/v1/auth/register (RegisterRequest DTO)
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  getProfile: async () => {
    // Matches GET /api/v1/profile/me
    const response = await api.get("/profile/me");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};