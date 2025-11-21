import api from "./api";

export const adminService = {
  // ... (Keep existing dashboard, user, and seller app functions)
  getAdminInsights: async () => {
    const response = await api.get("/insights/admin");
    return response.data;
  },

  getLeaderboards: async () => {
    const response = await api.get("/insights/admin/leaderboards");
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getSellerApplications: async () => {
    const response = await api.get("/admin/seller-applications");
    return response.data;
  },

  approveSellerApplication: async (id) => {
    const response = await api.post(`/admin/seller-applications/${id}/approve`);
    return response.data;
  },

  rejectSellerApplication: async (id) => {
    const response = await api.post(`/admin/seller-applications/${id}/reject`);
    return response.data;
  },

  // --- NEW: Order Management ---
  
  getAllOrders: async (page = 0, size = 10) => {
    const response = await api.get(`/admin/orders?page=${page}&size=${size}`);
    return response.data;
  },

  updateOrderStatus: async (orderId, newStatus) => {
    const response = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
    return response.data;
  },

  // ... (Keep config and reports functions)
  getConfigItems: async (type) => {
    const response = await api.get(`/admin/config/${type}`);
    return response.data;
  },
  // ... rest of config functions ...
  
  addConfigItem: async (type, data) => {
    const response = await api.post(`/admin/${type}`, data);
    return response.data;
  },

  updateConfigItem: async (type, id, data) => {
    const response = await api.put(`/admin/${type}/${id}`, data);
    return response.data;
  },

  deleteConfigItem: async (type, id) => {
    const response = await api.delete(`/admin/${type}/${id}`);
    return response.data;
  },

  exportSales: async () => {
    const response = await api.get("/insights/admin/export-all", {
      responseType: 'blob'
    });
    return response.data;
  }
};