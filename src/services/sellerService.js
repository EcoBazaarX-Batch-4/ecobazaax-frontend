import api from "./api";

export const sellerService = {
  getSellerInsights: async () => {
    const response = await api.get("/insights/seller");
    return response.data;
  },

  getProductPerformance: async () => {
    const response = await api.get("/insights/seller/product-performance");
    return response.data;
  },

  getSellerProducts: async (page = 0, size = 10) => {
    const response = await api.get(`/seller/products?page=${page}&size=${size}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post("/seller/products", productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/seller/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/seller/products/${id}`);
    return response.data;
  },
  
  getSellerOrders: async (page = 0, size = 10) => {
    const response = await api.get(`/seller/orders?page=${page}&size=${size}`);
    return response.data;
  },

  // Onboarding
  applyToBeSeller: async (applicationData) => {
    const response = await api.post("/seller/apply", applicationData);
    return response.data;
  },

  getApplicationStatus: async () => {
    const response = await api.get("/seller/application-status");
    return response.data;
  },

  // Settings
  updateStoreProfile: async (storeData) => {
    const response = await api.put("/seller/profile", storeData);
    return response.data;
  },

  getPayoutDetails: async () => {
    const response = await api.get("/seller/payout-details");
    return response.data;
  },

  updatePayoutDetails: async (details) => {
    const response = await api.put("/seller/payout-details", details);
    return response.data;
  }
};