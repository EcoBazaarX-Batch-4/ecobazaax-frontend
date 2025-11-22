import api from "./api";

export const customerService = {
  getAddresses: async () => {
    const response = await api.get("/profile/addresses");
    return response.data;
  },

  addAddress: async (addressData) => {
    const response = await api.post("/profile/addresses", addressData);
    return response.data;
  },

  updateAddress: async (id, addressData) => {
    const response = await api.put(`/profile/addresses/${id}`, addressData);
    return response.data;
  },

  deleteAddress: async (id) => {
    const response = await api.delete(`/profile/addresses/${id}`);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get("/profile/orders");
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/profile/orders/${id}`);
    return response.data;
  },

  getProfileInsights: async () => {
    const response = await api.get("/insights/profile");
    return response.data;
  },

  getWishlist: async () => {
    const response = await api.get("/profile/wishlist");
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await api.post(`/profile/wishlist/${productId}`);
    return response.data;
  },

  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/profile/wishlist/${productId}`);
    return response.data;
  },

  getEcoPointsHistory: async () => {
    const response = await api.get("/profile/eco-points-history");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put("/profile/me", profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put("/profile/change-password", passwordData);
    return response.data;
  }
};
