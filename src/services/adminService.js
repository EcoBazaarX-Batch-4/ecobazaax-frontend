import api from "./api";

export const adminService = {
  // --- Dashboard & Analytics ---
  getAdminInsights: async () => {
    const response = await api.get("/insights/admin");
    return response.data;
  },

  getLeaderboards: async () => {
    const response = await api.get("/insights/admin/leaderboards");
    return response.data;
  },

  // --- User Management ---
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

  // --- Seller Applications ---
  getSellerApplications: async () => {
    const response = await api.get("/admin/seller-applications");
    return response.data;
  },

  approveSellerApplication: async (id) => {
    const response = await api.post(`/admin/seller-applications/approve/${id}`);
    return response.data;
  },

  rejectSellerApplication: async (id) => {
    const response = await api.post(`/admin/seller-applications/reject/${id}`);
    return response.data;
  },

  // --- Order Management ---
  getAllOrders: async (params = {}) => {
    const response = await api.get("/admin/orders", { params });
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  // --- CONFIGURATION HELPERS (Required for Seller Forms) ---
  getCategories: async () => {
    const response = await api.get("/admin/categories");
    return response.data;
  },
  
  getMaterials: async () => {
    const response = await api.get("/admin/materials");
    return response.data;
  },
  
  getManufacturingProcesses: async () => {
    const response = await api.get("/admin/manufacturing-processes");
    return response.data;
  },
  
  getPackagingMaterials: async () => {
    const response = await api.get("/admin/packaging-materials");
    return response.data;
  },
  
  getTransportZones: async () => {
    const response = await api.get("/admin/transport-zones");
    return response.data;
  },

  // --- Generic Config CRUD (For Admin Config Hub) ---
  _getEndpoint: (type) => {
    const endpoints = {
      'categories': 'categories',
      'materials': 'materials',
      'manufacturing': 'manufacturing-processes',
      'packaging': 'packaging-materials',
      'transport-zones': 'transport-zones',
      'taxes': 'config/taxes',
      'discounts': 'config/discounts'
    };
    return `/admin/${endpoints[type] || type}`;
  },

  getConfigItems: async (type) => {
    const endpoint = adminService._getEndpoint(type);
    const response = await api.get(endpoint);
    return response.data;
  },

  addConfigItem: async (type, data) => {
    const endpoint = adminService._getEndpoint(type);
    const response = await api.post(endpoint, data);
    return response.data;
  },

  updateConfigItem: async (type, id, data) => {
    const endpoint = adminService._getEndpoint(type);
    const response = await api.put(`${endpoint}/${id}`, data);
    return response.data;
  },

  deleteConfigItem: async (type, id) => {
    const endpoint = adminService._getEndpoint(type);
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  },

  // --- Reports ---
  exportSales: async () => {
    const response = await api.get("/insights/admin/export-all", {
      responseType: 'blob'
    });
    return response.data;
  }
};